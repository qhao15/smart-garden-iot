import mongoose from 'mongoose';
const deviceSchema = new mongoose.Schema({
  pin: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  deviceName: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  }
});


let Device = mongoose.model('Device', deviceSchema);

export default {
  Device: Device
}