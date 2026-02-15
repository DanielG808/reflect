export function normalizeStoredHtml(html: string) {
  const trimmed = (html ?? "").trim();

  if (
    trimmed === "" ||
    trimmed === "<p></p>" ||
    trimmed === "<p>&nbsp;</p>" ||
    trimmed === "<p>\u00A0</p>"
  ) {
    return "";
  }

  return trimmed;
}
