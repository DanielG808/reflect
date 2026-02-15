import { EntryDTO } from "@/src/lib/entries/types";
import Surface from "../../ui/Surface";
import { formatEntryDate } from "@/src/lib/utils/time";
import DeleteEntryButton from "./DeleteEntryButton";

type EntryCardProps = {
  username: string;
  entry: EntryDTO;
};

export default function EntryCard({ username, entry }: EntryCardProps) {
  const formattedDate = formatEntryDate(entry.createdAt);

  return (
    <li className="group">
      <Surface className="w-full h-22 px-3 py-2" hover>
        <div className="flex justify-between text-center">
          <h3 className="font-semibold">{`✧ ${username}'s entry · ${formattedDate}`}</h3>
          <DeleteEntryButton entryId={entry.id} />
        </div>
      </Surface>
    </li>
  );
}
