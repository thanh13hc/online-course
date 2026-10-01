import express from "express";
import { sendMessage, getMessages } from "../controllers/message.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const messageRoutes = express.Router();

messageRoutes.post("/send/:id", authMiddleware, sendMessage);

messageRoutes.get("/:id", authMiddleware, getMessages);

export default messageRoutes;
