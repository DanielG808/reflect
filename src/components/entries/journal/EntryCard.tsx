import { EntryDTO } from "@/src/lib/entries/types";
import Surface from "../../ui/Surface";
import { formatEntryDate } from "@/src/lib/utils/time";

type EntryCardProps = {
  username: string;
  entry: EntryDTO;
};

export default function EntryCard({ username, entry }: EntryCardProps) {
  const formattedDate = formatEntryDate(entry.createdAt);

  return (
    <Surface className="w-full h-22 px-3 py-2" hover>
      <li>
        <h3>{`${username}'s Entry · ${formattedDate}`}</h3>
      </li>
    </Surface>
  );
}
