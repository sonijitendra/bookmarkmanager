import BookmarkForm from "./BookmarkForm";

const EditBookmarkModal = ({ bookmark, onClose, onSubmit }) => {
  if (!bookmark) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4">
      <div className="w-full max-w-xl rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Edit Bookmark</h2>
          <button
            onClick={onClose}
            className="rounded-md px-2 py-1 text-sm text-slate-600 hover:bg-slate-100"
          >
            Close
          </button>
        </div>

        <BookmarkForm
          initialValues={bookmark}
          onSubmit={(payload) => onSubmit(bookmark.id, payload)}
          submitText="Save Changes"
          onCancel={onClose}
        />
      </div>
    </div>
  );
};

export default EditBookmarkModal;
