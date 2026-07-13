import localforage from "localforage";

const STORE_KEY = "libraryBooks";

export async function getAllBooks() {
  const data = await localforage.getItem(STORE_KEY);
  return data || [];
}

export async function addBook(book) {
  const books = await getAllBooks();
  const newBook = { id: Date.now().toString(), ...book };
  const updated = [...books, newBook];
  await localforage.setItem(STORE_KEY, updated);
  return updated;
}

export async function removeBook(id) {
  const books = await getAllBooks();
  const updated = books.filter((b) => b.id !== id);
  await localforage.setItem(STORE_KEY, updated);
  return updated;
}
