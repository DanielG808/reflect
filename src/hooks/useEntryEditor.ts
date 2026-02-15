"use client";

import { useEffect } from "react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

import { normalizeStoredHtml } from "@/src/lib/editor/normalizeHtml";

type UseEntryEditorArgs = {
  content: string;
  setContent: (next: string) => void;
  fontFamily: string;
  placeholder?: string;
};

const BASE_CLASS =
  "tiptap bg-white/45 w-full p-4 rounded-md min-h-[24rem] outline-none";

export function useEntryEditor({
  content,
  setContent,
  fontFamily,
  placeholder = "What's on your mind?",
}: UseEntryEditorArgs) {
  const normalizedContent = normalizeStoredHtml(content);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    content: normalizedContent,
    editorProps: {
      attributes: {
        class: BASE_CLASS,
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
          class: BASE_CLASS,
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

  return { editor };
}
