import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : "http://localhost:3000/api",
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const getImageUrl = (imageName) => {
  if (!imageName) return null;
  if (imageName.startsWith("http://") || imageName.startsWith("https://")) {
    return imageName;
  }
  return `${API_BASE_URL}/uploads/${imageName}`;
};

export const fetchBooks = async (search = "", genreId = "", authorId = "") => {
  const response = await api.get("/books", {
    params: { search, genreId, author_id: authorId },
  });
  return response.data;
};

export const fetchBookById = async (id) => {
  const response = await api.get(`/books/${id}`);
  return response.data;
};

export const createBook = async (formData) => {
  const response = await api.post("/books", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateBook = async (id, formData) => {
  const response = await api.put(`/books/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteBook = async (id) => {
  const response = await api.delete(`/books/${id}`);
  return response.data;
};

export const fetchAuthors = async () => {
  const response = await api.get("/authors");
  return response.data;
};

export const fetchAuthorById = async (id) => {
  const response = await api.get(`/authors/${id}`);
  return response.data;
};

export const createAuthor = async (data) => {
  const response = await api.post("/authors", data);
  return response.data;
};

export const updateAuthor = async (id, data) => {
  const response = await api.put(`/authors/${id}`, data);
  return response.data;
};

export const deleteAuthor = async (id) => {
  const response = await api.delete(`/authors/${id}`);
  return response.data;
};

export const fetchGenres = async () => {
  const response = await api.get("/genres");
  return response.data;
};

export const fetchGenreById = async (id) => {
  const response = await api.get(`/genres/${id}`);
  return response.data;
};

export const createGenre = async (data) => {
  const response = await api.post("/genres", data);
  return response.data;
};

export const updateGenre = async (id, data) => {
  const response = await api.put(`/genres/${id}`, data);
  return response.data;
};

export const deleteGenre = async (id) => {
  const response = await api.delete(`/genres/${id}`);
  return response.data;
};

export default api;
