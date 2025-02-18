import { Router, RequestHandler } from 'express';
import * as dataController from '../acbda/activity/DataManagmentService/dataServiceActivity';

const router = Router();

// Data routes
router.post('/createTable', dataController.createTable as RequestHandler);
router.post('/createData', dataController.createData as RequestHandler);
router.post('/getData', dataController.getData as RequestHandler);
router.put('/updateData', dataController.updateData as RequestHandler);
router.delete('/deleteData', dataController.deleteData as RequestHandler);
router.post('/getAllData', dataController.getAllData as RequestHandler);
router.post('/getChildSchemaData', dataController.getChildSchemaData as RequestHandler);
router.post('/searchChildData', dataController.searchChildData as RequestHandler);

export default router; 