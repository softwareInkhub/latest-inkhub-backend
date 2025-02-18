import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { firebaseClientActivity } from './firebaseClientActivity';
import Ajv from 'ajv';
import axios from 'axios';
import { DataBuilder } from '../../builders/DataBuilder'
import { Schema } from '../../../types';
import { SchemaService } from './schemaServiceActivity';

interface DataDocument {
    uuid: string;
    createdAt: string;
    lastUpdatedAt: string;
    [key: string]: any;
}

interface SchemaReference {
    schemaId: string;
    isArray: boolean;
}

interface SchemaRelationship {
    [fieldName: string]: SchemaReference;
}

interface SchemaProperty {
    type: string;
    schemaId?: string;
    items?: {
        schemaId?: string;
    };
}

export class DataService {
    private static instance: DataService;
    private readonly schemaService: SchemaService;
    private ajv: Ajv;

    private constructor() {
        this.schemaService = SchemaService.getInstance();
        this.ajv = new Ajv({
            strict: false,
            allErrors: true
        });
    }

    public static getInstance(): DataService {
        if (!DataService.instance) {
            DataService.instance = new DataService();
        }
        return DataService.instance;
    }

    private async getSchemaById(schemaId: string): Promise<any> {
        try {
            const schemas = await firebaseClientActivity.getAllDocuments('schema');
            const schema = schemas.find(s => s.uuid === schemaId);
            if (!schema) {
                throw new Error(`Schema with id ${schemaId} not found`);
            }
            return {
                ...schema,
                parsedSchema: JSON.parse(schema.schema)
            };
        } catch (error) {
            console.error('Error fetching schema:', error);
            throw error;
        }
    }

    private async getSchemaRelationships(schema: any): Promise<SchemaRelationship> {
        const relationships: SchemaRelationship = {};
        const properties = JSON.parse(schema.schema).properties as Record<string, SchemaProperty>;

        for (const [key, prop] of Object.entries(properties)) {
            if (prop.type === 'object' && prop.schemaId) {
                relationships[key] = { schemaId: prop.schemaId, isArray: false };
            } else if (prop.type === 'array' && prop.items?.schemaId) {
                relationships[key] = { schemaId: prop.items.schemaId, isArray: true };
            }
        }

        return relationships;
    }

    private async validateNestedData(data: any, schemaId: string): Promise<boolean> {
        try {
            const schema = await this.getSchemaById(schemaId);
            const relationships = await this.getSchemaRelationships(schema);

            // Create validation schema with nested references resolved
            const validationSchema = {
                type: 'object',
                properties: JSON.parse(schema.schema).properties,
                required: JSON.parse(schema.schema).required || [],
                additionalProperties: false
            };

            // Validate main schema
            const validate = this.ajv.compile(validationSchema);
            const isValid = validate(data);

            if (!isValid) {
                throw new Error(`Validation failed: ${this.ajv.errorsText(validate.errors)}`);
            }

            // Validate nested schemas
            for (const [field, relationship] of Object.entries(relationships)) {
                if (data[field]) {
                    const nestedData = Array.isArray(data[field]) ? data[field] : [data[field]];
                    for (const item of nestedData) {
                        const referencedData = await this.getData(relationship.schemaId, item.uuid);
                        if (!referencedData) {
                            throw new Error(`Referenced ${field} with uuid ${item.uuid} not found`);
                        }
                    }
                }
            }

            return true;
        } catch (error) {
            console.error('Validation error:', error);
            throw error;
        }
    }

    async getChildSchemaData(parentSchemaId: string, fieldName: string): Promise<any[]> {
        try {
            const parentSchema = await this.getSchemaById(parentSchemaId);
            const relationships = await this.getSchemaRelationships(parentSchema);
            
            if (!relationships[fieldName]) {
                throw new Error(`No child schema found for field ${fieldName}`);
            }

            const childSchemaId = relationships[fieldName].schemaId;
            return await this.getAllData(childSchemaId);
        } catch (error) {
            console.error('Error fetching child schema data:', error);
            throw error;
        }
    }

