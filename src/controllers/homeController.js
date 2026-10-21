
import fs from 'fs';
import constant from '../services/constant';
import deviceService from '../services/deviceService';
import mqttService from '../services/mqttService';
import eventService from '../services/eventService';
import activityLogService from '../services/activityLogService';
import schedulerService from '../services/schedulerService';
// import updateSensor from "../services/updateSensor"; 


function decodeDeviceNametoNumber(nameDevice) {
  switch (nameDevice) {
    case "HumiSoilSensor":
      return constant.TYPE_SOIL_SENSOR;
    case "LightSensor":
      return constant.TYPE_LIGHT_SENSOR;
    case "PumpOutput":
      return constant.TYPE_DIGITAL_OUTPUT;
    case "LightOutput":
      return constant.TYPE_DIGITAL_OUTPUT;
    case "MistingOutput":
      return constant.TYPE_DIGITAL_OUTPUT;
    case "CurtainOutput":
      return constant.TYPE_DIGITAL_OUTPUT;
    default: return -1;
  }
}

function decodeDeviceNametoString(nameDevice) {
  switch (nameDevice) {
    case "AirSensor":
      return "Nhiệt độ và độ ẩm không khí";
    case "HumiSoilSensor":
      return "Độ ẩm đất";
    case "LightSensor":
      return "Cường độ ánh sáng";
    case "PumpOutput":
      return "Máy bơm";
    case "LightOutput":
      return "Đèn";
    case "MistingOutput":
      return "Máy phun sương";
    case "CurtainOutput":
      return "Rèm che nắng";
    default: return "";
  }
}
let getHomePage = async (req, res) => {
  try {
    return res.render('homePage.ejs');
  } catch (e) {
    console.log(e);
  }
}

let getDashBoard = async (req, res) => {
  //call service to get device according username and gardenID
  const username = 'nguyentruongthan';
  const devices = await deviceService.getAllDevicesByUsername(username);
    
  return res.render(
    'dashBoard.ejs',
    { data: devices }
  );
  
}

let getDevices = async (req, res) => {
  //call service to get device according username and gardenID
  //TODO
  //Ex: list device id is
  const devices = [
    {
      deviceID: 1,
      value: "32.4,78",
      pin: "P19",
      type: "2", //Temp and humi air sensor
      deviceName: "Nhiệt độ và độ ẩm không khí"
    },
    {
      deviceID: 2,
      value: "34",
      pin: "P0",
      type: "0", //Light sensor
      deviceName: "Ánh sáng 1"
    },
    {
      deviceID: 3,
      value: "68",
      pin: "P1",
      type: "1", //Humi soil sensor
      deviceName: "Độ ẩm đất 1"
    },
    {
      deviceID: 4,
      value: "0",
      pin: "P2",
      type: "3", //Light output
      deviceName: "Đèn 1"
    },
    {
      deviceID: 5,
      value: "0",
      pin: "P3",
      type: "4", //Pump output
      deviceName: "Máy bơm 1"
    },
  ]
  //send response
  res.set({ "Access-Control-Allow-Origin": "*" });
  res.status(200).json({"data": devices})
}

const controlDevice = async (req, res) => {
  console.log(req.body);
  const username = req.body.username;
  const deviceID = req.body.deviceID;
  const value = req.body.value;
  const ack = Date.now()

  const message = `${constant.HEADER_CONTROL_DEVICE}:${deviceID}:${value}:${ack}`
  //call mqttService for publish message to topic <gardenID>
  mqttService.publish(username, message)
  
  const ackEvent = `${constant.HEADER_ACK}:${ack}`;
  const onAck = () => {
    clearTimeout(timeout);
    //call service to add to database
    activityLogService.addActivityLog(deviceID, value);
    res.status(200).json({ "result": "success" });
  };

  // a late ack must not answer the request a second time
  const timeout = setTimeout(() => {
    eventService.mqttEvent.removeListener(ackEvent, onAck);
    res.status(200).json({ "result": "failed" });
  }, 3000)

  eventService.mqttEvent.once(ackEvent, onAck);
}

