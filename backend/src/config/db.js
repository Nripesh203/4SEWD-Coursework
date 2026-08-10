import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "../library.db");
const db = new Database(dbPath);

db.exec(`CREATE TABLE IF NOT EXISTS genres (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
    )
    `);

db.exec(`CREATE TABLE IF NOT EXISTS authors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    biography TEXT
    )
    `);

db.exec(`
    CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author_id NOT NULL,
    genre_id NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    cover_image TEXT,
    FOREIGN KEY (author_id) REFERENCES authors(id),
    FOREIGN KEY (genre_id) REFERENCES genres(id)
    )
    
    `);

db.exec(`
    CREATE TABLE  IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL 
    )
    `);

try {
  db.exec(`ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'USER'`);
} catch (error) {
  console.error(`Cannot alter table: ${error.message}`);
}

console.log("Database connected successfully.");

db.pragma("foreign_keys = ON");

export default db;
