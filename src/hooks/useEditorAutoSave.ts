"use client";

import { useEffect } from "react";
import type { Editor } from "@tiptap/react";
import { useDebounce } from "@/src/hooks/useDebounce";
import { useEntryStore } from "@/src/stores/entry-store";

type UseEditorAutosaveArgs = {
  editor: Editor | null;
  content: string;
  fontFamily: string;
};

export function useEditorAutosave({
  editor,
  content,
  fontFamily,
}: UseEditorAutosaveArgs) {
  const autosave = useEntryStore((s) => s.autosave);
  const markTyped = useEntryStore((s) => s.markTyped);
  const hasTyped = useEntryStore((s) => s.hasTyped);

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
}
