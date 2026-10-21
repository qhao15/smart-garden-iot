import deviceController from '../controllers/deviceController.js';
import express from "express";

const deviceRouter = express.Router();
deviceRouter.post('/', deviceController.addDevice);
deviceRouter.get('/all/:username', deviceController.getAllDevicesByUsername);
deviceRouter.put('/:deviceID', deviceController.updateDeviceByDeviceID);
deviceRouter.get('/:deviceID', deviceController.getDeviceByID);
deviceRouter.delete('/:deviceID', deviceController.deleteDeviceByID);
deviceRouter.get('/type/:username/:type', deviceController.getDevicesByUsernameAndType);
export default deviceRouter;