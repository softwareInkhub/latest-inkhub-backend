import { RequestHandler } from 'express';
import { SchemaService } from '../activity/DataManagmentService/schemaServiceActivity';

const schemaService = SchemaService.getInstance();

export const createSchema: RequestHandler = async (req, res, next) => {
    try {
        const schema = await schemaService.createSchema(req.body);
        res.status(201).json(schema);
        return;
    } catch (error) {
        next(error);
    }
};

export const getSchema: RequestHandler = async (req, res, next) => {
    try {
        const schema = await schemaService.getSchema({ uuid: req.params.uuid });
        if (!schema) {
            res.status(404).json({ error: 'Schema not found' });
            return;
        }
        res.json(schema);
        return;
    } catch (error) {
        next(error);
    }
};

export const getAllSchemas: RequestHandler = async (req, res, next) => {
    try {
        const schemas = await schemaService.getAllSchemas();
        res.json(schemas);
        return;
    } catch (error) {
        next(error);
    }
};

export const updateSchema: RequestHandler = async (req, res, next) => {
    try {
        const schema = await schemaService.updateSchema({ uuid: req.params.uuid, ...req.body });
        res.json(schema);
        return;
    } catch (error) {
        next(error);
    }
};

export const deleteSchema: RequestHandler = async (req, res, next) => {
    try {
        await schemaService.deleteSchema({ uuid: req.params.uuid });
        res.status(204).send();
        return;
    } catch (error) {
        next(error);
    }
}; 