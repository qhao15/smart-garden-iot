import schedulerController from '../controllers/schedulerController.js';
import express from "express";

const schedulerRouter = express.Router();
schedulerRouter.post('/', schedulerController.addScheduler);
schedulerRouter.get('/deviceID/:outputID', schedulerController.getAllSchedulersByOutputID);
schedulerRouter.get('/username/:username', schedulerController.getAllSchedulersByUsername);
schedulerRouter.put('/:schedulerID', schedulerController.updateSchedulerByID);
schedulerRouter.get('/:schedulerID', schedulerController.getSchedulerByID);
schedulerRouter.delete('/:schedulerID', schedulerController.deleteSchedulerByID);
export default schedulerRouter;