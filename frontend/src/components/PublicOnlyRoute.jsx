import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicOnlyRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <div className="loading">Checking authorization...</div>;

  return user ? <Navigate to="/books" replace /> : <Outlet />;
};

export default PublicOnlyRoute;
