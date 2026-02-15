const MAX_TITLE_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 500;
const MAX_TAGS = 5;

const isValidHttpUrl = (value) => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch (_error) {
    return false;
  }
};

export const parseTagsFromInput = (rawTags) => {
  if (!rawTags || typeof rawTags !== "string") {
    return [];
  }

  const normalized = rawTags
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);

  return [...new Set(normalized)];
};

export const validateBookmarkForm = (values) => {
  const errors = {};

  const url = typeof values.url === "string" ? values.url.trim() : "";
  const title = typeof values.title === "string" ? values.title.trim() : "";
  const description =
    typeof values.description === "string" ? values.description.trim() : "";
  const tags = parseTagsFromInput(values.tags);

  if (!url) {
    errors.url = "URL is required.";
  } else if (!isValidHttpUrl(url)) {
    errors.url = "URL must be a valid http or https address.";
  }

  if (!title) {
    errors.title = "Title is required.";
  } else if (title.length > MAX_TITLE_LENGTH) {
    errors.title = `Title must be ${MAX_TITLE_LENGTH} characters or less.`;
  }

  if (description.length > MAX_DESCRIPTION_LENGTH) {
    errors.description = `Description must be ${MAX_DESCRIPTION_LENGTH} characters or less.`;
  }

  if (tags.length > MAX_TAGS) {
    errors.tags = `At most ${MAX_TAGS} tags are allowed.`;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    payload: {
      url,
      title,
      description,
      tags
    }
  };
};
