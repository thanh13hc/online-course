import express from "express";
import { getUsersForSidebar } from "../controllers/user.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const userRoutes = express.Router();

userRoutes.get("/", authMiddleware, getUsersForSidebar);

export default userRoutes;
