import { EntryDTO } from "@/src/lib/entries/types";
import Surface from "../../ui/Surface";
import { formatEntryDate } from "@/src/lib/utils/time";
import DeleteEntryButton from "./DeleteEntryButton";
import Link from "next/link";

type EntryCardProps = {
  username: string;
  entry: EntryDTO;
};

export default function EntryCard({ username, entry }: EntryCardProps) {
  const formattedDate = formatEntryDate(entry.createdAt);

  return (
    <Link href={`/entry/${entry.id}`}>
      <Surface className="group w-full h-22 px-3 py-2" hover>
        <div className="flex justify-between text-center">
          <h3 className="font-semibold">{`✧ ${username}'s entry · ${formattedDate}`}</h3>
          <DeleteEntryButton entryId={entry.id} />
        </div>
      </Surface>
    </Link>
  );
}
