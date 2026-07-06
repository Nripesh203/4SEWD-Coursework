document.addEventListener("DOMContentLoaded", function () {
  const bookForm = document.getElementById("bookForm");

  if (bookForm) {
    bookForm.addEventListener("submit", function (event) {
      event.preventDefault();
      clearErrors();

      const titleInput = document.getElementById("bookTitle");
      const authorSelect = document.getElementById("bookAuthor");
      const genreSelect = document.getElementById("bookGenre");
      const stockInput = document.getElementById("stockQuantity");

      let isValid = true;

      if (titleInput.value.trim() === "") {
        showError(titleInput, "Book title cannot be left blank.");
        isValid = false;
      } else if (titleInput.value.trim().length < 3) {
        showError(titleInput, "Title must be at least 3 characters long.");
        isValid = false;
      }

      if (authorSelect.value === "") {
        showError(authorSelect, "Please select an author from the list.");
        isValid = false;
      }

      if (genreSelect.value === "") {
        showError(genreSelect, "Please select a genre from the list.");
        isValid = false;
      }

      if (stockInput.value === "" || parseInt(stockInput.value) < 0) {
        showError(stockInput, "Stock quantity must be 0 or a positive number.");
        isValid = false;
      }

      if (!isValid) {
        return;
      }

      const newBook = {
        title: titleInput.value.trim(),
        author: authorSelect.options[authorSelect.selectedIndex].text,
        genre: genreSelect.options[genreSelect.selectedIndex].text,
        stock: parseInt(stockInput.value),
      };

      let savedBooks = JSON.parse(localStorage.getItem("libraryBooks")) || [];
      savedBooks.push(newBook);
      localStorage.setItem("libraryBooks", JSON.stringify(savedBooks));

      bookForm.reset();

      if (document.querySelector(".catalog-grid")) {
        renderCatalog();
      } else {
        window.location.href = "index.html";
      }
    });
  }

  function showError(inputElement, message) {
    const errorSpan = document.createElement("span");
    errorSpan.className = "field-error-msg";
    errorSpan.style.color = "#8c2d19";
    errorSpan.style.fontSize = "0.8rem";
    errorSpan.style.display = "block";
    errorSpan.style.marginTop = "5px";
    errorSpan.innerText = "⚠️ " + message;
    inputElement.parentNode.appendChild(errorSpan);
  }

  function clearErrors() {
    const activeErrors = document.querySelectorAll(".field-error-msg");
    activeErrors.forEach(function (error) {
      error.remove();
    });
  }

  function renderCatalog() {
    const catalogGrid = document.querySelector(".catalog-grid");
    if (!catalogGrid) return;

    const dynamicCards = catalogGrid.querySelectorAll(
      ".book-card.dynamic-card",
    );
    dynamicCards.forEach((card) => card.remove());

    const customBooks = JSON.parse(localStorage.getItem("libraryBooks")) || [];

    customBooks.forEach(function (book) {
      const bookCard = document.createElement("div");
      bookCard.className = "book-card dynamic-card";

      let lowStockAlertHtml = "";
      if (book.stock === 0) {
        lowStockAlertHtml = `<span class="low-stock-alert">0 Copies Left</span>`;
      }

      bookCard.innerHTML = `
                ${lowStockAlertHtml}
                <div class="wireframe-img">Cover Image</div>
                <h3>${book.title}</h3>
                <ul>
                    <li><strong>Author</strong>${book.author}</li>
                    <li><strong>Genre</strong>${book.genre}</li>
                    <li>--<strong>Stock</strong>${book.stock} copies</li>
                </ul>
                <div class="card-actions">
                    <a href="detail.html" class="view-link" data-title="${book.title}">View Details</a>
                    <a href="form.html" class="edit-link">Edit</a>
                </div>
            `;

      catalogGrid.appendChild(bookCard);
    });

    catalogGrid.querySelectorAll(".view-link").forEach((link) => {
      link.addEventListener("click", function () {
        const title = this.getAttribute("data-title");
        if (title) {
          localStorage.setItem("selectedBookTitle", title);
        }
      });
    });
  }

  if (document.querySelector(".catalog-grid")) {
    renderCatalog();
  }

  const detailContainer = document.querySelector(".detail-view-container");
  if (detailContainer) {
    const selectedTitle = localStorage.getItem("selectedBookTitle");
    if (selectedTitle) {
      const heading = detailContainer.querySelector("h1");
      if (heading) heading.innerText = selectedTitle;

      const customBooks =
        JSON.parse(localStorage.getItem("libraryBooks")) || [];
      const currentBook = customBooks.find((b) => b.title === selectedTitle);

      if (currentBook) {
        const listItems = detailContainer.querySelectorAll("ul li");
        if (listItems.length >= 3) {
          listItems[0].querySelector("span").innerText =
            `[ ${currentBook.author} ]`;
          listItems[1].querySelector("span").innerText =
            `[ ${currentBook.genre} ]`;
          listItems[2].querySelector("span").innerText =
            `[ ${currentBook.stock} Copies ]`;
        }
      }
    }
  }
});
