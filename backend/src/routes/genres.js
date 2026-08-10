import express from "express";

import {
  createGenre,
  getAllGenres,
  getGenreById,
  updateGenre,
  deleteGenre,
} from "../controllers/genreController.js";

import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllGenres);
router.get("/:id", getGenreById);

router.post("/", verifyToken, authorizeRoles("ADMIN"), createGenre);
router.put("/:id", verifyToken, authorizeRoles("ADMIN"), updateGenre);
router.delete("/:id", verifyToken, authorizeRoles("ADMIN"), deleteGenre);

export default router;
