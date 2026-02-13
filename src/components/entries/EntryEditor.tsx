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
  const markTyped = useEntryAutosaveStore((s) => s.markTyped);
  const hasTyped = useEntryAutosaveStore((s) => s.hasTyped);

  const debouncedAutosave = useDebounce(() => {
    autosave({ content, fontFamily });
  }, 800);

  React.useEffect(() => {
    if (!editor) return;

    const onUpdate = () => {
      if (!hasTyped) markTyped();
      debouncedAutosave();
    };

    editor.on("update", onUpdate);

    return () => {
      editor.off("update", onUpdate);
    };
  }, [editor, debouncedAutosave, hasTyped, markTyped]);

  React.useEffect(() => {
    if (!hasTyped) return;
    debouncedAutosave();
  }, [fontFamily, debouncedAutosave, hasTyped]);

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
