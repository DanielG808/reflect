import { Textarea } from "../ui/Textarea";
import AutoSaveStatus from "./AutoSaveStatus";
import EditorControls from "./EditorControls";

export default function EntryEditor() {
  return (
    <>
      <div className="flex justify-between pb-2">
        <AutoSaveStatus />
        <EditorControls />
      </div>
      <Textarea
        rows={16}
        defaultValue=""
        className="bg-white/45 w-full p-4 rounded-md"
      />
    </>
  );
}
