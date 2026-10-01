import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});

const userSocketMap = new Map();

const getReceiverSocketId = (receiverId) => userSocketMap.get(receiverId);

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap.set(userId, socket.id);
  }

  io.emit("getOnlineUsers", Object.keys(Object.fromEntries(userSocketMap)));

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    userSocketMap.delete(userId);
    io.emit("getOnlineUsers", Object.keys(Object.fromEntries(userSocketMap)));
  });
});

export { app, io, server, getReceiverSocketId };
