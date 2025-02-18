import { Router, RequestHandler } from 'express';
import * as schemaController from '../acbda/activity/DataManagmentService/schemaServiceActivity';

const router = Router();

// Schema routes
router.post('/createSchema', schemaController.createSchema as RequestHandler);
router.post('/getSchema', schemaController.getSchema as RequestHandler);
router.get('/getAllSchemas', schemaController.getAllSchemas as RequestHandler);
router.put('/updateSchema', schemaController.updateSchema as RequestHandler);
router.delete('/deleteSchema', schemaController.deleteSchema as RequestHandler);
router.put('/updateSchemaTableRef', schemaController.updateSchemaTableRef as RequestHandler);

// // Data routes
// router.post('/getAllData', dataController.getAllData as RequestHandler);
// router.post('/createData', dataController.createData as RequestHandler);
// router.put('/updateData', dataController.updateData as RequestHandler);
// router.delete('/deleteData', dataController.deleteData as RequestHandler);

export default router; 