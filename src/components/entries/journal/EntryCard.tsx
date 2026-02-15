import { EntryDTO } from "@/src/lib/entries/types";

type EntryCardProps = {
  entry: EntryDTO;
};

export default function EntryCard({ entry }: EntryCardProps) {
  return <div>EntryCard</div>;
}
