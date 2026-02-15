"use client";

import { EditorContent } from "@tiptap/react";
import { useLocalStorage } from "@/src/hooks/useLocalStorage";
import { useEntryEditor } from "@/src/hooks/useEntryEditor";
import AutoSaveStatus from "./AutoSaveStatus";
import EditorControls from "./EditorControls";
import NewEntryButton from "./NewEntryButton";
import { useEditorAutosave } from "@/src/hooks/useEditorAutoSave";

const DEFAULT_FONT = "ui-sans-serif, system-ui, sans-serif";

export default function EntryEditor() {
  const [fontFamily, setFontFamily] = useLocalStorage(
    "editor:font-family",
    DEFAULT_FONT
  );
  const [content, setContent] = useLocalStorage<string>("editor:content", "");

  const { editor } = useEntryEditor({
    content,
    setContent,
    fontFamily,
    placeholder: "What's on your mind?",
  });

  useEditorAutosave({ editor, content, fontFamily });

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      <div className="flex justify-between pb-2 shrink-0">
        <AutoSaveStatus />
        <EditorControls
          editor={editor}
          font={fontFamily}
          onFontChange={setFontFamily}
        />
      </div>

      <div className="border rounded-md flex-1 min-h-0 overflow-hidden">
        <EditorContent editor={editor} className="h-full" />
      </div>

      <NewEntryButton
        editor={editor}
        content={content}
        fontFamily={fontFamily}
        setContent={setContent}
      />
    </div>
  );
}
