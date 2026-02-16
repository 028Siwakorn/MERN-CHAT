const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const userRouter = require("./routers/user.router");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.BASE_URL || "http://localhost:5173",
    credentials: true,
  },
});
const PORT = process.env.PORT;
const BASE_URL = process.env.BASE_URL;
const MONGODB = process.env.MONGODB;
// Middleware
app.use(
  cors({
    origin: [BASE_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-access-token"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//callback funtion
app.get("/", (req, res) => {
  res.send("WELCOME TO MERN CHAT SERVER");
});
//connect to DB
if (!MONGODB) {
  console.log("NO MONGODB URL found in dotenv");
} else {
  mongoose
    .connect(MONGODB)
    .then(() => {
      console.log("Connect to database successfully!");
    })
    .catch((error) => {
      console.log("Mongo DB connection error:", error);
    });
}
//use router
app.use("/api/v1/user", userRouter);

// Socket.io
const onlineUsers = new Map();
io.on("connection", (socket) => {
  socket.on("user:online", (data) => {
    if (data?.userId) {
      onlineUsers.set(socket.id, data.userId);
      io.emit("users:online", Array.from(onlineUsers.values()));
    }
  });
  socket.on("disconnect", () => {
    onlineUsers.delete(socket.id);
    io.emit("users:online", Array.from(onlineUsers.values()));
  });
});

server.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
});
