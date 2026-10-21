
// import updateSensor from "./updateSensor"; 
class SocketServices {
  //connection socket
  async connection(socket) {
    socket.on('disconnect', () => {
      console.log(`User disconnect id is: ${socket.id}`)
    })
    //event on here

    socket.on('chat message', (msg) => {
      _io.emit('chat message', msg);
    })
    // socket.on('switch data', (msg) => {
    //   let pin = msg.pin.replace(" ", "");
    //   let typeSensor = msg.typeSensor;
    //   let value = msg.value == true ? 1 : 0;
    //   console.log(`pin: ${pin}, typeSensor: ${typeSensor}, value: ${value}`)
    //   updateSensor.controlDevice(pin, typeSensor, value)
    // })
  }
}

export default new SocketServices();