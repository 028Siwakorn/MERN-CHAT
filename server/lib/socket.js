require("dotenv").config();
const app = require("express")();
const server = require("http").createServer(app);
const userSocketMap = []; //object ทีอยู่ข้างในนเป็นแบบนี้ {userId:socketId}
const io = require("socket.io")(server, {
  cors: {
    origin: process.env.BASE_URL || "http://localhost:5173",
    credentials: true,
  },
});

//return socketId
function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  console.log("A User Connected: ", socket.id);
  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log("UserSocketMap", userSocketMap);
  }
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A User Disconnected: ", socket.id);
    delete userSocketMap[userId];
    console.log("UserSocketMap", userSocketMap);
  });
});

module.exports = { io, app, server, getReceiverSocketId };
