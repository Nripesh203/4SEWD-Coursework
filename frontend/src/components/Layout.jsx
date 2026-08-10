import { NavLink, Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Library</h2>
          <p>Management System</p>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/books"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Books
          </NavLink>
          <NavLink
            to="/authors"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Authors
          </NavLink>
          <NavLink
            to="/genres"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Genres
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <NavLink to="/login" className="logout-btn">
            Logout
          </NavLink>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
