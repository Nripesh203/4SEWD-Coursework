import express from "express";

import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} from "../controllers/bookController.js";
import { upload } from "../middleware/upload.js";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllBooks);
router.get("/:id", getBookById);
router.post(
  "/",
  verifyToken,
  authorizeRoles("ADMIN"),
  upload.single("cover_image"),
  createBook,
);
router.put(
  "/:id",
  verifyToken,
  authorizeRoles("ADMIN"),
  upload.single("cover_image"),
  updateBook,
);
router.delete("/:id", verifyToken, authorizeRoles("ADMIN"), deleteBook);

export default router;
