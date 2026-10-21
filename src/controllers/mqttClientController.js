import mqtt from 'mqtt';
import constant from '../services/constant';
import eventService from '../services/eventService';
import deviceService from '../services/deviceService.js';
import schedulerService from '../services/schedulerService.js';
import activityLogService from '../services/activityLogService.js';
import ruleService from '../services/ruleService.js';

class MQTTClient {
  publish(topic, message) {
    if (!this.client || !this.client.connected) {
      console.error("Client is not initialized or not connected.");
      return;
    }
    // console.log("Publishing to mqtt");
    this.client.publish(`nguyentruongthan/feeds/${topic}`, message);
  }

  constructor(brokerUrl) {
    console.log('init MQTT');
    this.client = mqtt.connect(brokerUrl, {
      username: 'nguyentruongthan',
      password: '',
    });

    this.client.on('connect', () => {
      console.log('Connected to MQTT Broker');
      //subscribe to topic
      this.client.subscribe(`nguyentruongthan/feeds/+`, (err) => {
        if (err) {
          console.log(err);
        }
      })
    });

    this.client.on('message', async (topic, message) => {
      //topic format is: {nguyentruongthan}/feeds/{username}
      let username = topic.split('/')[2];
      if (username === "V1" || username === "V2") {
        return;
      }

      message = message.toString();
      console.log(`Received message from ${topic}: ${message.toString()}`);
      // Xử lý dữ liệu nhận được tại đây
      let splitMessage = message.toString().split(':');

      const header = parseInt(splitMessage[0]);
      let devices;
      let deviceID;
      let value;
      // async listener: an uncaught DB error here would crash the server
      try {
      switch (header) {
        case constant.HEADER_SENSOR_VALUE: //recv sensor data
          //message format: {header}:{deviceID}:{value}
          deviceID = splitMessage[1];
          value = splitMessage[2];
          // send data to UI throgh socket IO
          _io.emit(`${username} ${constant.HEADER_SENSOR_VALUE}`, message);
          // call service add activity log
          activityLogService.addActivityLog(deviceID, value);

          break;
        case constant.HEADER_ACK: //recv ack
          eventService.mqttEvent.emit(`${message}`, "");
          break;
        case constant.HEADER_GET_DEVICE: //req for get infor of device
          //call service get all device
          devices = await deviceService.getAllDevicesByUsername(username);
          // console.log(JSON.stringify(devices));
          this.publish(username, `${constant.HEADER_CREATE}:${JSON.stringify(devices)}`);
          break;
        case constant.HEADER_GET_SCHEDULER: //req for get infor of scheduler
          //call service get all scheduler
          devices = await deviceService.getAllDevicesByUsername(username);
          //find all output device
          let schedulers = [];
          for (const device of devices) {
            if (parseInt(device.type) === constant.TYPE_DIGITAL_OUTPUT) {
              const scheduler = await schedulerService.getAllSchedulersByOutputID(device._id.valueOf());
              schedulers.push(...scheduler)
            }
          }
          this.publish(username, `${constant.HEADER_CREATE_SCHEDULER}:${JSON.stringify(schedulers)}`);
          break;
        case constant.HEADER_GET_LATEST_VALUE: //req for get latest value of device
          //message format: <HEADER_GET_LATEST_VALUE>:<deviceID>
          // call service to get latest value
          deviceID = splitMessage[1];
          const latestLog = await activityLogService.getLatestDeviceLog(deviceID);
          if(!latestLog) {
            value = "0"
          } else {
            value = latestLog.value;
          }
          this.publish(username, `${constant.HEADER_LATEST_VALUE}:${deviceID}:${value}`);
          break;
        case constant.HEADER_GET_RULE: //req for get rule
          //message format: <HEADER_GET_RULE>:<deviceID>
          deviceID = splitMessage[1];
          const rules = await ruleService.getAllRulesByOutputID(deviceID);
          this.publish(username, `${constant.HEADER_CREATE_RULE}:${JSON.stringify(rules)}`);
          break;
      }
      } catch (err) {
        console.log(`Error handling message from ${topic}:`, err.message);
      }
      
    });

    this.client.on('close', () => {
      console.log('Connection to MQTT Broker closed');
    });
  }
}

const brokerUrl = 'mqtt://mqtt.ohstem.vn';
const mqttClient = new MQTTClient(brokerUrl);

module.exports = {
  mqttClient: mqttClient
}
