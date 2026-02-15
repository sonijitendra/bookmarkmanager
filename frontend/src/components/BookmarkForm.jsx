import { useEffect, useMemo, useState } from "react";
import { validateBookmarkForm } from "../utils/bookmarkValidation";

const getInitialState = (initialValues) => ({
  url: initialValues?.url || "",
  title: initialValues?.title || "",
  description: initialValues?.description || "",
  tags: Array.isArray(initialValues?.tags) ? initialValues.tags.join(", ") : ""
});

const BookmarkForm = ({
  initialValues,
  onSubmit,
  submitText,
  onCancel,
  resetOnSuccess = false
}) => {
  const initialState = useMemo(() => getInitialState(initialValues), [initialValues]);
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setValues(initialState);
    setErrors({});
    setApiError("");
  }, [initialState]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setApiError("");

    const validation = validateBookmarkForm(values);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      await onSubmit(validation.payload);
      if (resetOnSuccess) {
        setValues(getInitialState({}));
      }
    } catch (error) {
      setApiError(error.message || "Unable to save bookmark.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="url">
          URL
        </label>
        <input
          id="url"
          name="url"
          type="url"
          value={values.url}
          onChange={handleChange}
          placeholder="https://example.com"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        />
        {errors.url ? <p className="mt-1 text-xs text-red-600">{errors.url}</p> : null}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="title">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={values.title}
          onChange={handleChange}
          maxLength={200}
          placeholder="Bookmark title"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        />
        {errors.title ? <p className="mt-1 text-xs text-red-600">{errors.title}</p> : null}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={values.description}
          onChange={handleChange}
          maxLength={500}
          rows={3}
          placeholder="Optional notes"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        />
        {errors.description ? (
          <p className="mt-1 text-xs text-red-600">{errors.description}</p>
        ) : null}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="tags">
          Tags (comma separated)
        </label>
        <input
          id="tags"
          name="tags"
          type="text"
          value={values.tags}
          onChange={handleChange}
          placeholder="docs, react, reference"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        />
        {errors.tags ? <p className="mt-1 text-xs text-red-600">{errors.tags}</p> : null}
      </div>

      {apiError ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {apiError}
        </div>
      ) : null}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Saving..." : submitText}
        </button>
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
};

export default BookmarkForm;
