import React from "react";

function Header({ setView }) {
  return (
    <header>
      <nav>
        <span>
          🌐 <strong>Library Admin</strong>
        </span>
        <div className="nav-links">
          <button
            type="button"
            onClick={() => setView("catalog")}
            style={{
              background: "none",
              border: "none",
              fontWeight: "bold",
              cursor: "pointer",
              textTransform: "uppercase",
            }}
          >
            Books
          </button>
          <a href="#" onClick={(e) => e.preventDefault()}>
            Authors
          </a>
          <a href="#" onClick={(e) => e.preventDefault()}>
            Genres
          </a>
          <button
            type="button"
            onClick={() => setView("form")}
            style={{
              background: "none",
              border: "none",
              fontWeight: "bold",
              cursor: "pointer",
              textTransform: "uppercase",
            }}
          >
            Edit
          </button>
        </div>
        <button type="button">Admin Logout</button>
      </nav>
    </header>
  );
}

export default Header;
