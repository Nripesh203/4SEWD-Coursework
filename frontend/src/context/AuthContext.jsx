import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("library_user");
    const storedToken = localStorage.getItem("library_token");

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse stored user data:", err);
        localStorage.removeItem("library_user");
        localStorage.removeItem("library_token");
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("library_user", JSON.stringify(userData));
    if (token) {
      localStorage.setItem("library_token", token);
    }
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("library_user");
    localStorage.removeItem("library_token");
    localStorage.removeItem("token");
    setUser(null);
  };

  const isAdmin = user?.role === "ADMIN" || user?.role === "admin";

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
