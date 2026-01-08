import { Textarea } from "../ui/Textarea";
import EditorControls from "./EditorControls";

export default function EntryEditor() {
  return (
    <>
      <EditorControls />
      <Textarea
        rows={16}
        defaultValue=""
        className="bg-white/45 w-full p-4 rounded-md"
      />
    </>
  );
}
