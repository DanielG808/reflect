"use client";

import * as React from "react";
import { cn } from "@/src/lib/utils/cn";
import { useEntryStore } from "@/src/stores/entry-store";

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

export default function AutoSaveStatus({ className }: { className?: string }) {
  const saving = useEntryStore((s) => s.saving);
  const lastSavedAt = useEntryStore((s) => s.lastSavedAt);
  const error = useEntryStore((s) => s.error);
  const hasTyped = useEntryStore((s) => s.hasTyped);

  const [now, setNow] = React.useState<Date | null>(null);

  React.useEffect(() => {
    if (!hasTyped || saving || !lastSavedAt) return;

    setNow(new Date());

    const id = window.setInterval(() => {
      setNow(new Date());
    }, 30_000);

    return () => window.clearInterval(id);
  }, [hasTyped, saving, lastSavedAt]);

  const effectiveNow = now ?? lastSavedAt ?? new Date();

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
          <span>Saved · {formatSavedLabel(lastSavedAt, effectiveNow)}</span>
        </>
      ) : (
        <span className="opacity-60">Not saved</span>
      )}
    </div>
  );
}
