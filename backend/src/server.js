import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import db from "./config/db.js";
import cookieParser from "cookie-parser";
import genreRoutes from "./routes/genres.js";
import authorRoutes from "./routes/authors.js";
import bookRoutes from "./routes/books.js";
import authRoutes from "./routes/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://foursewd-coursework-library-management-6tg1.onrender.com",
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS blocked this request"));
      }
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/genres", genreRoutes);
app.use("/api/authors", authorRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/auth", authRoutes);

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/", (req, res) =>
  res.json({
    message: "Library Management System",
  }),
);

const PORT = process.env.PORT || 3000;

const startServer = () => {
  try {
    app.listen(PORT, () =>
      console.log(`Server is running on port: http://localhost:${PORT}`),
    );
  } catch (error) {
    console.error("Failed to start server", error.message);
    process.exit(1);
  }
};

startServer();
