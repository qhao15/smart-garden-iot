import mongoose from 'mongoose';
const outputDeviceSchema = new mongoose.Schema({
  deviceID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Device"
  }
});


let OutputDevice = mongoose.model('OutputDevice', outputDeviceSchema);

export default {
  OutputDevice: OutputDevice
}