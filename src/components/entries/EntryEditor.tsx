// src/components/entries/EntryEditor.tsx
"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { useLocalStorage } from "@/src/hooks/useLocalStorage";
import AutoSaveStatus from "./AutoSaveStatus";
import EditorControls from "./EditorControls";

const DEFAULT_FONT = "ui-sans-serif, system-ui, sans-serif";

export default function EntryEditor() {
  const [fontFamily, setFontFamily] = useLocalStorage(
    "editor:font-family",
    DEFAULT_FONT
  );

  const [content, setContent] = useLocalStorage<string>("editor:content", "");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: content || "",
    editorProps: {
      attributes: {
        class: "bg-white/45 w-full p-4 rounded-md min-h-[24rem] outline-none",
        style: `font-family:${fontFamily};`,
      },
    },
    onUpdate({ editor }) {
      setContent(editor.getHTML());
    },
  });

  // Keep fontFamily in sync with the editor root element
  useEffect(() => {
    if (!editor) return;
    (editor.view.dom as HTMLElement).style.fontFamily = fontFamily;
  }, [editor, fontFamily]);

  // Clear editor if content is cleared externally
  useEffect(() => {
    if (!editor) return;

    if (!content) {
      const html = editor.getHTML();
      if (html !== "" && html !== "<p></p>") {
        editor.commands.setContent("", { emitUpdate: false });
      }
    }
  }, [editor, content]);

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

      <EditorContent editor={editor} className="border rounded-md" />
    </>
  );
}
