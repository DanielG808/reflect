export function minutesAgo(from: Date, to: Date) {
  const diffMs = to.getTime() - from.getTime();
  return Math.max(0, Math.floor(diffMs / 60_000));
}

export function formatSavedLabel(lastSavedAt: Date, now: Date) {
  const mins = minutesAgo(lastSavedAt, now);
  if (mins === 0) return "just now";
  if (mins === 1) return "1m";
  return `${mins}m`;
}

export function formatEntryDate(iso: string, now: Date = new Date()) {
  const date = new Date(iso);

  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  const sameYear = now.getFullYear() === date.getFullYear();

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    ...(sameYear ? {} : { year: "numeric" }),
  });
}
