import express from 'express';
import { RecordController } from './RecordController';
import { RecordMiddleware } from './RecordMiddleware';

const routes = express.Router();
const recordController = new RecordController();
const recordMiddleware = RecordMiddleware.getInstance();

routes.post('/', [recordMiddleware.validateFields, recordController.list]);

export default routes;
