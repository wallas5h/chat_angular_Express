import { urlencoded } from "body-parser";

// import { v2 as cloudinary } from "cloudinary";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import "express-async-errors";
import { engine } from "express-handlebars";
import rateLimit from "express-rate-limit";
import { createServer } from "http";
import path from "path";
import { Server } from "socket.io";
import { config } from "./config/config";
import { connectDB } from "./config/db";
import { socketService } from "./controllers/socketService";
import { messagesRouter } from "./routes/messagesRouter";
import { roomsRouter } from "./routes/roomsRouter";
import { userRouter } from "./routes/userRouter";
require("dotenv").config();

const PORT = 3001;
connectDB();

const corsOptions = {
  origin: [config.corsOrigin],
  credentials: true,
  optionSuccessStatus: 200,
};

const limiter = rateLimit({
  windowMs: 1000,
  max: 100,
});

const app = express();

const httpServer = createServer(app);

export const io = new Server(httpServer, {
  cors: {
    origin: [config.corsOrigin],
    credentials: true,
    methods: ["GET", "POST"],
  },
  transports: ["websocket", "polling"],
});

app.use(cors(corsOptions));

app.use(cookieParser());

app.use(limiter);

app.use(express.json());
app.use(express.static("public"));

app.use(
  urlencoded({
    extended: true,
  })
);

// socket.io service
socketService(io);

//routing
app.use("/api/users", userRouter);
app.use("/api/rooms", roomsRouter);
app.use("/api/messages", messagesRouter);

// handlebars
const hbsPath = path.join(__dirname, "./views");

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", hbsPath);

//Cloudinary
export const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: config.cld_cloud_name,
  api_key: config.cld_api_key,
  api_secret: config.cld_secret_key,
  secure: true,
});

//error middleware
// app.use(errorHandler);

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", config.corsOrigin);
  next();
});

httpServer.listen(PORT);
