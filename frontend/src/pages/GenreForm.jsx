import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function GenreForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!isEditMode) return;

    const fetchGenre = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/genres/${id}`);
        setName(response.data?.name || response.data?.genre?.name || "");
      } catch (err) {
        setSubmitError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load genre details",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchGenre();
  }, [id, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Genre name is required");
      return;
    }

    try {
      setSubmitError("");

      const payload = { name: name.trim() };

      if (isEditMode) {
        await api.put(`/genres/${id}`, payload);
      } else {
        await api.post("/genres", payload);
      }

      navigate("/genres");
    } catch (err) {
      setSubmitError(
        err.response?.data?.message || err.message || "Failed to save genre",
      );
    }
  };

  if (loading) return <div className="loading">Loading genre...</div>;

  return (
    <div>
      <div className="page-header form-header">
        <div>
          <Link to="/genres" className="back-link">
            ← Back to Genres
          </Link>
          <h1 className="page-title">
            {isEditMode ? "Edit Genre" : "Add New Genre"}
          </h1>
          <p className="page-subtitle">
            {isEditMode
              ? "Update genre name"
              : "Add a new genre to the library"}
          </p>
        </div>
      </div>

      <div className="form-container">
        {submitError && <div className="error-message">{submitError}</div>}

        <form onSubmit={handleSubmit} className="book-form">
          <div className="form-group">
            <label htmlFor="name">Genre Name *</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              placeholder="Enter genre name"
            />
            {error && <span className="error">{error}</span>}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {isEditMode ? "Update Genre" : "Add Genre"}
            </button>
            <Link to="/genres" className="btn btn-outline">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GenreForm;
