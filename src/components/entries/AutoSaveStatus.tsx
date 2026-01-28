"use client";

import * as React from "react";
import { cn } from "@/src/lib/utils/cn";
import { useEntryAutosaveStore } from "@/src/stores/entry-autosave-store";

/* ---------- helpers ---------- */

function minutesAgo(from: Date, to: Date) {
  const diffMs = to.getTime() - from.getTime();
  return Math.max(0, Math.floor(diffMs / 60_000));
}

function formatSavedLabel(lastSavedAt: Date, now: Date) {
  const mins = minutesAgo(lastSavedAt, now);

  if (mins === 0) return "just now";
  if (mins === 1) return "1m";
  return `${mins}m`;
}

/* ---------- icons ---------- */

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-4 w-4 animate-spin", className)}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        className="opacity-25"
      />
      <path
        fill="currentColor"
        className="opacity-75"
        d="M4 12a8 8 0 0 1 8-8v2.25A5.75 5.75 0 0 0 6.25 12H4z"
      />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-4 w-4", className)}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M16.667 5L7.5 14.167 3.333 10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ---------- component ---------- */

export default function AutoSaveStatus({ className }: { className?: string }) {
  const saving = useEntryAutosaveStore((s) => s.saving);
  const lastSavedAt = useEntryAutosaveStore((s) => s.lastSavedAt);
  const error = useEntryAutosaveStore((s) => s.error);

  // update timestamp label while idle
  const [now, setNow] = React.useState(() => new Date());

  React.useEffect(() => {
    if (saving || !lastSavedAt) return;

    const id = window.setInterval(() => {
      setNow(new Date());
    }, 30_000); // update twice a minute

    return () => window.clearInterval(id);
  }, [saving, lastSavedAt]);

  return (
    <div
      className={cn(
        "inline-flex items-center gap-x-2 text-sm leading-none select-none",
        className
      )}
      role="status"
      aria-live="polite"
    >
      {saving ? (
        <>
          <Spinner />
          <span>Saving…</span>
        </>
      ) : error ? (
        <span className="text-red-600">Save failed</span>
      ) : lastSavedAt ? (
        <>
          <CheckIcon />
          <span>Saved · {formatSavedLabel(lastSavedAt, now)}</span>
        </>
      ) : (
        <span className="opacity-60">Not saved</span>
      )}
    </div>
  );
}
