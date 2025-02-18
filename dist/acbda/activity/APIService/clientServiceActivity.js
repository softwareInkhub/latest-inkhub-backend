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
exports.getAllSchemas = exports.deleteSchema = exports.updateSchema = exports.getSchema = exports.createSchema = void 0;
const uuid_1 = require("uuid");
const firebaseClientActivity_1 = require("./firebaseClientActivity");
class ClientService {
    constructor() {
        this.COLLECTION_NAME = 'schema';
    }
    static getInstance() {
        if (!ClientService.instance) {
            ClientService.instance = new ClientService();
        }
        return ClientService.instance;
    }
    createSchema(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const uuid = (0, uuid_1.v4)();
            const timestamp = new Date().toISOString();
            const schema = Object.assign(Object.assign({}, data), { uuid, createdAt: timestamp, lastUpdatedAt: timestamp });
            yield firebaseClientActivity_1.firebaseClientActivity.createDocument(this.COLLECTION_NAME, schema, uuid);
            return schema;
        });
    }
    getSchema(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield firebaseClientActivity_1.firebaseClientActivity.getDocument(this.COLLECTION_NAME, data.uuid);
        });
    }
    updateSchema(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateData = Object.assign(Object.assign({}, data.updateData), { lastUpdatedAt: new Date().toISOString() });
            yield firebaseClientActivity_1.firebaseClientActivity.updateDocument(this.COLLECTION_NAME, data.uuid, updateData);
            const updated = yield this.getSchema({ uuid: data.uuid });
            if (!updated)
                throw new Error('Failed to retrieve updated schema');
            return updated;
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
            return yield firebaseClientActivity_1.firebaseClientActivity.getAllDocuments(this.COLLECTION_NAME);
        });
    }
}
const clientService = ClientService.getInstance();
// Controller functions
const createSchema = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('req.body: ' + JSON.stringify(req.body));
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
// Single operations: id, getClientSchema(), editClientSchema(), deleteClientSchema
// BULK PAGINATED OPERATION: getAllClient()
