"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const serverless = require('serverless-http');
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const schemaRoutes_1 = __importDefault(require("./routes/schemaRoutes"));
const dataRoutes_1 = __importDefault(require("./routes/dataRoutes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// API Routes
app.use('/api', schemaRoutes_1.default);
app.use('/api', dataRoutes_1.default);
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });
module.exports.handler = serverless(app);
