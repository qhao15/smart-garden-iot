import mongoose from 'mongoose';
const schedulerSchema = new mongoose.Schema({
  schedulerID: {
    type: mongoose.Schema.Types.ObjectId,
  },
  action: {
    type: String,
    required: true
  },
  start_time: {
    type: String,
    required: true
  },
  stop_time: {
    type: String,
    required: true
  },
  outputID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    // ref: "OutputDevice"
  },
});


let Scheduler = mongoose.model('Scheduler', schedulerSchema);

export default {
  Scheduler: Scheduler
}