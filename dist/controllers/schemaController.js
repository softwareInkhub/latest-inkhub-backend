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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSchema = exports.updateSchema = exports.getAllSchemas = exports.getSchema = exports.createSchema = void 0;
const schemaServiceActivity_1 = require("../acbda/activity/DataManagmentService/schemaServiceActivity");
const schemaService = schemaServiceActivity_1.SchemaService.getInstance();
const createSchema = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schema = yield schemaService.createSchema(req.body);
        res.status(201).json(schema);
        return;
    }
    catch (error) {
        next(error);
    }
});
exports.createSchema = createSchema;
const getSchema = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schema = yield schemaService.getSchema({ uuid: req.params.uuid });
        if (!schema) {
            res.status(404).json({ error: 'Schema not found' });
            return;
        }
        res.json(schema);
        return;
    }
    catch (error) {
        next(error);
    }
});
exports.getSchema = getSchema;
const getAllSchemas = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schemas = yield schemaService.getAllSchemas();
        res.json(schemas);
        return;
    }
    catch (error) {
        next(error);
    }
});
exports.getAllSchemas = getAllSchemas;
const updateSchema = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schema = yield schemaService.updateSchema(Object.assign({ uuid: req.params.uuid }, req.body));
        res.json(schema);
        return;
    }
    catch (error) {
        next(error);
    }
});
exports.updateSchema = updateSchema;
const deleteSchema = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield schemaService.deleteSchema({ uuid: req.params.uuid });
        res.status(204).send();
        return;
    }
    catch (error) {
        next(error);
    }
});
exports.deleteSchema = deleteSchema;
