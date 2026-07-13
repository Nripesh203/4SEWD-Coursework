import React from "react";

function BookDetail({ book, setView, onDelete }) {
  return (
    <section className="detail-view-container">
      <div className="detail-cover-wrapper">
        <div className="wireframe-img" style={{ height: "550px" }}>
          Large Cover Image Placeholder
        </div>
      </div>
      <div className="detail-info-wrapper">
        <p>
          <span>LIBRARY RECORD</span>
        </p>
        <h1>{book.title}</h1>
        <hr />
        <ul>
          <li>
            <strong>AUTHOR:</strong> <span>{book.author}</span>
          </li>
          <li>
            <strong>GENRE:</strong> <span>{book.genre}</span>
          </li>
          <li>
            <strong>TOTAL INVENTORY STOCK:</strong>{" "}
            <span>{book.stock} Copies</span>
          </li>
          <li>
            <strong>CLASSIFICATION:</strong> <span>Standard Registry</span>
          </li>
          <li>
            <strong>ACQUISITION DATE:</strong> <span>2026-03-15</span>
          </li>
          <li>
            <strong>CALL NUMBER:</strong> <span>LIB-REF-2026</span>
          </li>
        </ul>
        <br />
        <hr />
        <br />
        <div className="detail-actions-block">
          <button type="button" onClick={() => setView("catalog")}>
            BACK TO CATALOG
          </button>
          <button type="button" onClick={() => onDelete(book.id)}>
            DELETE BOOK
          </button>
        </div>
      </div>
    </section>
  );
}

export default BookDetail;
