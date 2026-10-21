import ActivityLog from '../models/activityLog.js'; 
import activityLogService from '../services/activityLogService.js';
import deviceService from '../services/deviceService.js';

const addActivityLog = async (req, res) => {
  try {
    const savedLog = await activityLogService.addActivityLog(req.body.deviceID, req.body.value);
    res.status(200).json(savedLog);
  } catch (err) {
    res.status(500).json(err); //HTTP REQUEST CODE
  }
};

const getLatestDeviceLog = async (req, res) => {
  try {
    // call service to get latest activity log
    const latestLog = await activityLogService.getLatestDeviceLog(req.params.deviceID);
    if (!latestLog) {
      return res.status(404).json({ message: "No activity log found for the specified device ID" });
    }
    return res.status(200).json(latestLog);
    
  } catch (err) {
    console.error("Error fetching latest activity log:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getDailyLog = async (req, res) => {
  try {
    const { deviceID, date } = req.params;
    console.log("deviceID: ", deviceID, "date: ", date);
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Find Logs for that day
    const logs = await ActivityLog.ActivityLog.find({
      deviceID,
      timestamp: { $gte: startOfDay, $lte: endOfDay }
    });
    
    res.status(200).json(logs);
  } catch (err) {
    console.error("Error fetching logs:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getHourlyLog = async (req, res) => {
  try {
    const { deviceID, date } = req.params;
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const hourlyLogs = [];
    for (let i = 0; i < 24; i += 2) {
      const startOfHour = new Date(startOfDay);
      startOfHour.setHours(i);
      const endOfHour = new Date(startOfDay);
      endOfHour.setHours(i + 1, 59, 59, 999);

      // Latest Log
      const latestLog = await ActivityLog.ActivityLog.findOne({
        deviceID,
        timestamp: { $gte: startOfHour, $lte: endOfHour }
      }).sort({ timestamp: -1 }).limit(1);

      hourlyLogs.push(latestLog || null);
    }

    res.status(200).json(hourlyLogs);
  } catch (err) {
    console.error("Error fetching hourly logs:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = {
  addActivityLog: addActivityLog,
  getLatestDeviceLog: getLatestDeviceLog,
  getDailyLog: getDailyLog,
  getHourlyLog: getHourlyLog
};