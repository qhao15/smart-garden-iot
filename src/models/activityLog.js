import mongoose from 'mongoose';
const activityLogSchema = new mongoose.Schema({
  logID: {
    type: mongoose.Schema.Types.ObjectId,
  },
  timestamp: {
    type: Date,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  deviceID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Device"
  }
});


let ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

export default {
  ActivityLog: ActivityLog
}