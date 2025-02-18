/*
DOCUMENTATION
ClientServiceActivity

Summary: 
Create, edit, delete Client for external APIs

Method details:
CLient single CRUD operations
Client Bulk operations:
    1. GetAll()
    2.  


Created By: Mohit 
Date:

*/

import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { firebaseClientActivity } from './firebaseClientActivity';
import { SchemaBuilder } from '../../builders/SchemaBuilder';
import { Schema } from '../../../types';

interface schema extends Schema {
    [key: string]: any;
}

export class SchemaService {
    private static instance: SchemaService;
    private readonly COLLECTION_NAME = 'schema';

    private constructor() {}

    public static getInstance(): SchemaService {
        if (!SchemaService.instance) {
            SchemaService.instance = new SchemaService();
        }
        return SchemaService.instance;
    }

    async createSchema(data: any): Promise<Schema> {
        const uuid = uuidv4();
        
        try {
            // Validate the incoming schema
            const validatedSchema = SchemaBuilder.validateSchema(data.schema);
            
            // Create a new schema using the builder
            const schemaBuilder = new SchemaBuilder(uuid, data.schemaName)
                .addProperties(validatedSchema.properties);

            if (validatedSchema.required) {
                schemaBuilder.addRequired(validatedSchema.required);
            }

            if (validatedSchema.additionalProperties !== undefined) {
                schemaBuilder.setAdditionalProperties(validatedSchema.additionalProperties);
            }

            const schema = schemaBuilder.build();

            await firebaseClientActivity.createDocument(this.COLLECTION_NAME, schema, uuid);
            return schema;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Failed to create schema: ${error.message}`);
            }
            throw new Error('Failed to create schema: Unknown error');
        }
    }

    async getSchema(data: { uuid: string }): Promise<Schema | null> {
        const doc = await firebaseClientActivity.getDocument(this.COLLECTION_NAME, data.uuid);
        if (!doc) return null;
        return doc as Schema;
    }

    async updateSchema(data: any): Promise<Schema> {
        const { uuid, updateData } = data;
        
        try {
            const existingSchema = await this.getSchema({ uuid });
            if (!existingSchema) {
                throw new Error('Schema not found');
            }

            // If schema is being updated, validate it
            if (updateData.schema) {
                const validatedSchema = SchemaBuilder.validateSchema(updateData.schema);
                
                // Update using builder
                const schemaBuilder = SchemaBuilder.fromExisting(existingSchema)
                    .addProperties(validatedSchema.properties);

                if (validatedSchema.required) {
                    schemaBuilder.addRequired(validatedSchema.required);
                }

                if (validatedSchema.additionalProperties !== undefined) {
                    schemaBuilder.setAdditionalProperties(validatedSchema.additionalProperties);
                }

                const updatedSchema = schemaBuilder.build();
                await firebaseClientActivity.updateDocument(this.COLLECTION_NAME, uuid, updatedSchema);
                return updatedSchema;
            }

            // If only metadata is being updated
            const updatedSchema: Schema = {
                ...existingSchema,
                ...updateData,
                lastUpdatedAt: new Date().toISOString()
            };

            await firebaseClientActivity.updateDocument(this.COLLECTION_NAME, uuid, updatedSchema);
            return updatedSchema;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Failed to update schema: ${error.message}`);
            }
            throw new Error('Failed to update schema: Unknown error');
        }
    }

    async deleteSchema(data: { uuid: string }): Promise<void> {
        await firebaseClientActivity.deleteDocument(this.COLLECTION_NAME, data.uuid);
    }

    async getAllSchemas(): Promise<Schema[]> {
        console.log('Inside getAllSchemas');
        const docs = await firebaseClientActivity.getAllDocuments(this.COLLECTION_NAME);
        return docs as Schema[];
    }

    async updateSchemaTableRef(data: { uuid: string; tableRef: string }): Promise<schema> {
        try {
            const { uuid, tableRef } = data;
            const updateData = {
                tableRef,
                lastUpdatedAt: new Date().toISOString(),
                isTableInitialized: true
            };

            await firebaseClientActivity.updateDocument(this.COLLECTION_NAME, uuid, updateData);
            const updated = await this.getSchema({ uuid });
            if (!updated) throw new Error('Failed to retrieve updated schema');
            return updated as schema;
        } catch (error) {
            console.error('Error updating schema table reference:', error);
            throw error;
        }
    }
}

const clientService = SchemaService.getInstance();

// Controller functions
export const createSchema = async (req: Request, res: Response) => {
    try {
        console.log('req.body: ' + req.body);
        const clientSchema = await clientService.createSchema(req.body);
        res.status(201).json(clientSchema);
    } catch (error) {
        console.error('Error in createClientSchema controller:', error);
        res.status(500).json({ error: 'Failed to create client schema' });
    }
};

export const getSchema = async (req: Request, res: Response) => {
    try {
        const { uuid } = req.body; // Get uuid from request body
        console.log('uuid: ' + uuid);
        console.log('req.body: ' + JSON.stringify(req.body));

        // Validate the uuid
        if (!uuid || typeof uuid !== 'string') {
            return res.status(400).json({ error: 'Invalid or missing uuid' });
        }

        // Proceed with fetching the client schema using the uuid
        const clientSchema = await clientService.getSchema({ uuid });
        
        if (!clientSchema) {
            return res.status(404).json({ error: 'Client schema not found' });
        }
        
        res.status(200).json(clientSchema);
    } catch (error) {
        console.error('Error in getClientSchema controller:', error);
        res.status(500).json({ error: 'Failed to get client schema' });
    }
};

export const updateSchema = async (req: Request, res: Response) => {
    try {
        const { uuid, ...updateData } = req.body; // Get uuid and update data from request body
        const clientSchema = await clientService.updateSchema({ uuid, updateData });
        res.status(200).json(clientSchema);
    } catch (error) {
        console.error('Error in updateClientSchema controller:', error);
        res.status(500).json({ error: 'Failed to update client schema' });
    }
};

export const deleteSchema = async (req: Request, res: Response) => {
    try {
        const { uuid } = req.body; // Get uuid from request body
        await clientService.deleteSchema({ uuid });
        res.status(204).send();
    } catch (error) {
        console.error('Error in deleteClientSchema controller:', error);
        res.status(500).json({ error: 'Failed to delete client schema' });
    }
};

export const getAllSchemas = async (req: Request, res: Response) => {
    try {
        const schemas = await clientService.getAllSchemas();
        res.status(200).json(schemas);
    } catch (error) {
        console.error('Error in getAllSchemas controller:', error);
        res.status(500).json({ error: 'Failed to retrieve schemas' });
    }
};

export const updateSchemaTableRef = async (req: Request, res: Response) => {
    try {
        const { uuid, tableRef } = req.body;
        if (!uuid || !tableRef) {
            return res.status(400).json({ error: 'Schema ID and table reference are required' });
        }

        const updatedSchema = await clientService.updateSchemaTableRef({ uuid, tableRef });
        res.status(200).json(updatedSchema);
    } catch (error) {
        console.error('Error in updateSchemaTableRef controller:', error);
        res.status(500).json({ error: 'Failed to update schema table reference' });
    }
};

// Single operations: id, getClientSchema(), editClientSchema(), deleteClientSchema
// BULK PAGINATED OPERATION: getAllClient()