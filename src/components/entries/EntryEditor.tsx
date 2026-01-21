"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

import { useLocalStorage } from "@/src/hooks/useLocalStorage";
import AutoSaveStatus from "./AutoSaveStatus";
import EditorControls from "./EditorControls";

const DEFAULT_FONT = "ui-sans-serif, system-ui, sans-serif";
const PLACEHOLDER_TEXT = "What's on your mind?";

function normalizeStoredHtml(html: string) {
  const trimmed = (html ?? "").trim();
  if (
    trimmed === "" ||
    trimmed === "<p></p>" ||
    trimmed === "<p>&nbsp;</p>" ||
    trimmed === "<p>\u00A0</p>"
  ) {
    return "";
  }
  return trimmed;
}

export default function EntryEditor() {
  const [fontFamily, setFontFamily] = useLocalStorage(
    "editor:font-family",
    DEFAULT_FONT
  );

  const [content, setContent] = useLocalStorage<string>("editor:content", "");
  const normalizedContent = normalizeStoredHtml(content);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: PLACEHOLDER_TEXT,
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    content: normalizedContent,
    editorProps: {
      attributes: {
        class:
          "tiptap bg-white/45 w-full p-4 rounded-md min-h-[24rem] outline-none",
        style: `font-family:${fontFamily};`,
      },
    },
    onUpdate({ editor }) {
      setContent(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;

    editor.setOptions({
      editorProps: {
        attributes: {
          class:
            "tiptap bg-white/45 w-full p-4 rounded-md min-h-[24rem] outline-none",
          style: `font-family:${fontFamily};`,
        },
      },
    });
  }, [editor, fontFamily]);

  useEffect(() => {
    if (!editor) return;

    if (!normalizedContent) {
      const html = normalizeStoredHtml(editor.getHTML());
      if (html !== "") {
        editor.commands.setContent("", { emitUpdate: false });
      }
    }
  }, [editor, normalizedContent]);

  return (
    <>
      <div className="flex justify-between pb-2">
        <AutoSaveStatus />
        <EditorControls
          editor={editor}
          font={fontFamily}
          onFontChange={setFontFamily}
        />
      </div>

      <div className="border rounded-md">
        <EditorContent editor={editor} />
      </div>

      <style jsx global>{`
        .tiptap p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
          opacity: 0.6;
        }
      `}</style>
    </>
  );
}
