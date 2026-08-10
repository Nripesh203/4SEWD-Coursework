import db from "../config/db.js";

export const getAllAuthors = async (req, res) => {
  try {
    const authors = db.prepare("SELECT * FROM authors ORDER BY name").all();
    res.json(authors);
  } catch (error) {
    res.status(500).json({
      message: `Server error: ${error.message}`,
    });
  }
};

export const getAuthorById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const author = db.prepare("SELECT * FROM authors WHERE id = ? ").get(id);

    if (!author) {
      return res.status(404).json({
        message: "Author not found",
      });
    }
    res.json(author);
  } catch (error) {
    res.status(500).json({
      message: `Server error: ${error.message}`,
    });
  }
};

export const createAuthor = async (req, res) => {
  try {
    const { name, biography } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        message: "Author name is required.",
      });
    }

    const result = db
      .prepare("INSERT INTO authors (name, biography) VALUES (?, ?)")
      .run(name.trim(), biography?.trim() || null);

    const newAuthor = {
      id: result.lastInsertRowid,
      name: name.trim(),
      biography: biography?.trim() || null,
    };

    res.status(201).json(newAuthor);
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(400).json({
        message: "Author Already exists",
      });
    }
    res.status(500).json({
      message: `Server error: ${error.message}`,
    });
  }
};

export const updateAuthor = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, biography } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        message: "Author name is required.",
      });
    }

    const result = db
      .prepare("UPDATE authors SET name = ?, biography = ? WHERE id = ?")
      .run(name.trim(), biography?.trim() || null, id);

    if (result.changes === 0) {
      return res.status(404).json({
        message: "Author not found.",
      });
    }
    res.json({
      id,
      name: name.trim(),
      biography: biography?.trim() || null,
    });
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(400).json({
        message: "Author already exists",
      });
    }
    res.status(500).json({
      message: `Server error: ${error.message}`,
    });
  }
};

export const deleteAuthor = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const author = db.prepare("SELECT id FROM authors WHERE id = ?").get(id);

    if (!author) {
      return res.status(404).json({
        message: "Author not found",
      });
    }

    const linkedBooks = db
      .prepare("SELECT COUNT(*) AS count FROM books WHERE author_id = ?")
      .get(id);

    if (linkedBooks.count > 0) {
      return res.status(400).json({
        message: `Cannot delete author. There are ${linkedBooks.count} book(s) associated with this author. Delete or reassign those books first.`,
      });
    }

    db.prepare("DELETE FROM authors WHERE id = ?").run(id);

    res.status(200).json({
      message: "Author deleted successfully.",
    });
  } catch (error) {
    if (
      error.code === "SQLITE_CONSTRAINT_FOREIGNKEY" ||
      error.code === "SQLITE_CONSTRAINT"
    ) {
      return res.status(400).json({
        message: "Cannot delete author because they have associated books",
      });
    }

    res.status(500).json({
      message: `Server error: ${error.message}`,
    });
  }
};
