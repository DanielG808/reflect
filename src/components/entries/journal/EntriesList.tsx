import { getSavedEntries } from "@/src/lib/entries/server";
import EntryCard from "./EntryCard";

export default async function EntriesList() {
  const res = await getSavedEntries();

  if (!res.ok) {
    return (
      <ul className="flex flex-col items-center w-1/3 pt-10">
        <li className="text-sm text-warn">
          {res.message ?? "Failed to load entries."}
        </li>
      </ul>
    );
  }

  const entries = res.data?.entries ?? [];

  if (entries.length === 0) {
    return (
      <ul className="flex flex-col items-center w-1/3 pt-10">
        <li className="text-sm text-muted">No saved entries yet.</li>
      </ul>
    );
  }

  return (
    <ul className="flex flex-col items-center w-1/3 pt-10">
      {entries.map((entry) => (
        <EntryCard key={entry.id} entry={entry} />
      ))}
    </ul>
  );
}
