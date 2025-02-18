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
exports.searchChildData = exports.getChildSchemaData = exports.getAllData = exports.deleteData = exports.updateData = exports.getData = exports.createData = exports.createTable = void 0;
const dataServiceActivity_1 = require("../acbda/activity/DataManagmentService/dataServiceActivity");
const createTable = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { schemaId } = req.body;
        if (!schemaId) {
            res.status(400).json({ error: 'Schema ID is required' });
            return;
        }
        const tableRef = yield dataServiceActivity_1.dataService.createTable(schemaId);
        res.status(201).json({ tableRef });
    }
    catch (error) {
        next(error);
    }
});
exports.createTable = createTable;
const createData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { schemaId, data } = req.body;
        if (!schemaId || !data) {
            res.status(400).json({ error: 'Schema ID and data are required' });
            return;
        }
        const createdData = yield dataServiceActivity_1.dataService.createData(schemaId, data);
        res.status(201).json(createdData);
    }
    catch (error) {
        next(error);
    }
});
exports.createData = createData;
const getData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { schemaId, uuid } = req.body;
        if (!schemaId || !uuid) {
            res.status(400).json({ error: 'Schema ID and data UUID are required' });
            return;
        }
        const data = yield dataServiceActivity_1.dataService.getData(schemaId, uuid);
        if (!data) {
            res.status(404).json({ error: 'Data not found' });
            return;
        }
        res.status(200).json(data);
    }
    catch (error) {
        next(error);
    }
});
exports.getData = getData;
const updateData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { schemaId, uuid, data } = req.body;
        if (!schemaId || !uuid || !data) {
            res.status(400).json({ error: 'Schema ID, data UUID, and update data are required' });
            return;
        }
        const updatedData = yield dataServiceActivity_1.dataService.updateData(schemaId, uuid, data);
        res.status(200).json(updatedData);
    }
    catch (error) {
        next(error);
    }
});
exports.updateData = updateData;
const deleteData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { schemaId, uuid } = req.body;
        if (!schemaId || !uuid) {
            res.status(400).json({ error: 'Schema ID and data UUID are required' });
            return;
        }
        yield dataServiceActivity_1.dataService.deleteData(schemaId, uuid);
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
});
exports.deleteData = deleteData;
const getAllData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { schemaId } = req.body;
        if (!schemaId) {
            res.status(400).json({ error: 'Schema ID is required' });
            return;
        }
        const allData = yield dataServiceActivity_1.dataService.getAllData(schemaId);
        res.status(200).json(allData);
    }
    catch (error) {
        next(error);
    }
});
exports.getAllData = getAllData;
const getChildSchemaData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { parentSchemaId, childSchemaId } = req.body;
        if (!parentSchemaId || !childSchemaId) {
            res.status(400).json({ error: 'Parent and child schema IDs are required' });
            return;
        }
        const childData = yield dataServiceActivity_1.dataService.getChildSchemaData(parentSchemaId, childSchemaId);
        res.status(200).json(childData);
    }
    catch (error) {
        next(error);
    }
});
exports.getChildSchemaData = getChildSchemaData;
const searchChildData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { childSchemaId, query } = req.body;
        if (!childSchemaId || !query) {
            res.status(400).json({ error: 'Child schema ID and search query are required' });
            return;
        }
        const data = yield dataServiceActivity_1.dataService.searchChildData(childSchemaId, query);
        res.status(200).json(data);
    }
    catch (error) {
        next(error);
    }
});
exports.searchChildData = searchChildData;
