import ActivityLog from '../models/activityLog.js'; 
const getHourlyLog= async (req, res) => {
    try {
      const { deviceID, date } = req.params;
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
  
      const hourlyLogs = [];
      for (let i = 0; i <= 24; i += 2) {
        const startOfHour = new Date(startOfDay);
        startOfHour.setHours(i);
        const endOfHour = new Date(startOfDay);
        endOfHour.setHours(i + 1, 59, 59, 999);
  
        // Find latest Log for each time slot
        const latestLog = await ActivityLog.findOne({
          deviceID,
          timestamp: { $gte: startOfHour, $lte: endOfHour }
        }).sort({ timestamp: 1 }).limit(1);
  
        hourlyLogs.push(latestLog || null);
      }
  
      res.status(200).json(hourlyLogs);
    } catch (err) {
      console.error("Error fetching hourly logs:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  module.exports = getHourlyLog;