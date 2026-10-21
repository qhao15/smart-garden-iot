import ActivityLog from '../models/activityLog.js'; 

const getLatestDeviceLog = async (deviceID) => {
  try {
    //get Latest Device Log
    const latestLog = await ActivityLog.ActivityLog.findOne({ deviceID: deviceID }).sort({ timestamp: -1 }).exec();
    if (!latestLog) {
      return null;
    }
    return latestLog;
  } catch (err) {
    // console.error("Error fetching latest activity log:", err);
    return err;
  }
};
const addActivityLog = async (deviceID, value) => {
  try {
    console.log(deviceID, value);
    const newLog = new ActivityLog.ActivityLog({
      timestamp: new Date(),
      value: value,
      deviceID: deviceID
    });
    const savedLog = await newLog.save();
    return savedLog;
  } catch (err) {
    return err;
  }
}

module.exports = {
  getLatestDeviceLog: getLatestDeviceLog,
  addActivityLog: addActivityLog
}