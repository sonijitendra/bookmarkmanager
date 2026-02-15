const formatDate = (value) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleString();
};

const getDescriptionSnippet = (description) => {
  if (!description) {
    return "No description.";
  }

  if (description.length <= 140) {
    return description;
  }

  return `${description.slice(0, 140)}...`;
};

const BookmarkCard = ({ bookmark, activeTag, onTagClick, onEdit, onDelete }) => {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-semibold text-slate-900">{bookmark.title}</h3>
          <a
            href={bookmark.url}
            target="_blank"
            rel="noreferrer"
            className="mt-1 block truncate text-sm text-blue-700 hover:text-blue-900 hover:underline"
          >
            {bookmark.url}
          </a>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(bookmark)}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(bookmark.id)}
            className="rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>

      <p className="mt-3 text-sm text-slate-700">{getDescriptionSnippet(bookmark.description)}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {bookmark.tags.length === 0 ? (
          <span className="text-xs text-slate-500">No tags</span>
        ) : (
          bookmark.tags.map((tag) => (
            <button
              key={`${bookmark.id}-${tag}`}
              onClick={() => onTagClick(tag)}
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                tag === activeTag
                  ? "bg-slate-900 text-white"
                  : "bg-slate-200 text-slate-700 hover:bg-slate-300"
              }`}
            >
              #{tag}
            </button>
          ))
        )}
      </div>

      <p className="mt-3 text-xs text-slate-500">Created: {formatDate(bookmark.createdAt)}</p>
    </article>
  );
};

export default BookmarkCard;
