import schedulerModel from '../models/scheduler.js';

const getAllSchedulersByOutputID = async (outputID) => {
  const schedulers = await schedulerModel.Scheduler.find({
    outputID: outputID
  })
  return schedulers;
}

const getSchedulerByID = async (schedulerID) => {
  const scheduler = await schedulerModel.Scheduler.findById(schedulerID);
  if(!scheduler){
    return undefined;
  }
  return scheduler;
}


module.exports = {
  getAllSchedulersByOutputID: getAllSchedulersByOutputID,
  getSchedulerByID: getSchedulerByID
};