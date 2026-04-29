// Remove HTML
export function stripHtmlTags(value = "") {
  return String(value).replace(/<[^>]*>/g, "");
}

// Normalize unicode (bold, italic unicode → normal)
export function normalizeFancyUnicode(value = "") {
  return String(value).normalize("NFKD");
}

// Convert to Title Case
export function toTitleCase(value = "") {
  return value
    .toLowerCase()
    .split(" ")
    .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : ""))
    .join(" ");
}

// MAIN: normalize clean text (dùng cho title)
export function normalizeCleanText(value = "") {
  return toTitleCase(
    normalizeFancyUnicode(stripHtmlTags(value))
      .replace(/[^\p{L}\p{N}\s]/gu, "") // remove ký tự đặc biệt (!!! ### ...)
      .replace(/\s+/g, " ")
      .trim(),
  );
}

// Cho textarea (giữ xuống dòng)
export function normalizeTextareaText(value = "") {
  return normalizeFancyUnicode(stripHtmlTags(value))
    .replace(/[^\p{L}\p{N}\s\n.,!?]/gu, "") // giữ dấu cơ bản
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\s+/g, " ")
    .trim();
}
