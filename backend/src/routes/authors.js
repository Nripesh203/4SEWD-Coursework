import express from "express";

import {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} from "../controllers/authorController.js";

import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllAuthors);
router.get("/:id", getAuthorById);

router.post("/", verifyToken, authorizeRoles("ADMIN"), createAuthor);
router.put("/:id", verifyToken, authorizeRoles("ADMIN"), updateAuthor);
router.delete("/:id", verifyToken, authorizeRoles("ADMIN"), deleteAuthor);

export default router;
