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

const validateAndNormalizeTags = (tags) => {
  if (tags === undefined) {
    return { value: [] };
  }

  if (!Array.isArray(tags)) {
    return { error: "tags must be an array of strings." };
  }

  const normalizedTags = [];

  for (const tag of tags) {
    if (typeof tag !== "string") {
      return { error: "tags must contain strings only." };
    }

    const normalizedTag = tag.trim().toLowerCase();
    if (normalizedTag) {
      normalizedTags.push(normalizedTag);
    }
  }

  const uniqueTags = [...new Set(normalizedTags)];

  if (uniqueTags.length > MAX_TAGS) {
    return { error: `tags can contain at most ${MAX_TAGS} items.` };
  }

  return { value: uniqueTags };
};

const validateBookmark = (req, res, next) => {
  const { url, title, description, tags } = req.body || {};
  const errors = [];

  if (typeof url !== "string" || !url.trim()) {
    errors.push("url is required.");
  } else if (!isValidHttpUrl(url.trim())) {
    errors.push("url must be a valid http or https URL.");
  }

  if (typeof title !== "string" || !title.trim()) {
    errors.push("title is required.");
  } else if (title.trim().length > MAX_TITLE_LENGTH) {
    errors.push(`title must be at most ${MAX_TITLE_LENGTH} characters.`);
  }

  if (description !== undefined && typeof description !== "string") {
    errors.push("description must be a string.");
  } else if (
    typeof description === "string" &&
    description.trim().length > MAX_DESCRIPTION_LENGTH
  ) {
    errors.push(
      `description must be at most ${MAX_DESCRIPTION_LENGTH} characters.`
    );
  }

  const tagsResult = validateAndNormalizeTags(tags);
  if (tagsResult.error) {
    errors.push(tagsResult.error);
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: "Validation failed.",
      details: errors
    });
  }

  req.validatedBookmark = {
    url: url.trim(),
    title: title.trim(),
    description: typeof description === "string" ? description.trim() : "",
    tags: tagsResult.value
  };

  return next();
};

module.exports = {
  validateBookmark
};
