import events from "events";

const mqttEvent = new events.EventEmitter();

module.exports = {
  mqttEvent: mqttEvent,
}
  