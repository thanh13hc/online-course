import { Router } from "express";
import {
  getAllSongs,
  getFeaturedSongs,
  getMadeForYouSongs,
  getTrendingSongs,
} from "../controllers/song.controller.js";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";

const songRoutes = Router();

songRoutes.get("/", protectRoute, requireAdmin, getAllSongs);
songRoutes.get("/featured", getFeaturedSongs);
songRoutes.get("/made-for-you", getMadeForYouSongs);
songRoutes.get("/trending", getTrendingSongs);
export default songRoutes;
