import { getSavedEntries } from "@/src/lib/entries/server";
import { getMyUsername } from "@/src/lib/auth/server";
import EntriesListAnimated from "./EntriesListAnimated";

export default async function EntriesList() {
  const [res, username] = await Promise.all([
    getSavedEntries(),
    getMyUsername(),
  ]);

  if (!res.ok) {
    return (
      <ul className="flex flex-col items-stretch w-4/5 mx-auto pt-10">
        <li className="text-sm text-warn text-center">
          {res.message ?? "Failed to load entries."}
        </li>
      </ul>
    );
  }

  const entries = res.data?.entries ?? [];

  if (entries.length === 0) {
    return (
      <ul className="flex flex-col justify-center items-center w-4/5 mx-auto min-h-[calc(100vh-80px)]">
        <li className="text-sm text-center">
          No saved entries yet. Start journaling{" "}
          <a href="/new" className="underline hover:text-accent-dark">
            here...
          </a>
        </li>
      </ul>
    );
  }

  const safeUsername = username ?? "You";

  return <EntriesListAnimated username={safeUsername} entries={entries} />;
}
