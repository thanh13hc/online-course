import { Router } from "express";
import { getAllAlbums, getAlbumById } from "../controllers/album.controller.js";

const albumRoutes = Router();

albumRoutes.get("/", getAllAlbums);
albumRoutes.get("/:id", getAlbumById);

export default albumRoutes;
