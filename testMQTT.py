
import paho.mqtt.client as mqtt
import time
import constants
import random

class MQTTClientHelper:
  def __init__(self):
      
    self.mqttClient = mqtt.Client(mqtt.CallbackAPIVersion.VERSION1)
    self.mqttClient.username_pw_set(constants.MQTT_USERNAME, constants.MQTT_PASSWORD)
    self.mqttClient.connect(constants.MQTT_SERVER, int(constants.MQTT_PORT), 60)

    #Register mqtt events
    self.mqttClient.on_connect = self.mqtt_connected
    self.mqttClient.on_subscribe = self.mqtt_subscribed
    self.mqttClient.on_message = self.mqtt_recv_message
    self.mqttClient.loop_start()
  

  def mqtt_connected(self, client, userdata, flags, rc):
      print("Connected succesfully!!")
      # client.subscribe(constants.MQTT_TOPIC_SUB)
      client.subscribe(constants.MQTT_USERNAME  + "/feeds/farm1")

  def mqtt_subscribed(self, client, userdata, mid, granted_qos):
      print("Subscribed to Topic!!!")

  def mqtt_recv_message(self, client, userdata, message):
      #print("Received: ", message.payload.decode("utf-8"))
      # print(" Received message " + message.payload.decode("utf-8")
      #       + " on topic '" + message.topic
      #       + "' with QoS " + str(message.qos))

    #nguyentruongthan/feeds/<username>/<farmID>
    payload = message.payload.decode("utf-8")
    topic = message.topic
    print(f'Receive data: {payload}, feed id: {topic}')

  def publish(self, feed_id, message):
    print(f"Publishing to {feed_id} message: {message}")
    self.mqttClient.publish(feed_id, message)


mqttClientHelper = MQTTClientHelper()

def publishSensorValue(typeSensor, value):

  data = f"{constants.HEADER_SENSOR_VALUE}:{typeSensor}:{value}"
  
  mqttClientHelper.publish(feed_id, data)

if __name__ == "__main__":
  time.sleep(5)
  feed_id = "nguyentruongthan/feeds/farm1"
  value = ""
  typeSensor = 0
  while(True):
    
    publishSensorValue("0", f"P0:{random.randint(10, 100)}")
    publishSensorValue("1", f"P1:{random.randint(10, 100)}")
    publishSensorValue("2", f"P13:{random.randint(0, 100)}")
    publishSensorValue("3", f"P13:{random.randint(10, 40)}")
    
    time.sleep(5)