    async createData(schemaId: string, data: any): Promise<DataDocument> {
        try {
            const schema = await this.getSchemaById(schemaId);
            await this.validateNestedData(data, schemaId);

            const uuid = uuidv4();
            const timestamp = new Date().toISOString();

            // Process nested references
            const relationships = await this.getSchemaRelationships(schema);
            const processedData: any = { ...data };

            for (const [field, relationship] of Object.entries(relationships)) {
                if (data[field]) {
                    if (relationship.isArray) {
                        processedData[field] = data[field].map((item: any) => ({
                            uuid: item.uuid,
                            _ref: true
                        }));
                    } else {
                        processedData[field] = {
                            uuid: data[field].uuid,
                            _ref: true
                        };
                    }
                }
            }

            const document: DataDocument = {
                ...processedData,
                uuid,
                createdAt: timestamp,
                lastUpdatedAt: timestamp,
                _schemaId: schemaId
            };

            await firebaseClientActivity.createDocument(schema.schemaName, document, uuid);
            return document;
        } catch (error) {
            console.error('Error creating data:', error);
            throw error;
        }
    }

    async getData(schemaId: string, uuid: string): Promise<DataDocument | null> {
        const schema = await this.getSchemaById(schemaId);
        return await firebaseClientActivity.getDocument(schema.schemaName, uuid);
    }

    async updateData(schemaId: string, uuid: string, data: any): Promise<void> {
        try {
            // Get schema definition
            const schema = await this.getSchemaById(schemaId);
            if (!schema) {
                throw new Error('Schema not found');
            }

            // Parse schema and get allowed properties
            const schemaObj = JSON.parse(schema.schema);
            const allowedProperties = Object.keys(schemaObj.properties || {});

            // Validate data against schema properties
            const validData = Object.keys(data).reduce((acc: any, key) => {
                if (allowedProperties.includes(key)) {
                    acc[key] = data[key];
                }
                return acc;
            }, {});

            // Update the data
            await firebaseClientActivity.updateDocument(schema.schemaName, uuid, validData);
        } catch (error) {
            console.error('Error in updateData:', error);
            throw error;
        }
    }

    async deleteData(schemaId: string, uuid: string): Promise<void> {
        const schema = await this.getSchemaById(schemaId);
        await firebaseClientActivity.deleteDocument(schema.schemaName, uuid);
    }

    async getAllData(schemaId: string): Promise<DataDocument[]> {
        const schema = await this.getSchemaById(schemaId);
        return await firebaseClientActivity.getAllDocuments(schema.schemaName);
    }

    async createTableForSchema(schemaId: string): Promise<void> {
        try {
            // Get schema details
            const schemas = await firebaseClientActivity.getAllDocuments('schema');
            const schema = schemas.find(s => s.uuid === schemaId);
            
            if (!schema) {
                throw new Error(`Schema with id ${schemaId} not found`);
            }

            // Initialize collection with metadata
            const timestamp = new Date().toISOString();
            await firebaseClientActivity.createDocument(
                schema.schemaName,
                {
                    _metadata: {
                        schemaId: schema.uuid,
                        schemaName: schema.schemaName,
                        createdAt: timestamp,
                        lastUpdatedAt: timestamp,
                        isInitialized: true
                    }
                },
                '_metadata'
            );

            // Call schema service to update schema with table reference
            await this.updateSchemaWithTableRef(schema.uuid, schema.schemaName);

        } catch (error: unknown) {
            console.error('Error creating table for schema:', error);
            if (error instanceof Error) {
                throw new Error(`Failed to create table: ${error.message}`);
            }
            throw new Error('Failed to create table: Unknown error');
        }
    }

    private async updateSchemaWithTableRef(schemaId: string, tableName: string): Promise<void> {
        try {
            const response = await axios.put('http://localhost:3000/api/updateSchemaTableRef', {
                uuid: schemaId,
                tableRef: tableName
            });
            if (!response.data) {
                throw new Error('Failed to update schema with table reference');
            }
        } catch (error) {
            console.error('Error updating schema with table reference:', error);
            throw error;
        }
    }

    // Add new controller for fetching child data
    async searchChildData(childSchemaId: string, query: string): Promise<DataDocument[]> {
        try {
            const allData = await this.getAllData(childSchemaId);
            // Implement basic search across all fields
            return allData.filter(item => 
                Object.values(item).some(value => 
                    String(value).toLowerCase().includes(query.toLowerCase())
                )
            );
        } catch (error) {
            console.error('Error searching child data:', error);
            throw error;
        }
    }

