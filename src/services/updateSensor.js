import mqttClient from './mqttClientService';
import constant from './constant.js';

function setInputPin(pin, typeSensor){

  if (pin.length != 2) {
    console.log("Pin Errorr (A|D)(Number)")
    return
  }
  
  //ADD sensor
  let message = `${constant.HEADER_CREATE}:`
  if (pin[0] === "A") {
    // Analog Pin
    if (typeSensor === constant.TYPE_LIGHT_SENSOR || typeSensor === constant.TYPE_SOIL_SENSOR) {
      message += `${typeSensor}:`
    }
    else {
      console.log("Type sensor error")
      return
    }
  }
  else if(pin[0] === "D"){
    // Digital Pin
    if (typeSensor === constant.TYPE_TEMP_SENSOR ||
      typeSensor === constant.TYPE_DIGITAL_OUTPUT ||
      typeSensor === constant.TYPE_DIGITAL_SERVO) {
      message += `${typeSensor}:`
    }
    else {
      console.log("Type sensor error")
      return
    }
  }
  message += `${pin}`
  // send message to adafruit
  mqttClient.mqttClient.publish("nguyentruongthan/feeds/farm1", message);
}

function deleteInputPin(pin, typeSensor){
  if (pin.length != 2) {
    console.log("Pin Errorr (A|D)(Number)")
    return
  }

  // DELETE sensor
  let message = `${constant.HEADER_DELETE}`
  if (pin[0] == "A") {
    // # Analog Pin
    if (typeSensor === constant.TYPE_LIGHT_SENSOR || typeSensor === constant.TYPE_HUMISOLID_SENSOR) {
      message += typeSensor
    }
    else {
      console.log("Type sensor error")
      return
    }
  }
  else if(pin[0] === "D"){
    // # Digital Pin
    if (typeSensor === constant.TYPE_HUMIDITY_SENSOR) {
      message += typeSensor
    }
    else {
      console.log("Type sensor error")
      return;
    }
  }
  console.log(`Delete sensor ${typeSensor} success`)
  message += pin
}

function controlDevice(pin, typeSensor, value) {
  if (pin.length != 2) {
    console.log("Pin Errorr (A|D)(Number)")
    return
  }

  // #CONTROL sensor
  let message = `${constant.HEADER_CONTROL_DEVICE}:`
  
  if (pin[0] === "P") {
    if (typeSensor === constant.TYPE_DIGITAL_OUTPUT || typeSensor == constant.TYPE_DIGITAL_SERVO) {
      message += `${typeSensor}:`
    } else {
      console.log("Type sensor error")
      return
    }
  }
  message += `${pin}:`
  message += value
  mqttClient.mqttClient.publish("nguyentruongthan/feeds/farm1", message);
}
module.exports = {
  setInputPin,
  deleteInputPin,
  controlDevice
};
