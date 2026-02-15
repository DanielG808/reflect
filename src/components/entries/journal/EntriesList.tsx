import { getSavedEntries } from "@/src/lib/entries/server";
import EntryCard from "./EntryCard";
import { getMyUsername } from "@/src/lib/auth/server";

export default async function EntriesList() {
  const [res, username] = await Promise.all([
    getSavedEntries(),
    getMyUsername(),
  ]);

  if (!res.ok) {
    return (
      <ul className="flex flex-col items-stretch w-3/4 mx-auto pt-10">
        <li className="text-sm text-warn text-center">
          {res.message ?? "Failed to load entries."}
        </li>
      </ul>
    );
  }

  const entries = res.data?.entries ?? [];

  if (entries.length === 0) {
    return (
      <ul className="flex flex-col items-stretch w-3/4 mx-auto pt-10">
        <li className="text-sm text-muted text-center">
          No saved entries yet.
        </li>
      </ul>
    );
  }

  const safeUsername = username ?? "You";

  return (
    <ul className="flex flex-col items-stretch w-3/4 space-y-4 mx-auto pt-10">
      {entries.map((entry) => (
        <EntryCard key={entry.id} username={safeUsername} entry={entry} />
      ))}
    </ul>
  );
}
