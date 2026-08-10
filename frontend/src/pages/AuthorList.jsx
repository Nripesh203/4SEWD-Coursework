import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api"; // Assuming configured axios instance with token interceptors
import { useAuth } from "../context/AuthContext";

function AuthorList() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { isAdmin } = useAuth();

  // 1. Fetch authors on mount
  useEffect(() => {
    loadAuthors();
  }, []);

  const loadAuthors = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/authors");
      setAuthors(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to load authors",
      );
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Delete Action
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete author "${name}"?`)) {
      return;
    }

    try {
      await api.delete(`/authors/${id}`);
      // Remove deleted author locally
      setAuthors((prev) => prev.filter((author) => author.id !== id));
    } catch (err) {
      // Displays message if author cannot be deleted due to associated books
      alert(err.response?.data?.message || "Failed to delete author");
    }
  };

  if (loading) return <div className="loading">Loading authors...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Authors</h1>
          <p className="page-subtitle">Manage the authors in your library</p>
        </div>

        {/* Only show Add button if user is ADMIN */}
        {isAdmin && (
          <Link to="/authors/add" className="btn btn-primary">
            + Add New Author
          </Link>
        )}
      </div>

      {authors.length === 0 ? (
        <p className="no-data">No authors found. Add one to get started!</p>
      ) : (
        <div className="authors-list">
          {authors.map((author) => (
            <div key={author.id} className="author-card">
              <div className="author-info">
                <h3 className="author-name">{author.name}</h3>
                <p className="author-bio">
                  {author.biography || "No biography available."}
                </p>
              </div>

              {/* Only show Edit & Delete actions if user is ADMIN */}
              {isAdmin && (
                <div className="author-actions">
                  <Link
                    to={`/authors/edit/${author.id}`}
                    className="btn btn-sm btn-edit"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(author.id, author.name)}
                    className="btn btn-sm btn-danger"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AuthorList;
