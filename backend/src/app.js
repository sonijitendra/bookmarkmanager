const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const {
  listBookmarks,
  createBookmark,
  updateBookmark,
  deleteBookmark
} = require("./data/store");
const { validateBookmark } = require("./middleware/validateBookmark");

const app = express();

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many requests. Please try again later."
  }
});

app.use(cors());
app.use(express.json());
app.use(limiter);

const router = express.Router();

router.get("/health", (_req, res) => {
  res.json({ ok: true });
});

router.get("/bookmarks", (req, res) => {
  const tag =
    typeof req.query.tag === "string" && req.query.tag.trim()
      ? req.query.tag.trim()
      : undefined;

  const bookmarks = listBookmarks(tag);
  res.json(bookmarks);
});

router.post("/bookmarks", validateBookmark, (req, res) => {
  const createdBookmark = createBookmark(req.validatedBookmark);
  res.status(201).json(createdBookmark);
});

router.put("/bookmarks/:id", validateBookmark, (req, res) => {
  const updatedBookmark = updateBookmark(req.params.id, req.validatedBookmark);

  if (!updatedBookmark) {
    return res.status(404).json({
      error: "Bookmark not found."
    });
  }

  return res.json(updatedBookmark);
});

router.delete("/bookmarks/:id", (req, res) => {
  const deletedBookmark = deleteBookmark(req.params.id);

  if (!deletedBookmark) {
    return res.status(404).json({
      error: "Bookmark not found."
    });
  }

  return res.json({
    message: "Bookmark deleted successfully."
  });
});

app.use(router);
app.use("/api", router);

app.use((_req, res) => {
  res.status(404).json({
    error: "Route not found."
  });
});

app.use((error, _req, res, _next) => {
  if (error && error.type === "entity.parse.failed") {
    return res.status(400).json({
      error: "Invalid JSON payload."
    });
  }

  // eslint-disable-next-line no-console
  console.error(error);

  return res.status(500).json({
    error: "Internal server error."
  });
});

module.exports = app;
