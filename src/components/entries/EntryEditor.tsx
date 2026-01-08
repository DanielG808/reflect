import { Textarea } from "../ui/Textarea";

export default function EntryEditor() {
  return (
    <Textarea
      rows={16}
      defaultValue=""
      className="bg-white/45 w-full p-4 rounded-md"
    />
  );
}
