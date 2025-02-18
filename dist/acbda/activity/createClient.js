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
exports.createClientSchema = void 0;
const firebaseAccessor_1 = require("../accessor/firebaseAccessor");
const createClientSchema = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = req.body;
    try {
        const clientRef = yield firebaseAccessor_1.db.collection('clients').add(schema);
        res.status(201).json({ id: clientRef.id, message: 'Client schema created successfully' });
    }
    catch (error) {
        console.error('Error creating client schema:', error);
        res.status(500).json({ error: 'Failed to create client schema' });
    }
});
exports.createClientSchema = createClientSchema;
