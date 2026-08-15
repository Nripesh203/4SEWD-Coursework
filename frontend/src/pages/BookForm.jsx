import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  fetchBookById,
  createBook,
  updateBook,
  getImageUrl,
} from "../services/api";
import api from "../services/api"; // ✅ Use your configured API instance

function BookForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    author_id: "",
    genre_id: "",
    stock: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);

        // ✅ Hit backend endpoints using the configured api client
        const [authorsRes, genresRes] = await Promise.all([
          api.get("/authors"),
          api.get("/genres"),
        ]);

        // ✅ Extra safeguard: Ensure data is an array
        const authorsData = Array.isArray(authorsRes.data)
          ? authorsRes.data
          : authorsRes.data?.authors || [];
        const genresData = Array.isArray(genresRes.data)
          ? genresRes.data
          : genresRes.data?.genres || [];

        setAuthors(authorsData);
        setGenres(genresData);

        if (isEditMode) {
          const book = await fetchBookById(id);
          setFormData({
            title: book.title || "",
            author_id: book.author_id || "",
            genre_id: book.genre_id || "",
            stock: book.stock !== undefined ? String(book.stock) : "",
          });

          if (book.cover_image) {
            setCoverPreview(getImageUrl(book.cover_image));
          }
        }
      } catch (err) {
        setSubmitError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load initial data",
        );
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.author_id) newErrors.author_id = "Author is required";
    if (!formData.genre_id) newErrors.genre_id = "Genre is required";
    if (formData.stock === "" || formData.stock === null) {
      newErrors.stock = "Stock quantity is required";
    } else if (Number(formData.stock) < 0) {
      newErrors.stock = "Stock cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitError("");

      const payload = new FormData();
      payload.append("title", formData.title.trim());
      payload.append("author_id", formData.author_id);
      payload.append("genre_id", formData.genre_id);
      payload.append("stock", formData.stock);

      if (selectedFile) {
        payload.append("cover_image", selectedFile);
      }

      if (isEditMode) {
        await updateBook(id, payload);
      } else {
        await createBook(payload);
      }

      navigate("/books");
    } catch (err) {
      setSubmitError(
        err.response?.data?.message || err.message || "Failed to save book",
      );
    }
  };

  if (loading) return <div className="loading">Loading form data...</div>;

  return (
    <div>
      <div className="page-header form-header">
        <div>
          <Link to="/books" className="back-link">
            ← Back to Books
          </Link>
          <h1 className="page-title">
            {isEditMode ? "Edit Book" : "Add New Book"}
          </h1>
          <p className="page-subtitle">
            {isEditMode
              ? "Update the book details"
              : "Fill in the details to add a new book"}
          </p>
        </div>
      </div>

      <div className="form-container">
        {submitError && <div className="error-message">{submitError}</div>}

        <form onSubmit={handleSubmit} className="book-form">
          {/* Title */}
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter book title"
            />
            {errors.title && <span className="error">{errors.title}</span>}
          </div>

          {/* Author */}
          <div className="form-group">
            <label htmlFor="author_id">Author *</label>
            <select
              id="author_id"
              name="author_id"
              value={formData.author_id}
              onChange={handleChange}
            >
              <option value="">Select an author</option>
              {Array.isArray(authors) &&
                authors.map((author) => (
                  <option key={author.id} value={author.id}>
                    {author.name}
                  </option>
                ))}
            </select>
            {errors.author_id && (
              <span className="error">{errors.author_id}</span>
            )}
          </div>

          {/* Genre */}
          <div className="form-group">
            <label htmlFor="genre_id">Genre *</label>
            <select
              id="genre_id"
              name="genre_id"
              value={formData.genre_id}
              onChange={handleChange}
            >
              <option value="">Select a genre</option>
              {Array.isArray(genres) &&
                genres.map((genre) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
            </select>
            {errors.genre_id && (
              <span className="error">{errors.genre_id}</span>
            )}
          </div>

          {/* Stock */}
          <div className="form-group">
            <label htmlFor="stock">Stock Quantity *</label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="e.g. 10"
              min="0"
            />
            {errors.stock && <span className="error">{errors.stock}</span>}
          </div>

          {/* Cover Image */}
          <div className="form-group">
            <label htmlFor="cover">Cover Image</label>
            <input
              type="file"
              id="cover"
              accept="image/*"
              onChange={handleImageChange}
            />
            {coverPreview && (
              <div className="cover-preview">
                <img src={coverPreview} alt="Cover preview" />
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {isEditMode ? "Update Book" : "Add Book"}
            </button>
            <Link to="/books" className="btn btn-outline">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookForm;
