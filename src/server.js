import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./route/web";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import SocketServices from './services/socketIOService';
import MQTTClient from './controllers/mqttClientController';
import mongoose from 'mongoose';
import userRouter from './route/user';
import deviceRouter from './route/device';
import LogRouter from './route/activityLog';
import schedulerRouter from './route/scheduler';
import ruleRouter from './route/rule';
// override: values in .env win over variables already set in the terminal
require("dotenv").config({ override: true });

let app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods:["GET", "POST"],
  }
});
global._io = io;
//config app


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser());
app.use('/public/', express.static('./public'));

app.use(cors());

initWebRoutes(app);
app.use("/api/user", userRouter);
app.use("/api/device", deviceRouter);
app.use("/api/activityLog", LogRouter);
app.use("/api/scheduler", schedulerRouter);
app.use("/api/rule", ruleRouter);	
viewEngine(app);



global._io.on('connection',
  SocketServices.connection)

let port = process.env.PORT || 6969;


// MONGO_URI in .env overrides the original team Atlas cluster
const mongoURI = process.env.MONGO_URI ||
  `mongodb+srv://linhnguyen123:${process.env.PASSWORD_DB}@cluster0.qflosao.mongodb.net/Node-API?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(mongoURI)
.then(() => {
  console.log('Connected to mongodb');
})
.catch((err) => console.log('Cannot connect to mongodb:', err.message))

server.listen(port, () => {
  console.log(`Server running at: http://localhost:${port}`);
});
