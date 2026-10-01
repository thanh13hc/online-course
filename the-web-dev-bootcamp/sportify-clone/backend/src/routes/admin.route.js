import { Router } from "express";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";
import {
  createSong,
  deleteSong,
  createAlbum,
  deleteAlbum,
  checkAdmin,
} from "../controllers/admin.controller.js";

const adminRoutes = Router();

adminRoutes.use(protectRoute, requireAdmin);

adminRoutes.post("/songs", createSong);
adminRoutes.delete("/songs/:id", deleteSong);

adminRoutes.post("/albums", createAlbum);
adminRoutes.delete("/albums/:id", deleteAlbum);

adminRoutes.get("/check", checkAdmin);

export default adminRoutes;