const createDevice = async (req, res) => {
  const gardenID = req.body.gardenID;
  const data = req.body.data;
  if (typeof data !== 'string') return res.status(400).json({ "data": "error" });
  const splitData = data.split(':');
  if (splitData.length != 3) return res.status(400).json({ "data": "error" });
  const header = splitData[0];
  const typeDevice = splitData[1];
  const pin = splitData[2];
  if (header == constant.HEADER_CREATE) {
    const message = `${constant.HEADER_CREATE}:${typeDevice}:${pin}`
    //call mqttService for publish message to topic <gardenID>
    mqttService.publish(gardenID, message);
    //call service to add to database
    //TODO

  } else {
    return res.status(400).json({ "data": "error" });
  }
  res.status(200).json({ "data": "create device" });
}

const createScheduler = async (req, res) => {
  const username = req.body.username || 'nguyentruongthan';
  const outputID = req.body.outputID;
  const action = req.body.action;
  const startTime = req.body.startTime;
  const stopTime = req.body.stopTime;
  if (!outputID || !action || !startTime || !stopTime) {
    return res.status(400).json({ "data": "error" });
  }

  const startTimeMinute = parseInt(startTime.split(':')[0]) * 60 + parseInt(startTime.split(':')[1]);
  const stopTimeMinute = parseInt(stopTime.split(':')[0]) * 60 + parseInt(stopTime.split(':')[1]);

  //call mqttService for publish message to topic <username>, same format as schedulerController
  const scheduler = { action: action, start_time: `${startTimeMinute}`, stop_time: `${stopTimeMinute}`, outputID: outputID };
  mqttService.publish(username, `${constant.HEADER_CREATE_SCHEDULER}:[${JSON.stringify(scheduler)}]`);
  //call service to add to database
  

  res.status(200).json({ "data": "create scheduler" });
}

const getScheduler = async (req, res) => {
  const gardenID = req.body.gardenID;
  //call service get all scheduler of garden
  //EX:
  const scheduler = [
    {
      schedulerID: 1,
      action: 1,
      startTime:  `${17*60+30}`,
      endTime: `${18*60}`,
      outputDeviceID: 5
    },
    {
      schedulerID: 2,
      action: 0,
      startTime: `${6*60+30}`,
      endTime: `${7*60}`,
      outputDeviceID: 6
    }
  ]

  res.status(200).json({ "data": scheduler });
}

let postDevice = async (req, res) => {
  
  let nameDevices = Array.isArray(req.body.nameDevice) ? req.body.nameDevice : [req.body.nameDevice];
  let pins = Array.isArray(req.body.pin) ? req.body.pin: [req.body.pin];

  // for (let i = 0; i < nameDevices.length; i++) {
  //   switch (nameDevices[i]) {
  //     case "AirSensor":
  //       updateSensor.setInputPin(pins[i], constant.);
  //       break;
  //     case "HumiSoilSensor":
  //       updateSensor.setInputPin(pins[i], constant.TYPE_SOIL_SENSOR);
  //       break;
  //     case "LightSensor":
  //       updateSensor.setInputPin(pins[i], constant.TYPE_LIGHT_SENSOR);
  //       break;
  //     case "PumpOutput":
  //       updateSensor.setInputPin(pins[i], constant.TYPE_DIGITAL_OUTPUT);
  //       break;
  //     case "LightOutput":
  //       updateSensor.setInputPin(pins[i], constant.TYPE_DIGITAL_OUTPUT);
  //       break;
  //     case "MistingOutput":
  //       updateSensor.setInputPin(pins[i], constant.TYPE_DIGITAL_OUTPUT);
  //       break;
  //     case "CurtainOutput":
  //       updateSensor.setInputPin(pins[i], constant.TYPE_DIGITAL_OUTPUT);
  //       break;
  //     default: break;
  //   }
  // }
  console.log(nameDevices)
  const devices = nameDevices.map((name, index) => {
    let typeDevice = decodeDeviceNametoNumber(name);
    if (typeDevice == -1) return null;
    // if (typeDevice == constant.) {
    //   return {
    //     name: decodeDeviceNametoString(name),
    //     pin: pins[index],
    //     typeDevice: typeDevice,
    //     value: ["0", "0"]
    //   }
    // } else {
    //   return {
    //     name: decodeDeviceNametoString(name),
    //     pin: pins[index],
    //     typeDevice: typeDevice,
    //     value: ["0"]
    //   }
    // }
  }).flat().filter(device => device !== null);
  console.log(devices)
  // Tên tệp JSON
  const filePath = './src/jsonFile/devices.json';

  // Chuyển đối tượng thành chuỗi JSON
  const jsonData = JSON.stringify({ devices: devices }, null, 2); // null và 2 để định dạng dễ đọc

  // Ghi dữ liệu JSON vào tệp
  fs.writeFile(filePath, jsonData, (err) => {
    if (err) {
      console.error('Error:', err);
      return res.send("Error", err);
    }
  });
  return res.send("dash-board post");
}