    async createTable(schemaId: string): Promise<string> {
        try {
            const schema = await this.schemaService.getSchema({ uuid: schemaId });
            if (!schema) throw new Error('Schema not found');

            const tableRef = `data_${schemaId}`;
            await this.schemaService.updateSchemaTableRef({ uuid: schemaId, tableRef });
            return tableRef;
        } catch (error) {
            throw error;
        }
    }
}

// Export singleton instance
export const dataService = DataService.getInstance();

// Controller functions
export const createData = async (req: Request, res: Response) => {
    try {
        const { schemaId, data } = req.body;
        if (!schemaId || !data) {
            return res.status(400).json({ error: 'Schema ID and data are required' });
        }

        const document = await dataService.createData(schemaId, data);
        res.status(201).json(document);
    } catch (error: any) {
        console.error('Error in createData controller:', error);
        res.status(error.message.includes('validation') ? 400 : 500)
            .json({ error: error.message });
    }
};

export const getData = async (req: Request, res: Response) => {
    try {
        const { schemaId, uuid } = req.body;
        if (!schemaId || !uuid) {
            return res.status(400).json({ error: 'Schema ID and uuid are required' });
        }

        const document = await dataService.getData(schemaId, uuid);
        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }
        
        res.status(200).json(document);
    } catch (error) {
        console.error('Error in getData controller:', error);
        res.status(500).json({ error: 'Failed to get document' });
    }
};

export const updateData = async (req: Request, res: Response) => {
    try {
        const { schemaId, uuid, data } = req.body;
        if (!schemaId || !uuid || !data) {
            return res.status(400).json({ error: 'Schema ID, uuid, and data are required' });
        }

        await dataService.updateData(schemaId, uuid, data);
        res.status(200).json({ message: 'Data updated successfully' });
    } catch (error: any) {
        console.error('Error in updateData controller:', error);
        res.status(error.message.includes('validation') ? 400 : 500)
            .json({ error: error.message });
    }
};

export const deleteData = async (req: Request, res: Response) => {
    try {
        const { schemaId, uuid } = req.body;
        if (!schemaId || !uuid) {
            return res.status(400).json({ error: 'Schema ID and uuid are required' });
        }

        await dataService.deleteData(schemaId, uuid);
        res.status(204).send();
    } catch (error) {
        console.error('Error in deleteData controller:', error);
        res.status(500).json({ error: 'Failed to delete document' });
    }
};

export const getAllData = async (req: Request, res: Response) => {
    try {
        const { schemaId } = req.body;
        if (!schemaId) {
            return res.status(400).json({ error: 'Schema ID is required' });
        }

        const documents = await dataService.getAllData(schemaId);
        res.status(200).json(documents);
    } catch (error) {
        console.error('Error in getAllData controller:', error);
        res.status(500).json({ error: 'Failed to retrieve documents' });
    }
};

export const createTable = async (req: Request, res: Response) => {
    try {
        const { schemaId } = req.body;
        if (!schemaId) {
            return res.status(400).json({ error: 'Schema ID is required' });
        }

        await dataService.createTableForSchema(schemaId);
        res.status(201).json({ message: 'Table created successfully' });
    } catch (error: any) {
        console.error('Error in createTable controller:', error);
        res.status(500).json({ error: error.message });
    }
};

// Add new controller functions
export const getChildSchemaData = async (req: Request, res: Response) => {
    try {
        const { parentSchemaId, fieldName } = req.body;
        if (!parentSchemaId || !fieldName) {
            return res.status(400).json({ error: 'Parent schema ID and field name are required' });
        }

        const data = await dataService.getChildSchemaData(parentSchemaId, fieldName);
        res.status(200).json(data);
    } catch (error: any) {
        console.error('Error in getChildSchemaData controller:', error);
        res.status(500).json({ error: error.message });
    }
};

export const searchChildData = async (req: Request, res: Response) => {
    try {
        const { childSchemaId, query } = req.body;
        if (!childSchemaId || !query) {
            return res.status(400).json({ error: 'Child schema ID and search query are required' });
        }

        const data = await dataService.searchChildData(childSchemaId, query);
        res.status(200).json(data);
    } catch (error: any) {
        console.error('Error in searchChildData controller:', error);
        res.status(500).json({ error: error.message });
    }
}; 