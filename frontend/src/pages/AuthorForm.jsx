import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function AuthorForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    biography: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!isEditMode) return;

    const fetchAuthor = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/authors/${id}`);
        setFormData({
          name: response.data?.name || response.data?.author?.name || "",
          biography:
            response.data?.biography || response.data?.author?.biography || "",
        });
      } catch (err) {
        setSubmitError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load author details",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAuthor();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Author name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitError("");

      const payload = {
        name: formData.name.trim(),
        biography: formData.biography.trim(),
      };

      if (isEditMode) {
        await api.put(`/authors/${id}`, payload);
      } else {
        await api.post("/authors", payload);
      }

      navigate("/authors");
    } catch (err) {
      setSubmitError(
        err.response?.data?.message || err.message || "Failed to save author",
      );
    }
  };

  if (loading) return <div className="loading">Loading author...</div>;

  return (
    <div>
      <div className="page-header form-header">
        <div>
          <Link to="/authors" className="back-link">
            ← Back to Authors
          </Link>
          <h1 className="page-title">
            {isEditMode ? "Edit Author" : "Add New Author"}
          </h1>
          <p className="page-subtitle">
            {isEditMode
              ? "Update author details"
              : "Add a new author to the library"}
          </p>
        </div>
      </div>

      <div className="form-container">
        {submitError && <div className="error-message">{submitError}</div>}

        <form onSubmit={handleSubmit} className="book-form">
          {/* Name */}
          <div className="form-group">
            <label htmlFor="name">Author Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter author name"
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>

          {/* Biography */}
          <div className="form-group">
            <label htmlFor="biography">Biography</label>
            <textarea
              id="biography"
              name="biography"
              value={formData.biography}
              onChange={handleChange}
              placeholder="Write a short biography (optional)"
              rows="5"
            />
          </div>

          {/* Buttons */}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {isEditMode ? "Update Author" : "Add Author"}
            </button>
            <Link to="/authors" className="btn btn-outline">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AuthorForm;
