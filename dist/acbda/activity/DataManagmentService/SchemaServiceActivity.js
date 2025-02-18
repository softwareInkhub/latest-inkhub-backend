"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSchemaTableRef = exports.getAllSchemas = exports.deleteSchema = exports.updateSchema = exports.getSchema = exports.createSchema = exports.SchemaService = void 0;
const uuid_1 = require("uuid");
const firebaseClientActivity_1 = require("./firebaseClientActivity");
const SchemaBuilder_1 = require("../../builders/SchemaBuilder");
class SchemaService {
    constructor() {
        this.COLLECTION_NAME = 'schema';
    }
    static getInstance() {
        if (!SchemaService.instance) {
            SchemaService.instance = new SchemaService();
        }
        return SchemaService.instance;
    }
    createSchema(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const uuid = (0, uuid_1.v4)();
            try {
                // Validate the incoming schema
                const validatedSchema = SchemaBuilder_1.SchemaBuilder.validateSchema(data.schema);
                // Create a new schema using the builder
                const schemaBuilder = new SchemaBuilder_1.SchemaBuilder(uuid, data.schemaName)
                    .addProperties(validatedSchema.properties);
                if (validatedSchema.required) {
                    schemaBuilder.addRequired(validatedSchema.required);
                }
                if (validatedSchema.additionalProperties !== undefined) {
                    schemaBuilder.setAdditionalProperties(validatedSchema.additionalProperties);
                }
                const schema = schemaBuilder.build();
                yield firebaseClientActivity_1.firebaseClientActivity.createDocument(this.COLLECTION_NAME, schema, uuid);
                return schema;
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Failed to create schema: ${error.message}`);
                }
                throw new Error('Failed to create schema: Unknown error');
            }
        });
    }
    getSchema(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = yield firebaseClientActivity_1.firebaseClientActivity.getDocument(this.COLLECTION_NAME, data.uuid);
            if (!doc)
                return null;
            return doc;
        });
    }
    updateSchema(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uuid, updateData } = data;
            try {
                const existingSchema = yield this.getSchema({ uuid });
                if (!existingSchema) {
                    throw new Error('Schema not found');
                }
                // If schema is being updated, validate it
                if (updateData.schema) {
                    const validatedSchema = SchemaBuilder_1.SchemaBuilder.validateSchema(updateData.schema);
                    // Update using builder
                    const schemaBuilder = SchemaBuilder_1.SchemaBuilder.fromExisting(existingSchema)
                        .addProperties(validatedSchema.properties);
                    if (validatedSchema.required) {
                        schemaBuilder.addRequired(validatedSchema.required);
                    }
                    if (validatedSchema.additionalProperties !== undefined) {
                        schemaBuilder.setAdditionalProperties(validatedSchema.additionalProperties);
                    }
                    const updatedSchema = schemaBuilder.build();
                    yield firebaseClientActivity_1.firebaseClientActivity.updateDocument(this.COLLECTION_NAME, uuid, updatedSchema);
                    return updatedSchema;
                }
                // If only metadata is being updated
                const updatedSchema = Object.assign(Object.assign(Object.assign({}, existingSchema), updateData), { lastUpdatedAt: new Date().toISOString() });
                yield firebaseClientActivity_1.firebaseClientActivity.updateDocument(this.COLLECTION_NAME, uuid, updatedSchema);
                return updatedSchema;
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Failed to update schema: ${error.message}`);
                }
                throw new Error('Failed to update schema: Unknown error');
            }
        });
    }
    deleteSchema(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield firebaseClientActivity_1.firebaseClientActivity.deleteDocument(this.COLLECTION_NAME, data.uuid);
        });
    }
    getAllSchemas() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Inside getAllSchemas');
            const docs = yield firebaseClientActivity_1.firebaseClientActivity.getAllDocuments(this.COLLECTION_NAME);
            return docs;
        });
    }
    updateSchemaTableRef(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { uuid, tableRef } = data;
                const updateData = {
                    tableRef,
                    lastUpdatedAt: new Date().toISOString(),
                    isTableInitialized: true
                };
                yield firebaseClientActivity_1.firebaseClientActivity.updateDocument(this.COLLECTION_NAME, uuid, updateData);
                const updated = yield this.getSchema({ uuid });
                if (!updated)
                    throw new Error('Failed to retrieve updated schema');
                return updated;
            }
            catch (error) {
                console.error('Error updating schema table reference:', error);
                throw error;
            }
        });
    }
}
exports.SchemaService = SchemaService;
const clientService = SchemaService.getInstance();
// Controller functions
const createSchema = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('req.body: ' + req.body);
        const clientSchema = yield clientService.createSchema(req.body);
        res.status(201).json(clientSchema);
    }
    catch (error) {
        console.error('Error in createClientSchema controller:', error);
        res.status(500).json({ error: 'Failed to create client schema' });
    }
});
exports.createSchema = createSchema;
const getSchema = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uuid } = req.body; // Get uuid from request body
        console.log('uuid: ' + uuid);
        console.log('req.body: ' + JSON.stringify(req.body));
        // Validate the uuid
        if (!uuid || typeof uuid !== 'string') {
            return res.status(400).json({ error: 'Invalid or missing uuid' });
        }
        // Proceed with fetching the client schema using the uuid
        const clientSchema = yield clientService.getSchema({ uuid });
        if (!clientSchema) {
            return res.status(404).json({ error: 'Client schema not found' });
        }
        res.status(200).json(clientSchema);
    }
    catch (error) {
        console.error('Error in getClientSchema controller:', error);
        res.status(500).json({ error: 'Failed to get client schema' });
    }
});
exports.getSchema = getSchema;
const updateSchema = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _a = req.body, { uuid } = _a, updateData = __rest(_a, ["uuid"]); // Get uuid and update data from request body
        const clientSchema = yield clientService.updateSchema({ uuid, updateData });
        res.status(200).json(clientSchema);
    }
    catch (error) {
        console.error('Error in updateClientSchema controller:', error);
        res.status(500).json({ error: 'Failed to update client schema' });
    }
});
exports.updateSchema = updateSchema;
const deleteSchema = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uuid } = req.body; // Get uuid from request body
        yield clientService.deleteSchema({ uuid });
        res.status(204).send();
    }
    catch (error) {
        console.error('Error in deleteClientSchema controller:', error);
        res.status(500).json({ error: 'Failed to delete client schema' });
    }
});
exports.deleteSchema = deleteSchema;
const getAllSchemas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schemas = yield clientService.getAllSchemas();
        res.status(200).json(schemas);
    }
    catch (error) {
        console.error('Error in getAllSchemas controller:', error);
        res.status(500).json({ error: 'Failed to retrieve schemas' });
    }
});
exports.getAllSchemas = getAllSchemas;
const updateSchemaTableRef = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uuid, tableRef } = req.body;
        if (!uuid || !tableRef) {
            return res.status(400).json({ error: 'Schema ID and table reference are required' });
        }
        const updatedSchema = yield clientService.updateSchemaTableRef({ uuid, tableRef });
        res.status(200).json(updatedSchema);
    }
    catch (error) {
        console.error('Error in updateSchemaTableRef controller:', error);
        res.status(500).json({ error: 'Failed to update schema table reference' });
    }
});
exports.updateSchemaTableRef = updateSchemaTableRef;
// Single operations: id, getClientSchema(), editClientSchema(), deleteClientSchema
// BULK PAGINATED OPERATION: getAllClient()
