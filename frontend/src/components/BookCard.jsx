import React from "react";

function BookCard({ book, onSelect }) {
  return (
    <div className="book-card">
      {book.stock === 0 && (
        <span className="low-stock-alert">0 Copies Left</span>
      )}
      <div className="wireframe-img">Cover Image</div>
      <h3>{book.title}</h3>
      <ul>
        <li>
          <strong>Author</strong>
          {book.author}
        </li>
        <li>
          <strong>Genre</strong>
          {book.genre}
        </li>
        <li>
          <strong>Stock</strong>
          {book.stock} copies
        </li>
      </ul>
      <div className="card-actions">
        <a
          href="#"
          className="view-link"
          onClick={(e) => {
            e.preventDefault();
            onSelect(book);
          }}
        >
          View Details
        </a>
        <a href="#" className="edit-link" onClick={(e) => e.preventDefault()}>
          Edit
        </a>
      </div>
    </div>
  );
}

export default BookCard;