const getNhietDo = async (req, res) => {
  const username = 'nguyentruongthan';
  const type = constant.TYPE_TEMP_SENSOR;
  //call service to get device
  const devices = await deviceService.getDevicesByUsernameAndType(username, type);
  if (devices.length === 0) {
    return res.status(404).json("Device not found");
  }
  return res.render(
    'nhietDo.ejs',
    {device: devices[0]}
  );
}
const getDoAmKhongKhi = async (req, res) => {
  const username = 'nguyentruongthan';
  const type = constant.TYPE_HUMIAIR_SENSOR;
  //call service to get device
  const devices = await deviceService.getDevicesByUsernameAndType(username, type);
  if (devices.length === 0) {
    return res.status(404).json("Device not found");
  }
  return res.render(
    'doAmKhongKhi.ejs',
    {device: devices[0]}
  );
}
const getDoAmDat = async (req, res) => {
  const username = 'nguyentruongthan';
  const type = constant.TYPE_SOIL_SENSOR;
  //call service to get device
  const devices = await deviceService.getDevicesByUsernameAndType(username, type);
  if (devices.length === 0) {
    return res.status(404).json("Device not found");
  }
  return res.render(
    'doAmDat.ejs',
    {device: devices[0]}
  );
}
const getAnhSang = async (req, res) => {
  const username = 'nguyentruongthan';
  const type = constant.TYPE_LIGHT_SENSOR;
  //call service to get device
  const devices = await deviceService.getDevicesByUsernameAndType(username, type);
  if (devices.length === 0) {
    return res.status(404).json("Device not found");
  }

  return res.render(
    'anhSang.ejs',
    {device: devices[0]}
  );
}
const getLapLich = async (req, res) => {
  //get all scheduler by username
  const username = 'nguyentruongthan';
  const devices = await deviceService.getAllDevicesByUsername(username);
  return res.render(
    'lapLich.ejs',
    {data: devices}
  )
}
const getCaiDatThoiGian = async (req, res) => {
  const username = 'nguyentruongthan';
  const devices = await deviceService.getAllDevicesByUsername(username);
  return res.render(
    'caiDatThoiGian.ejs',
    {data: devices}
  )
}

const getChinhSuaThoiGian = async (req, res) => {
  const username = 'nguyentruongthan';
  const schedulerID = req.params.schedulerID;
  const scheduler = await schedulerService.getSchedulerByID(schedulerID);
  if (!scheduler) {
    return res.status(404).json("Scheduler not found");
  }
  const devices = await deviceService.getAllDevicesByUsername(username);
  return res.render(
    'chinhSuaThoiGian.ejs',
    {
      scheduler: scheduler,
      devices: devices
    }
  )
}

const getDangNhap = async (req, res) => {
  return res.render('dangNhap.ejs');
}

module.exports = {
  getHomePage: getHomePage,
  getDashBoard: getDashBoard,
  getDevices: getDevices,
  postDevice: postDevice,
  controlDevice: controlDevice,
  createDevice: createDevice,
  createScheduler: createScheduler,
  getScheduler: getScheduler,
  getNhietDo: getNhietDo,
  getDoAmKhongKhi: getDoAmKhongKhi,
  getDoAmDat: getDoAmDat,
  getAnhSang: getAnhSang,
  getLapLich: getLapLich,
  getCaiDatThoiGian: getCaiDatThoiGian,
  getChinhSuaThoiGian: getChinhSuaThoiGian,
  getDangNhap: getDangNhap
}