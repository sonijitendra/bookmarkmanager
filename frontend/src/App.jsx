import { useCallback, useEffect, useMemo, useState } from "react";
import BookmarkForm from "./components/BookmarkForm";
import BookmarkCard from "./components/BookmarkCard";
import EditBookmarkModal from "./components/EditBookmarkModal";
import api from "./services/api";
import { getApiErrorMessage } from "./utils/apiError";

function App() {
  const [bookmarks, setBookmarks] = useState([]);
  const [activeTag, setActiveTag] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageError, setPageError] = useState("");
  const [editingBookmark, setEditingBookmark] = useState(null);

  const fetchBookmarks = useCallback(async () => {
    setLoading(true);
    setPageError("");

    try {
      const response = await api.get("/bookmarks", {
        params: activeTag ? { tag: activeTag } : {}
      });
      setBookmarks(response.data);
    } catch (error) {
      setPageError(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [activeTag]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const filteredBookmarks = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) {
      return bookmarks;
    }

    return bookmarks.filter((bookmark) => {
      const searchable = `${bookmark.title} ${bookmark.url}`.toLowerCase();
      return searchable.includes(query);
    });
  }, [bookmarks, searchTerm]);

  const handleCreateBookmark = async (payload) => {
    try {
      await api.post("/bookmarks", payload);
      await fetchBookmarks();
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  };

  const handleUpdateBookmark = async (id, payload) => {
    try {
      await api.put(`/bookmarks/${id}`, payload);
      setEditingBookmark(null);
      await fetchBookmarks();
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  };

  const handleDeleteBookmark = async (id) => {
    const shouldDelete = window.confirm("Delete this bookmark?");
    if (!shouldDelete) {
      return;
    }

    setPageError("");

    try {
      await api.delete(`/bookmarks/${id}`);
      await fetchBookmarks();
    } catch (error) {
      setPageError(getApiErrorMessage(error));
    }
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Bookmark Manager</h1>
        <p className="mt-1 text-sm text-slate-600">
          Manage bookmarks with tag filters and real-time search.
        </p>
      </header>

      <section className="mb-8 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Add Bookmark</h2>
        <BookmarkForm onSubmit={handleCreateBookmark} submitText="Add Bookmark" resetOnSuccess />
      </section>

      <section className="mb-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:max-w-md">
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="search">
              Search by title or URL
            </label>
            <input
              id="search"
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Type to search..."
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {activeTag ? (
              <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white">
                Active tag: #{activeTag}
              </span>
            ) : (
              <span className="text-xs text-slate-500">No active tag filter</span>
            )}
            <button
              onClick={() => setActiveTag("")}
              disabled={!activeTag}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Clear Filter
            </button>
          </div>
        </div>
      </section>

      {pageError ? (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {pageError}
        </div>
      ) : null}

      {loading ? (
        <p className="text-sm text-slate-600">Loading bookmarks...</p>
      ) : filteredBookmarks.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          No bookmarks found.
        </div>
      ) : (
        <section className="grid gap-4">
          {filteredBookmarks.map((bookmark) => (
            <BookmarkCard
              key={bookmark.id}
              bookmark={bookmark}
              activeTag={activeTag}
              onTagClick={setActiveTag}
              onEdit={setEditingBookmark}
              onDelete={handleDeleteBookmark}
            />
          ))}
        </section>
      )}

      <EditBookmarkModal
        bookmark={editingBookmark}
        onClose={() => setEditingBookmark(null)}
        onSubmit={handleUpdateBookmark}
      />
    </main>
  );
}

export default App;
