import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchBooks, deleteBook, getImageUrl } from "../services/api";
import { useAuth } from "../context/AuthContext";

function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");

  const { isAdmin } = useAuth();

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchBooks();
      setBooks(data);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to fetch books",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await deleteBook(id);
      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete book");
    }
  };

  const genres = [
    "All",
    ...new Set(
      books.map((book) => book.genre_name || book.genre).filter(Boolean),
    ),
  ];

  const filteredBooks = books.filter((book) => {
    const matchesSearch = (book.title || "")
      .toLowerCase()
      .includes(search.toLowerCase());
    const bookGenre = book.genre_name || book.genre;
    const matchesGenre = selectedGenre === "All" || bookGenre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  if (loading) return <div className="loading">Loading library...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Books</h1>
          <p className="page-subtitle">Manage your library collection</p>
        </div>
        {/* Render Add button only for Admins */}
        {isAdmin && (
          <Link to="/books/add" className="btn btn-primary">
            + Add New Book
          </Link>
        )}
      </div>

      {/* Search & Filter */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="genre-select"
        >
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>

      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        <p className="no-data">No books found</p>
      ) : (
        <div className="books-grid">
          {filteredBooks.map((book) => {
            const coverUrl = getImageUrl(book.cover_image);

            return (
              <div
                key={book.id}
                className={`book-card ${book.stock < 5 ? "low-stock" : ""}`}
              >
                <div className="book-cover">
                  {coverUrl ? (
                    <img
                      src={coverUrl}
                      alt={book.title}
                      className="cover-img"
                    />
                  ) : (
                    <span>NO COVER</span>
                  )}
                </div>

                <div className="book-info">
                  <h3 className="book-title">{book.title}</h3>

                  <div className="book-meta">
                    <p>
                      <span>Author</span>{" "}
                      {book.author_name || book.author || "Unknown"}
                    </p>
                    <p>
                      <span>Genre</span>{" "}
                      {book.genre_name || book.genre || "N/A"}
                    </p>
                    <p>
                      <span>Stock</span>{" "}
                      <span className={book.stock < 5 ? "stock-low" : ""}>
                        {book.stock} {book.stock === 1 ? "copy" : "copies"}
                      </span>
                    </p>
                  </div>

                  <div className="book-actions">
                    <Link to={`/books/${book.id}`} className="btn btn-outline">
                      View Details
                    </Link>

                    {/* Render Edit & Delete only for Admins */}
                    {isAdmin && (
                      <>
                        <Link
                          to={`/books/edit/${book.id}`}
                          className="btn btn-dark"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(book.id, book.title)}
                          className="btn btn-danger"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default BookList;
