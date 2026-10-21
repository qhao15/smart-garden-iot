import mongoose from 'mongoose';
const ruleSchema = new mongoose.Schema({
  ruleID: {
    type: mongoose.Schema.Types.ObjectId,
  },
  sensorID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sensor",
    required: true
  },
  outputID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "OutputDevice",
    required: true
  },
  threshold: {
    type: String,
    required: true
  },
  condition: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  action: {
    type: String,
    required: true
  }
});


let Rule = mongoose.model('Rule', ruleSchema);

export default {
  Rule: Rule
}