import express from "express";
import { loginUser, logoutUser, signupUser } from "../controllers/auth.controller.js";

const authRoutes = express.Router();

authRoutes.post("/login", loginUser);

authRoutes.post("/signup", signupUser);

authRoutes.post("/logout", logoutUser);

export default authRoutes;
