import deviceModel from '../models/device.js';
import sensorModel from '../models/sensor.js';
import outputDeviceModel from '../models/outputDevice.js';
import constants from '../services/constant.js';
import deviceService from '../services/deviceService.js';
import mqttService from '../services/mqttService.js';

const addDevice = async (req, res) => {
  try {
    
    const result = await deviceService.addDevice(req.body);
    mqttService.publish('nguyentruongthan', `${constants.HEADER_CREATE}:${JSON.stringify(result.device)}`);
    return res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
}

const getAllDevicesByUsername = async (req, res) => {
  try {
    const username = req.params.username;
    const devices = await deviceService.getAllDevicesByUsername(username);
    return res.status(200).json(devices);
  }catch(err){
    res.status(500).json(err);
  }
}

const updateDeviceByDeviceID = async (req, res) => {
  try {
    const deviceID = req.params.deviceID;
    //find by deviceID
    const device = await deviceModel.Device.findById(deviceID);
    if(!device){
      return res.status(404).json("Device not found");
    }
    //update device table
    await device.updateOne({
      $set : req.body
    })
    return res.status(200).json("Update device successfully");
  } catch (err) {
    res.status(500).json(err);
  }
}

const getDeviceByID = async (req, res) => {
  try {
    const deviceID = req.params.deviceID;
    const device = await deviceModel.Device.findById(deviceID);
    if(!device){
      return res.status(404).json("Device not found");
    }
    return res.status(200).json(device);
  } catch (err) {
    res.status(500).json(err);
  }
}
const deleteDeviceByID = async (req, res) => {
  try {
    const deviceID = req.params.deviceID;
    //find by deviceID
    const device = await deviceModel.Device.findById(deviceID);
    if(!device){
      return res.status(404).json("Device not found");
    }
    //delete device table
    await deviceModel.Device.findByIdAndDelete(deviceID);
    const type = parseInt(device.type);
    if (type < constants.TYPE_DIGITAL_OUTPUT) {
      //delete sensor table
      await sensorModel.Sensor.findOneAndDelete({
        deviceID: deviceID
      })
    } else {
      //delete output device table
      
      await outputDeviceModel.OutputDevice.findOneAndDelete({
        deviceID: deviceID
      })
    }
    return res.status(200).json("Delete device successfully");
  } catch (err) {
    res.status(500).json(err);
  }
}

const getDevicesByUsernameAndType = async (req, res) => {
  try {
    const username = req.params.username;
    const type = req.params.type;
    const devices = await deviceService.getDevicesByUsernameAndType(username, type);
    return res.status(200).json(devices);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  addDevice: addDevice,
  getAllDevicesByUsername: getAllDevicesByUsername,
  updateDeviceByDeviceID: updateDeviceByDeviceID,
  getDeviceByID: getDeviceByID,
  deleteDeviceByID: deleteDeviceByID,
  getDevicesByUsernameAndType: getDevicesByUsernameAndType
};