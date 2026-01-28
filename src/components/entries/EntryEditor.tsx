"use client";

import * as React from "react";
import { EditorContent } from "@tiptap/react";

import { useLocalStorage } from "@/src/hooks/useLocalStorage";
import { useEntryEditor } from "@/src/hooks/useEntryEditor";
import { useDebounce } from "@/src/hooks/useDebounce";
import { useEntryAutosaveStore } from "@/src/stores/entry-autosave-store";

import AutoSaveStatus from "./AutoSaveStatus";
import EditorControls from "./EditorControls";

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

  const autosave = useEntryAutosaveStore((s) => s.autosave);

  // Debounced autosave (content/font are captured from latest render)
  const debouncedAutosave = useDebounce(() => {
    autosave({ content, fontFamily });
  }, 800);

  // Trigger autosave when the editor updates (user types, deletes, etc.)
  React.useEffect(() => {
    if (!editor) return;

    const onUpdate = () => {
      debouncedAutosave();
    };

    editor.on("update", onUpdate);

    return () => {
      editor.off("update", onUpdate);
    };
  }, [editor, debouncedAutosave]);

  // OPTIONAL: autosave when font changes too (so formatting prefs persist)
  React.useEffect(() => {
    // If you don't want this, delete this effect.
    debouncedAutosave();
  }, [fontFamily, debouncedAutosave]);

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

      <style jsx global>{`
        .tiptap {
          height: 100%;
          overflow-y: auto;
        }

        .tiptap p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
          opacity: 0.6;
        }
      `}</style>
    </div>
  );
}
