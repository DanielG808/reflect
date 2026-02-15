import { EntryDTO } from "@/src/lib/entries/types";
import Surface from "../../ui/Surface";

type EntryCardProps = {
  entry: EntryDTO;
};

export default function EntryCard({ entry }: EntryCardProps) {
  return (
    <Surface className="w-full" hover>
      EntryCard
    </Surface>
  );
}
