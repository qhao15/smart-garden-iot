import mqttClient from '../controllers/mqttClientController';

const publish = (topic, message) => {
  mqttClient.mqttClient.publish(topic, message);
}

module.exports = {
  publish: publish,
}