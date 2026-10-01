import { Router } from "express";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";
import { getStats } from "../controllers/stat.controller.js";
const statRoutes = Router();

statRoutes.get("/", protectRoute, requireAdmin, getStats);

export default statRoutes;
