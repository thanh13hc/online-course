import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap.get(userId);
}

const userSocketMap = new Map(); // userId - socketId

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap.set(userId, socket.id);

  io.emit("getOnlineUsers", Object.keys(Object.fromEntries(userSocketMap)));

  socket.on("disconnect", () => {
    userSocketMap.delete(userId);
    io.emit("getOnlineUsers", Object.keys(Object.fromEntries(userSocketMap)));

    console.log("A user disconnected", socket.id);
  });
});

export { io, app, server };
