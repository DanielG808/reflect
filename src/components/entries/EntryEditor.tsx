"use client";

import { EditorContent } from "@tiptap/react";

import { useLocalStorage } from "@/src/hooks/useLocalStorage";
import { useEntryEditor } from "@/src/hooks/useEntryEditor";
import { useDebounce } from "@/src/hooks/useDebounce";

import AutoSaveStatus from "./AutoSaveStatus";
import EditorControls from "./EditorControls";
import { Button } from "../ui/Button";
import { useEntryStore } from "@/src/stores/entry-store";
import { useEffect } from "react";

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

  const autosave = useEntryStore((s) => s.autosave);
  const markTyped = useEntryStore((s) => s.markTyped);
  const hasTyped = useEntryStore((s) => s.hasTyped);

  const finalize = useEntryStore((s) => s.finalize);
  const finalSaving = useEntryStore((s) => s.finalSaving);

  const newEntry = useEntryStore((s) => s.newEntry);
  const entry = useEntryStore((s) => s.entry);

  const debouncedAutosave = useDebounce(() => {
    autosave({ content, fontFamily });
  }, 800);

  useEffect(() => {
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

  useEffect(() => {
    if (!hasTyped) return;
    debouncedAutosave();
  }, [fontFamily, debouncedAutosave, hasTyped]);

  const isFinal = entry?.status === "FINAL";

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

      <Button
        className="mt-4"
        onClick={async () => {
          await finalize(content, fontFamily);
          const next = useEntryStore.getState().entry;
          if (next?.status !== "FINAL") return;
          newEntry();
          setContent("");
          editor?.commands.setContent("");
          editor?.commands.focus("start");
        }}
        disabled={finalSaving || isFinal}
      >
        {finalSaving ? "Saving..." : "Create New Entry"}
      </Button>

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
