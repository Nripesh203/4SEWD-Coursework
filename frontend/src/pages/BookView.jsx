import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchBookById, getImageUrl } from "../services/api";

function BookView() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBook = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchBookById(id);
        setBook(data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load book details",
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadBook();
    }
  }, [id]);

  if (loading) return <div className="loading">Loading book details...</div>;

  if (error || !book) {
    return (
      <div>
        <h1 className="page-title">{error || "Book not found"}</h1>
        <Link to="/books" className="back-link">
          ← Back to Books
        </Link>
      </div>
    );
  }

  const coverUrl = getImageUrl(book.cover_image);

  return (
    <div>
      <div className="page-header form-header">
        <div>
          <Link to="/books" className="back-link">
            ← Back to Books
          </Link>
          <h1 className="page-title">Book Details</h1>
        </div>
      </div>

      <div className="book-view-container">
        {/* Cover */}
        <div className="book-view-cover">
          {coverUrl ? (
            <img src={coverUrl} alt={book.title} className="cover-img" />
          ) : (
            <div className="cover-placeholder">
              <span>NO COVER</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="book-view-details">
          <h2 className="book-view-title">{book.title}</h2>

          <div className="detail-row">
            <span className="detail-label">Author</span>
            <span className="detail-value">{book.author || "Unknown"}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Genre</span>
            <span className="detail-value">{book.genre || "N/A"}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Stock</span>
            <span
              className={`detail-value ${book.stock < 5 ? "stock-low" : ""}`}
            >
              {book.stock} {book.stock === 1 ? "copy" : "copies"}
              {book.stock < 5 && (
                <span className="low-stock-tag">Low Stock</span>
              )}
            </span>
          </div>

          <div className="book-view-actions">
            <Link to={`/books/edit/${book.id}`} className="btn btn-primary">
              Edit Book
            </Link>
            <Link to="/books" className="btn btn-outline">
              Back to List
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookView;
