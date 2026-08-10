import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function GenreList() {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { isAdmin } = useAuth();

  useEffect(() => {
    loadGenres();
  }, []);

  const loadGenres = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/genres");
      setGenres(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to load genres",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete genre "${name}"?`)) {
      return;
    }

    try {
      await api.delete(`/genres/${id}`);
      setGenres((prev) => prev.filter((genre) => genre.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete genre");
    }
  };

  if (loading) return <div className="loading">Loading genres...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Genres</h1>
          <p className="page-subtitle">Manage book genres</p>
        </div>

        {/* Render Add button only for Admins */}
        {isAdmin && (
          <Link to="/genres/add" className="btn btn-primary">
            + Add New Genre
          </Link>
        )}
      </div>

      {genres.length === 0 ? (
        <p className="no-data">No genres found. Add one to get started!</p>
      ) : (
        <div className="genres-list">
          {genres.map((genre) => (
            <div key={genre.id} className="genre-card">
              <h3 className="genre-name">{genre.name}</h3>

              {/* Render Edit & Delete actions only for Admins */}
              {isAdmin && (
                <div className="genre-actions">
                  <Link
                    to={`/genres/edit/${genre.id}`}
                    className="btn btn-sm btn-edit"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(genre.id, genre.name)}
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

export default GenreList;
