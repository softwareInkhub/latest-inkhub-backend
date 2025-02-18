"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const clientServiceActivity_1 = require("../acbda/activity/APIService/clientServiceActivity");
const router = express_1.default.Router();
router.post('/createClientSchema', clientServiceActivity_1.createClientSchema);
router.get('/client/:uuid', clientServiceActivity_1.getClientSchema);
router.put('/client/:uuid', clientServiceActivity_1.updateClientSchema);
router.delete('/client/:uuid', clientServiceActivity_1.deleteClientSchema);
exports.default = router;
