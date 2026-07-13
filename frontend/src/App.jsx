import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import BookCard from "./components/BookCard";
import BookForm from "./components/BookForm";
import BookDetail from "./components/BookDetail";
import { getAllBooks, removeBook } from "./services/bookService";
import "./style.css";

function App() {
  const [view, setView] = useState("catalog");
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    async function loadInitialData() {
      const storedBooks = await getAllBooks();
      setBooks(storedBooks);
    }
    loadInitialData();
  }, []);

  const handleSelectBook = (book) => {
    setSelectedBook(book);
    setView("detail");
  };

  const handleDeleteBook = async (id) => {
    const updated = await removeBook(id);
    setBooks(updated);
    setView("catalog");
  };

  return (
    <>
      <Header setView={setView} />
      <hr />
      <main>
        {view === "catalog" && (
          <>
            <section>
              <h1>Library Catalog</h1>
              <p>
                Welcome to the administrator dashboard system. Managing local
                repository assets.
              </p>
            </section>
            <div
              className="controls-container"
              style={{ marginBottom: "20px" }}
            >
              <input type="text" placeholder="🔍 Search by title..." />
              <select defaultValue="">
                <option value="">Filter by Genre</option>
                <option value="1">Fantasy</option>
                <option value="2">Historical Fiction</option>
                <option value="3">Sci-Fi</option>
              </select>
            </div>
            <section>
              <h2>Available Collection Items</h2>
              <div className="catalog-grid">
                <div className="book-card">
                  <div className="wireframe-img">Cover Image</div>
                  <h3>Meditations</h3>
                  <ul>
                    <li>
                      <strong>Author</strong>Marcus Aurelius
                    </li>
                    <li>
                      <strong>Genre</strong>Stoic Philosophy
                    </li>
                    <li>
                      <strong>Stock</strong>12 copies
                    </li>
                  </ul>
                  <div className="card-actions">
                    <a
                      href="#"
                      className="view-link"
                      onClick={(e) => {
                        e.preventDefault();
                        handleSelectBook({
                          id: "static-1",
                          title: "Meditations",
                          author: "Marcus Aurelius",
                          genre: "Stoic Philosophy",
                          stock: 12,
                        });
                      }}
                    >
                      View Details
                    </a>
                    <a
                      href="#"
                      className="edit-link"
                      onClick={(e) => e.preventDefault()}
                    >
                      Edit
                    </a>
                  </div>
                </div>
                {books.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onSelect={handleSelectBook}
                  />
                ))}
              </div>
            </section>
          </>
        )}

        {view === "form" && (
          <BookForm onBookAdded={setBooks} setView={setView} />
        )}
        {view === "detail" && (
          <BookDetail
            book={selectedBook}
            setView={setView}
            onDelete={handleDeleteBook}
          />
        )}
      </main>
      <hr />
      <footer>
        <p>
          &copy; 2026 Library Management Application System. All rights
          reserved.
        </p>
      </footer>
    </>
  );
}

export default App;
