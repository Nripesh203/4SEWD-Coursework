import db from "../config/db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getAllBooks = async (req, res) => {
  try {
    const { search, genreId, author_id } = req.query;

    let sql = `
      SELECT 
        books.*,
        authors.name AS author_name,
        genres.name AS genre_name
      FROM books
      LEFT JOIN authors ON books.author_id = authors.id
      LEFT JOIN genres ON books.genre_id = genres.id
      WHERE 1=1
    `;

    const params = [];

    if (search && search.trim() !== "") {
      sql += ` AND (books.title LIKE ? OR books.description LIKE ?)`;
      const searchTerm = `%${search.trim()}%`;
      params.push(searchTerm, searchTerm);
    }

    if (genreId) {
      sql += ` AND books.genre_id = ?`;
      params.push(Number(genreId));
    }

    if (author_id) {
      sql += ` AND books.author_id = ?`;
      params.push(Number(author_id));
    }

    sql += ` ORDER BY books.id DESC`;

    const books = db.prepare(sql).all(...params);

    res.json(books);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

export const getBookById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const book = db
      .prepare(
        `
      SELECT 
        books.id,
        books.title,
        books.stock,
        books.cover_image,
        books.author_id,
        books.genre_id,
        authors.name AS author,
        genres.name AS genre
      FROM books
      LEFT JOIN authors ON books.author_id = authors.id
      LEFT JOIN genres ON books.genre_id = genres.id
      WHERE books.id = ?
      `,
      )
      .get(id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(book);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

export const createBook = async (req, res) => {
  try {
    const { title, author_id, genre_id, stock } = req.body;

    if (!title || title.trim() === "") {
      if (req.file) fs.unlinkSync(req.file.filePath);
      return res.status(400).json({ message: "Title is required" });
    }
    if (!author_id) {
      if (req.file) fs.unlinkSync(req.file.filePath);
      return res.status(400).json({ message: "Author is required" });
    }
    if (!genre_id) {
      if (req.file) fs.unlinkSync(req.file.filePath);
      return res.status(400).json({ message: "Genre is required" });
    }
    if (stock === undefined || stock === null || Number(stock) < 0) {
      if (req.file) fs.unlinkSync(req.file.filePath);
      return res.status(400).json({ message: "Stock must be 0 or higher" });
    }

    const authorExists = db
      .prepare("SELECT id FROM authors WHERE id = ?")
      .get(Number(author_id));

    if (!authorExists) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({
        message: `Author with ID ${author_id} does not exist`,
      });
    }

    const genreExists = db
      .prepare("SELECT id FROM genres WHERE id = ?")
      .get(Number(genre_id));

    if (!genreExists) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({
        message: `Genre with ID ${genre_id} does not exist`,
      });
    }

    const cover_image = req.file ? req.file.filename : null;

    const result = db
      .prepare(
        `
        INSERT INTO books (title, author_id, genre_id, stock, cover_image)
        VALUES (?, ?, ?, ?, ?)
      `,
      )
      .run(
        title.trim(),
        Number(author_id),
        Number(genre_id),
        Number(stock),
        cover_image,
      );

    const newBook = db
      .prepare(
        `
        SELECT 
          books.id,
          books.title,
          books.stock,
          books.cover_image,
          authors.name AS author,
          genres.name AS genre
        FROM books
        JOIN authors ON books.author_id = authors.id
        JOIN genres ON books.genre_id = genres.id
        WHERE books.id = ?
      `,
      )
      .get(result.lastInsertRowid);

    res.status(201).json(newBook);
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

export const updateBook = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, author_id, genre_id, stock } = req.body;

    const existingBook = db
      .prepare("SELECT cover_image from books WHERE id =?")
      .get(id);

    if (!existingBook) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({
        message: "Book not found",
      });
    }

    if (!title || title.trim() === "") {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ message: "Title is required" });
    }
    if (!author_id) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ message: "Author is required" });
    }
    if (!genre_id) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ message: "Genre is required" });
    }
    if (stock === undefined || stock === null || Number(stock) < 0) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ message: "Stock must be 0 or higher" });
    }

    const authorExists = db
      .prepare("SELECT id FROM authors WHERE id = ?")
      .get(Number(author_id));

    if (!authorExists) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        message: `Author with id ${author_id} does not exists.`,
      });
    }

    const genreExists = db
      .prepare("SELECT id FROM genres WHERE id = ?")
      .get(Number(genre_id));

    if (!genreExists) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        message: `Genre with ID ${genre_id} does not exist`,
      });
    }

    let cover_image = existingBook.cover_image;

    if (req.file) {
      cover_image = req.file.filename;

      if (existingBook.cover_image) {
        const oldFilePath = path.join(
          process.cwd(),
          "uploads",
          existingBook.cover_image,
        );
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
    }

    const result = db
      .prepare(
        `
        UPDATE books
        SET title = ?, author_id = ?, genre_id = ?, stock = ?, cover_image = ?
        WHERE id = ?
      `,
      )
      .run(
        title.trim(),
        Number(author_id),
        Number(genre_id),
        Number(stock),
        cover_image,
        id,
      );

    if (result.changes === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    const updatedBook = db
      .prepare(
        `
        SELECT 
          books.id,
          books.title,
          books.stock,
          books.cover_image,
          authors.name AS author,
          genres.name AS genre
        FROM books
        JOIN authors ON books.author_id = authors.id
        JOIN genres ON books.genre_id = genres.id
        WHERE books.id = ?
      `,
      )
      .get(id);

    res.json(updatedBook);
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const book = db.prepare("SELECT * FROM books WHERE id = ?").get(id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.cover_image) {
      const filePath = path.join(process.cwd(), "uploads", book.cover_image);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    db.prepare("DELETE FROM books WHERE id = ?").run(id);

    res.json({ message: "Book and cover image deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};
