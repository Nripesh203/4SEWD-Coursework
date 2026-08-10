import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BookList from "./pages/BookList";
import BookView from "./pages/BookView";
import BookForm from "./pages/BookForm";
import AuthorList from "./pages/AuthorList";
import AuthorForm from "./pages/AuthorForm";
import GenreList from "./pages/GenreList";
import GenreForm from "./pages/GenreForm";

function App() {
  return (
    <Routes>
      {/* 1. Unprotected / Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 2. Protected App Area (Requires Authentication) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/books" element={<BookList />} />
          <Route path="/books/:id" element={<BookView />} />
          <Route path="/authors" element={<AuthorList />} />
          <Route path="/genres" element={<GenreList />} />
        </Route>
      </Route>

      {/* 3. Admin-Only Protected Area (Separated to prevent nesting issues) */}
      <Route element={<ProtectedRoute requireAdmin={true} />}>
        <Route element={<Layout />}>
          <Route path="/books/add" element={<BookForm />} />
          <Route path="/books/edit/:id" element={<BookForm />} />
          <Route path="/authors/add" element={<AuthorForm />} />
          <Route path="/authors/edit/:id" element={<AuthorForm />} />
          <Route path="/genres/add" element={<GenreForm />} />
          <Route path="/genres/edit/:id" element={<GenreForm />} />
        </Route>
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
