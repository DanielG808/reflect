import { EntryDTO } from "@/src/lib/entries/types";
import Surface from "../../ui/Surface";

type EntryCardProps = {
  entry: EntryDTO;
};

export default function EntryCard({ entry }: EntryCardProps) {
  return (
    <Surface className="w-full h-22 px-3 py-2" hover>
      <li>
        <h3>{`${entry.userId}'s Entry - ${entry.createdAt}`}</h3>
      </li>
    </Surface>
  );
}
