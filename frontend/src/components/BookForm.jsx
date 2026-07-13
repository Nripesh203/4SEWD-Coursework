import React, { useState } from "react";
import { addBook } from "../services/bookService";

function BookForm({ onBookAdded, setView }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [stock, setStock] = useState(0);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = "Book title cannot be left blank.";
    } else if (title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters long.";
    }

    if (!author) newErrors.author = "Please select an author from the list.";
    if (!genre) newErrors.genre = "Please select a genre from the list.";
    if (stock < 0)
      newErrors.stock = "Stock quantity must be 0 or a positive number.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    const authorText =
      e.target.bookAuthor.options[e.target.bookAuthor.selectedIndex].text;
    const genreText =
      e.target.bookGenre.options[e.target.bookGenre.selectedIndex].text;

    const updatedBooks = await addBook({
      title: title.trim(),
      author: authorText,
      genre: genreText,
      stock: parseInt(stock, 10),
    });

    onBookAdded(updatedBooks);
    setView("catalog");
  };

  return (
    <section>
      <p>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setView("catalog");
          }}
        >
          &lt; BACK TO CATALOG
        </a>
      </p>
      <br />
      <form id="bookForm" onSubmit={handleSubmit}>
        <fieldset>
          <legend>ARCHIVAL REGISTRY - FORM NO. LIB-004</legend>
          <br />
          <div>
            <label htmlFor="bookTitle">BOOK TITLE</label>
            <br />
            <input
              type="text"
              id="bookTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Book title"
            />
            {errors.title && (
              <span
                className="field-error-msg"
                style={{
                  color: "#8c2d19",
                  fontSize: "0.8rem",
                  display: "block",
                  marginTop: "5px",
                }}
              >
                ⚠️ {errors.title}
              </span>
            )}
          </div>
          <br />
          <div>
            <label htmlFor="bookAuthor">AUTHOR</label>
            <br />
            <select
              id="bookAuthor"
              name="bookAuthor"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            >
              <option value="">Select author</option>
              <option value="marcus">Marcus Aurelius</option>
              <option value="goggins">David Goggins</option>
              <option value="tyson">Mike Tyson</option>
            </select>
            {errors.author && (
              <span
                className="field-error-msg"
                style={{
                  color: "#8c2d19",
                  fontSize: "0.8rem",
                  display: "block",
                  marginTop: "5px",
                }}
              >
                ⚠️ {errors.author}
              </span>
            )}
          </div>
          <br />
          <div>
            <label htmlFor="bookGenre">GENRE</label>
            <br />
            <select
              id="bookGenre"
              name="bookGenre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            >
              <option value="">Select genre</option>
              <option value="philosophy">Philosophy</option>
              <option value="biography">Biography</option>
              <option value="fantasy">Fantasy</option>
            </select>
            {errors.genre && (
              <span
                className="field-error-msg"
                style={{
                  color: "#8c2d19",
                  fontSize: "0.8rem",
                  display: "block",
                  marginTop: "5px",
                }}
              >
                ⚠️ {errors.genre}
              </span>
            )}
          </div>
          <br />
          <div>
            <label htmlFor="stockQuantity">STOCK QUANTITY</label>
            <br />
            <input
              type="number"
              id="stockQuantity"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              min="0"
            />
            {errors.stock && (
              <span
                className="field-error-msg"
                style={{
                  color: "#8c2d19",
                  fontSize: "0.8rem",
                  display: "block",
                  marginTop: "5px",
                }}
              >
                ⚠️ {errors.stock}
              </span>
            )}
          </div>
          <br />
          <div>
            <label htmlFor="coverImage">COVER IMAGE</label>
            <br />
            <span>Upload Local Cover Image File (No URLs)</span>
            <br />
            <small>PNG, JPG, WebP max 5 MB</small>
            <br />
            <input type="file" id="coverImage" accept="image/*" />
          </div>
          <br />
          <hr />
          <br />
          <div style={{ display: "flex", gap: "15px" }}>
            <button type="submit">SAVE TO CATALOG</button>
            <button type="button" onClick={() => setView("catalog")}>
              CANCEL
            </button>
          </div>
        </fieldset>
      </form>
    </section>
  );
}

export default BookForm;
