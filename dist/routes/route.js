"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const schemaServiceActivity_1 = require("../acbda/activity/DataManagmentService/schemaServiceActivity");
const router = express_1.default.Router();
// Client Routes
const clientRoutes = {
    post: {
        '/createSchema': schemaServiceActivity_1.createSchema,
        '/getSchema': schemaServiceActivity_1.getSchema
    },
    get: {
        '/getAllSchemas': schemaServiceActivity_1.getAllSchemas
    },
    put: {
        '/updateSchema': schemaServiceActivity_1.updateSchema
    },
    delete: {
        '/deleteSchema': schemaServiceActivity_1.deleteSchema
    }
};
// Register all client routes
Object.entries(clientRoutes.post).forEach(([path, handler]) => router.post(path, handler));
Object.entries(clientRoutes.get).forEach(([path, handler]) => router.get(path, handler));
Object.entries(clientRoutes.put).forEach(([path, handler]) => router.put(path, handler));
Object.entries(clientRoutes.delete).forEach(([path, handler]) => router.delete(path, handler));
// You can add more route categories here following the same pattern
// Example:
// const dataManagementRoutes = { ... };
// const authRoutes = { ... };
exports.default = router;
