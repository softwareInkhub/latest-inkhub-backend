"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchChildData = exports.getChildSchemaData = exports.createTable = exports.getAllData = exports.deleteData = exports.updateData = exports.getData = exports.createData = exports.dataService = exports.DataService = void 0;
const uuid_1 = require("uuid");
const firebaseClientActivity_1 = require("./firebaseClientActivity");
const ajv_1 = __importDefault(require("ajv"));
const axios_1 = __importDefault(require("axios"));
const schemaServiceActivity_1 = require("./schemaServiceActivity");
class DataService {
    constructor() {
        this.schemaService = schemaServiceActivity_1.SchemaService.getInstance();
        this.ajv = new ajv_1.default({
            strict: false,
            allErrors: true
        });
    }
    static getInstance() {
        if (!DataService.instance) {
            DataService.instance = new DataService();
        }
        return DataService.instance;
    }
    getSchemaById(schemaId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const schemas = yield firebaseClientActivity_1.firebaseClientActivity.getAllDocuments('schema');
                const schema = schemas.find(s => s.uuid === schemaId);
                if (!schema) {
                    throw new Error(`Schema with id ${schemaId} not found`);
                }
                return Object.assign(Object.assign({}, schema), { parsedSchema: JSON.parse(schema.schema) });
            }
            catch (error) {
                console.error('Error fetching schema:', error);
                throw error;
            }
        });
    }
    getSchemaRelationships(schema) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const relationships = {};
            const properties = JSON.parse(schema.schema).properties;
            for (const [key, prop] of Object.entries(properties)) {
                if (prop.type === 'object' && prop.schemaId) {
                    relationships[key] = { schemaId: prop.schemaId, isArray: false };
                }
                else if (prop.type === 'array' && ((_a = prop.items) === null || _a === void 0 ? void 0 : _a.schemaId)) {
                    relationships[key] = { schemaId: prop.items.schemaId, isArray: true };
                }
            }
            return relationships;
        });
    }
    validateNestedData(data, schemaId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const schema = yield this.getSchemaById(schemaId);
                const relationships = yield this.getSchemaRelationships(schema);
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
                            const referencedData = yield this.getData(relationship.schemaId, item.uuid);
                            if (!referencedData) {
                                throw new Error(`Referenced ${field} with uuid ${item.uuid} not found`);
                            }
                        }
                    }
                }
                return true;
            }
            catch (error) {
                console.error('Validation error:', error);
                throw error;
            }
        });
    }
    getChildSchemaData(parentSchemaId, fieldName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const parentSchema = yield this.getSchemaById(parentSchemaId);
                const relationships = yield this.getSchemaRelationships(parentSchema);
                if (!relationships[fieldName]) {
                    throw new Error(`No child schema found for field ${fieldName}`);
                }
                const childSchemaId = relationships[fieldName].schemaId;
                return yield this.getAllData(childSchemaId);
            }
            catch (error) {
                console.error('Error fetching child schema data:', error);
                throw error;
            }
        });
    }
    createData(schemaId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const schema = yield this.getSchemaById(schemaId);
                yield this.validateNestedData(data, schemaId);
                const uuid = (0, uuid_1.v4)();
                const timestamp = new Date().toISOString();
                // Process nested references
                const relationships = yield this.getSchemaRelationships(schema);
                const processedData = Object.assign({}, data);
                for (const [field, relationship] of Object.entries(relationships)) {
                    if (data[field]) {
                        if (relationship.isArray) {
                            processedData[field] = data[field].map((item) => ({
                                uuid: item.uuid,
                                _ref: true
                            }));
                        }
                        else {
                            processedData[field] = {
                                uuid: data[field].uuid,
                                _ref: true
                            };
                        }
                    }
                }
                const document = Object.assign(Object.assign({}, processedData), { uuid, createdAt: timestamp, lastUpdatedAt: timestamp, _schemaId: schemaId });
                yield firebaseClientActivity_1.firebaseClientActivity.createDocument(schema.schemaName, document, uuid);
                return document;
            }
            catch (error) {
                console.error('Error creating data:', error);
                throw error;
            }
        });
    }
    getData(schemaId, uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = yield this.getSchemaById(schemaId);
            return yield firebaseClientActivity_1.firebaseClientActivity.getDocument(schema.schemaName, uuid);
        });
    }
    updateData(schemaId, uuid, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get schema definition
                const schema = yield this.getSchemaById(schemaId);
                if (!schema) {
                    throw new Error('Schema not found');
                }
                // Parse schema and get allowed properties
                const schemaObj = JSON.parse(schema.schema);
                const allowedProperties = Object.keys(schemaObj.properties || {});
                // Validate data against schema properties
                const validData = Object.keys(data).reduce((acc, key) => {
                    if (allowedProperties.includes(key)) {
                        acc[key] = data[key];
                    }
                    return acc;
                }, {});
                // Update the data
                yield firebaseClientActivity_1.firebaseClientActivity.updateDocument(schema.schemaName, uuid, validData);
            }
            catch (error) {
                console.error('Error in updateData:', error);
                throw error;
            }
        });
    }
    deleteData(schemaId, uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = yield this.getSchemaById(schemaId);
            yield firebaseClientActivity_1.firebaseClientActivity.deleteDocument(schema.schemaName, uuid);
        });
    }
    getAllData(schemaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = yield this.getSchemaById(schemaId);
            return yield firebaseClientActivity_1.firebaseClientActivity.getAllDocuments(schema.schemaName);
        });
    }
    createTableForSchema(schemaId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get schema details
                const schemas = yield firebaseClientActivity_1.firebaseClientActivity.getAllDocuments('schema');
                const schema = schemas.find(s => s.uuid === schemaId);
                if (!schema) {
                    throw new Error(`Schema with id ${schemaId} not found`);
                }
                // Initialize collection with metadata
                const timestamp = new Date().toISOString();
                yield firebaseClientActivity_1.firebaseClientActivity.createDocument(schema.schemaName, {
                    _metadata: {
                        schemaId: schema.uuid,
                        schemaName: schema.schemaName,
                        createdAt: timestamp,
                        lastUpdatedAt: timestamp,
                        isInitialized: true
                    }
                }, '_metadata');
                // Call schema service to update schema with table reference
                yield this.updateSchemaWithTableRef(schema.uuid, schema.schemaName);
            }
            catch (error) {
                console.error('Error creating table for schema:', error);
                if (error instanceof Error) {
                    throw new Error(`Failed to create table: ${error.message}`);
                }
                throw new Error('Failed to create table: Unknown error');
            }
        });
    }
    updateSchemaWithTableRef(schemaId, tableName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.put('http://localhost:3000/api/updateSchemaTableRef', {
                    uuid: schemaId,
                    tableRef: tableName
                });
                if (!response.data) {
                    throw new Error('Failed to update schema with table reference');
                }
            }
            catch (error) {
                console.error('Error updating schema with table reference:', error);
                throw error;
            }
        });
    }
    // Add new controller for fetching child data
    searchChildData(childSchemaId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allData = yield this.getAllData(childSchemaId);
                // Implement basic search across all fields
                return allData.filter(item => Object.values(item).some(value => String(value).toLowerCase().includes(query.toLowerCase())));
            }
            catch (error) {
                console.error('Error searching child data:', error);
                throw error;
            }
        });
    }
    createTable(schemaId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const schema = yield this.schemaService.getSchema({ uuid: schemaId });
                if (!schema)
                    throw new Error('Schema not found');
                const tableRef = `data_${schemaId}`;
                yield this.schemaService.updateSchemaTableRef({ uuid: schemaId, tableRef });
                return tableRef;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.DataService = DataService;
// Export singleton instance
exports.dataService = DataService.getInstance();
// Controller functions
const createData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { schemaId, data } = req.body;
        if (!schemaId || !data) {
            return res.status(400).json({ error: 'Schema ID and data are required' });
        }
        const document = yield exports.dataService.createData(schemaId, data);
        res.status(201).json(document);
    }
    catch (error) {
        console.error('Error in createData controller:', error);
        res.status(error.message.includes('validation') ? 400 : 500)
            .json({ error: error.message });
    }
});
exports.createData = createData;
const getData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { schemaId, uuid } = req.body;
        if (!schemaId || !uuid) {
            return res.status(400).json({ error: 'Schema ID and uuid are required' });
        }
        const document = yield exports.dataService.getData(schemaId, uuid);
        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }
        res.status(200).json(document);
    }
    catch (error) {
        console.error('Error in getData controller:', error);
        res.status(500).json({ error: 'Failed to get document' });
    }
});
exports.getData = getData;
const updateData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { schemaId, uuid, data } = req.body;
        if (!schemaId || !uuid || !data) {
            return res.status(400).json({ error: 'Schema ID, uuid, and data are required' });
        }
        yield exports.dataService.updateData(schemaId, uuid, data);
        res.status(200).json({ message: 'Data updated successfully' });
    }
    catch (error) {
        console.error('Error in updateData controller:', error);
        res.status(error.message.includes('validation') ? 400 : 500)
            .json({ error: error.message });
    }
});
exports.updateData = updateData;
const deleteData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { schemaId, uuid } = req.body;
        if (!schemaId || !uuid) {
            return res.status(400).json({ error: 'Schema ID and uuid are required' });
        }
        yield exports.dataService.deleteData(schemaId, uuid);
        res.status(204).send();
    }
    catch (error) {
        console.error('Error in deleteData controller:', error);
        res.status(500).json({ error: 'Failed to delete document' });
    }
});
exports.deleteData = deleteData;
const getAllData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { schemaId } = req.body;
        if (!schemaId) {
            return res.status(400).json({ error: 'Schema ID is required' });
        }
        const documents = yield exports.dataService.getAllData(schemaId);
        res.status(200).json(documents);
    }
    catch (error) {
        console.error('Error in getAllData controller:', error);
        res.status(500).json({ error: 'Failed to retrieve documents' });
    }
});
exports.getAllData = getAllData;
const createTable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { schemaId } = req.body;
        if (!schemaId) {
            return res.status(400).json({ error: 'Schema ID is required' });
        }
        yield exports.dataService.createTableForSchema(schemaId);
        res.status(201).json({ message: 'Table created successfully' });
    }
    catch (error) {
        console.error('Error in createTable controller:', error);
        res.status(500).json({ error: error.message });
    }
});
exports.createTable = createTable;
// Add new controller functions
const getChildSchemaData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { parentSchemaId, fieldName } = req.body;
        if (!parentSchemaId || !fieldName) {
            return res.status(400).json({ error: 'Parent schema ID and field name are required' });
        }
        const data = yield exports.dataService.getChildSchemaData(parentSchemaId, fieldName);
        res.status(200).json(data);
    }
    catch (error) {
        console.error('Error in getChildSchemaData controller:', error);
        res.status(500).json({ error: error.message });
    }
});
exports.getChildSchemaData = getChildSchemaData;
const searchChildData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { childSchemaId, query } = req.body;
        if (!childSchemaId || !query) {
            return res.status(400).json({ error: 'Child schema ID and search query are required' });
        }
        const data = yield exports.dataService.searchChildData(childSchemaId, query);
        res.status(200).json(data);
    }
    catch (error) {
        console.error('Error in searchChildData controller:', error);
        res.status(500).json({ error: error.message });
    }
});
exports.searchChildData = searchChildData;
