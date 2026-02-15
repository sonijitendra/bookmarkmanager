const { v4: uuidv4 } = require("uuid");
const seedBookmarks = require("./seedBookmarks");

let bookmarks = [...seedBookmarks];

const listBookmarks = (tag) => {
  if (!tag) {
    return bookmarks;
  }

  const normalizedTag = tag.trim().toLowerCase();
  return bookmarks.filter((bookmark) => bookmark.tags.includes(normalizedTag));
};

const createBookmark = (bookmarkInput) => {
  const bookmark = {
    id: uuidv4(),
    url: bookmarkInput.url,
    title: bookmarkInput.title,
    description: bookmarkInput.description,
    tags: bookmarkInput.tags,
    createdAt: new Date().toISOString()
  };

  bookmarks = [bookmark, ...bookmarks];
  return bookmark;
};

const updateBookmark = (id, bookmarkInput) => {
  const index = bookmarks.findIndex((bookmark) => bookmark.id === id);

  if (index === -1) {
    return null;
  }

  const existingBookmark = bookmarks[index];
  const updatedBookmark = {
    ...existingBookmark,
    url: bookmarkInput.url,
    title: bookmarkInput.title,
    description: bookmarkInput.description,
    tags: bookmarkInput.tags
  };

  bookmarks[index] = updatedBookmark;
  return updatedBookmark;
};

const deleteBookmark = (id) => {
  const index = bookmarks.findIndex((bookmark) => bookmark.id === id);

  if (index === -1) {
    return null;
  }

  const [deletedBookmark] = bookmarks.splice(index, 1);
  return deletedBookmark;
};

module.exports = {
  listBookmarks,
  createBookmark,
  updateBookmark,
  deleteBookmark
};
