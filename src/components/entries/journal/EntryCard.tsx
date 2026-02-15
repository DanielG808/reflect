import { EntryDTO } from "@/src/lib/entries/types";
import Surface from "../../ui/Surface";
import { formatEntryDate } from "@/src/lib/utils/time";
import { TrashIcon } from "lucide-react";

type EntryCardProps = {
  username: string;
  entry: EntryDTO;
};

export default function EntryCard({ username, entry }: EntryCardProps) {
  const formattedDate = formatEntryDate(entry.createdAt);

  return (
    <li>
      <Surface className="w-full h-22 px-3 py-2" hover>
        <div className="flex justify-between text-center">
          <h3 className="font-semibold">{`✧ ${username}'s entry · ${formattedDate}`}</h3>
          <TrashIcon className="h-4 w-4 text-red-400/75 hover:text-red-500/75 duration-200" />
        </div>
      </Surface>
    </li>
  );
}
