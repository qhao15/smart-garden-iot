// import mqttService from './mqttService';
import constant from './constant';
import deviceModel from '../models/device';
import sensorModel from '../models/sensor';
import outputDeviceModel from '../models/outputDevice';
//control device

const controlDevice = async (username, gardenID, typeDevice, pin, value) => {
  console.log("Control device: ", username, gardenID, typeDevice, pin, value);
  // mqttService.publish(gardenID, `${constant.HEADER_CONTROL_DEVICE}:${typeDevice}:${pin}:${value}`);
}

const getAllDevicesByUsername = async (username) => {
  try {
    const devices = await deviceModel.Device.find({
      username: username
    })
    return devices;
  } catch (err) {
    throw err;
  }
}
const getDeviceByID = async (deviceID) => {
  try {
    const device = await deviceModel.Device.findById(deviceID);
    if (!device) {
      return null;
    }
    return device;
  } catch (err) {
    return err;
  }
}

const addDevice = async (body) => {
  try {
    const newDevice = new deviceModel.Device(body);
    const saveDevice = await newDevice.save();
  
    const type = parseInt(saveDevice.type);
    if (parseInt(type) < constant.TYPE_DIGITAL_OUTPUT) {//sensor
      const newSensor = new sensorModel.Sensor({ deviceID: saveDevice._id });
      const saveSensor = await newSensor.save();
      return { sensor: saveSensor , device: saveDevice};
    } else { // output device
      const newOutputDevice = new outputDeviceModel.OutputDevice({ deviceID: saveDevice._id });
      const saveOutputDevice = await newOutputDevice.save();
      return { outputDevice: saveOutputDevice , device: saveDevice};
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
}

const getDevicesByUsernameAndType = async (username, type) => {
  try {
    // console.log(username, type);
    const devices = await deviceModel.Device.find({
      username: username,
      type: type
    })
    // console.log(devices)
    return devices;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  controlDevice: controlDevice,
  getAllDevicesByUsername: getAllDevicesByUsername,
  addDevice: addDevice,
  getDeviceByID: getDeviceByID,
  getDevicesByUsernameAndType: getDevicesByUsernameAndType
}