"use client";

import { useLocalStorage } from "@/src/hooks/useLocalStorage";
import { Textarea } from "../ui/Textarea";
import AutoSaveStatus from "./AutoSaveStatus";
import EditorControls from "./EditorControls";

const DEFAULT_FONT = "ui-sans-serif, system-ui, sans-serif";

export default function EntryEditor() {
  const [fontFamily, setFontFamily] = useLocalStorage(
    "editor:font-family",
    DEFAULT_FONT
  );

  return (
    <>
      <div className="flex justify-between pb-2">
        <AutoSaveStatus />
        <EditorControls font={fontFamily} onFontChange={setFontFamily} />
      </div>
      <Textarea
        rows={16}
        defaultValue=""
        className="bg-white/45 w-full p-4 rounded-md"
        style={{ fontFamily }}
      />
    </>
  );
}
