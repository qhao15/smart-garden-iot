import schedulerModel from '../models/scheduler.js';
import outputDeviceModel from '../models/outputDevice.js';
import schedulerService from '../services/schedulerService.js';
import deviceService from '../services/deviceService.js';
import constant from '../services/constant.js';
import mqttService from '../services/mqttService.js';
const addScheduler = async (req, res) => {
  try {
    const username = 'nguyentruongthan';
    const outputDevice = await outputDeviceModel.OutputDevice.exists({ deviceID: req.body.outputID });
    if (!outputDevice) {
      return res.status(400).json({ error: "Invalid outputID" });
    }

    const newScheduler = new schedulerModel.Scheduler(req.body);
    const saveScheduler = await newScheduler.save();

    // send new scheduler to IoT Gateway
    mqttService.publish(username, `${constant.HEADER_CREATE_SCHEDULER}:[${JSON.stringify(saveScheduler)}]`);
    return res.status(200).json({scheduler: saveScheduler});
  } catch (err) {
    res.status(500).json(err);
  }
}

const getAllSchedulersByOutputID = async (req, res) => {
  try {
    const outputID = req.params.outputID;
    const schedulers = await schedulerService.getAllSchedulersByOutputID(outputID);
    return res.status(200).json(schedulers);
  }catch(err){
    res.status(500).json(err);
  }
}

const updateSchedulerByID = async (req, res) => {
  try {
    const username = 'nguyentruongthan';
    const schedulerID = req.params.schedulerID;
    //find by schedulerID
    const scheduler = await schedulerModel.Scheduler.findById(schedulerID);
    if(!scheduler){
      return res.status(404).json("Scheduler not found");
    }
    if(scheduler.type != req.body.type){
      return res.status(400).json("Cannot update scheduler");
    }
    //update device table
    const updateScheduler = await scheduler.updateOne({
      $set : req.body
    })
    scheduler.start_time = req.body.start_time;
    scheduler.stop_time = req.body.stop_time;
    scheduler.outputID = req.body.outputID;
    
    // send update scheduler to IoT Gateway
    mqttService.publish(username, `${constant.HEADER_CREATE_SCHEDULER}:[${JSON.stringify(scheduler)}]`);
    res.status(200).json("Update scheduler successfully");
  } catch (err) {
    res.status(500).json(err);
  }
}

const getSchedulerByID = async (req, res) => {
  try {
    const schedulerID = req.params.schedulerID;
    const scheduler = await schedulerService.getSchedulerByID(schedulerID);
    if(!scheduler){
      return res.status(404).json("Scheduler not found");
    }
    res.status(200).json(scheduler);
  } catch (err) {
    res.status(500).json(err);
  }
}

const deleteSchedulerByID = async (req, res) => {
  try {
    const username = 'nguyentruongthan';
    const schedulerID = req.params.schedulerID;
    const scheduler = await schedulerModel.Scheduler.findByIdAndDelete(schedulerID);
    if (!scheduler) {
      return res.status(404).json("Scheduler not found");
    }
    // send delete scheduler to IoT Gateway
    mqttService.publish(username, `${constant.HEADER_DELETE_SCHEDULER}:${schedulerID}`);
    res.status(200).json(scheduler);
  } catch (err) {
    res.status(500).send(err);
  }
}
const getAllSchedulersByUsername = async (req, res) => {
  try {
    // call api get all device of username
    const username = req.params.username;
    const devices = await deviceService.getAllDevicesByUsername(username);
    
    let schedulers = [];
    //for each device, get all schedulers by device ID
    for (let i = 0; i < devices.length; i++){
      
      if (devices[i].type === '4') {
        //check it is output Device
        const schedulersByDeviceID = await schedulerService.getAllSchedulersByOutputID(devices[i]._id);
        //combine all schedulers
        schedulers = schedulers.concat(schedulersByDeviceID);
        
      }
    }
    
    return res.status(200).json(schedulers);
  } catch (err) {
    return res.status(500).json(err);
  }
}
module.exports = {
  addScheduler: addScheduler,
  getAllSchedulersByOutputID: getAllSchedulersByOutputID,
  deleteSchedulerByID: deleteSchedulerByID,
  updateSchedulerByID: updateSchedulerByID,
  getSchedulerByID: getSchedulerByID,
  getAllSchedulersByUsername: getAllSchedulersByUsername
};