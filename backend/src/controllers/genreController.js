import db from "../config/db.js";

export const getAllGenres = async (req, res) => {
  try {
    const genres = db.prepare("SELECT * FROM genres ORDER BY name").all();
    res.json(genres);
  } catch (error) {
    res.status(500).json({
      message: `Server Error: ${error.message}`,
    });
  }
};

export const getGenreById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const genre = db.prepare("SELECT * FROM genres WHERE id = ?").get(id);

    if (!genre) {
      return res.status(404).json({
        message: "Genre not found.",
      });
    }

    res.json(genre);
  } catch (error) {
    res.status(500).json({
      message: `Server Error: ${error.message}`,
    });
  }
};

export const createGenre = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        message: "Genre name is required",
      });
    }

    const result = db
      .prepare("INSERT INTO genres (name) VALUES (?)")
      .run(name.trim());

    const newGenre = {
      id: result.lastInsertRowid,
      name: name.trim(),
    };

    res.status(201).json(newGenre);
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(400).json({ message: "Genre already exists" });
    }
    res.status(500).json({
      message: `Server Error: ${error.message}`,
    });
  }
};

export const updateGenre = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        message: "Name is required",
      });
    }

    const result = db
      .prepare("UPDATE genres SET name = ? WHERE id = ?")
      .run(name.trim(), id);

    if (result.changes === 0) {
      return res.status(404).json({ message: "Genre not found" });
    }

    res.json({
      id,
      name: name.trim(),
    });
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(400).json({ message: "Genre already exists" });
    }
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const deleteGenre = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const result = db.prepare("DELETE FROM genres WHERE id = ?").run(id);

    if (result.changes === 0) {
      return res.status(404).json({ message: "Genre not found" });
    }
    res.json({ message: "Genre deleted successfully" });
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_FOREIGNKEY") {
      return res.status(400).json({
        message: "Cannot delete genre because it is associated with books",
      });
    }
    res.status(error).json({
      message: `Server Error: ${error.message}`,
    });
  }
};
