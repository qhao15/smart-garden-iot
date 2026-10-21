import express from "express";
import activityLogController from '../controllers/activityLogController.js';
const LogRouter = express.Router();
//ADD LOG
LogRouter.post("/", activityLogController.addActivityLog);
//GET LATEST DEVICE LOG
LogRouter.get("/:deviceID/latest", activityLogController.getLatestDeviceLog);
//GET DAILY LOG
LogRouter.get("/:deviceID/:date", activityLogController.getDailyLog);
//GET 2 HOURLY LOG
LogRouter.get("/:deviceID/:date/hourly", activityLogController.getHourlyLog);
module.exports = LogRouter;