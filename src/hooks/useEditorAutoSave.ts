"use client";

import { useEffect } from "react";
import type { Editor } from "@tiptap/react";
import type {
  UseFormGetValues,
  UseFormSetValue,
  UseFormTrigger,
} from "react-hook-form";

import { useDebounce } from "@/src/hooks/useDebounce";
import { useEntryStore } from "@/src/stores/entry-store";
import { EntryAutosaveValues } from "../lib/validations/entries";

export type UseEditorAutosaveArgs = {
  editor: Editor | null;
  fontFamily: string;
  setValue: UseFormSetValue<EntryAutosaveValues>;
  trigger: UseFormTrigger<EntryAutosaveValues>;
  getValues: UseFormGetValues<EntryAutosaveValues>;
};

export function useEditorAutosave({
  editor,
  fontFamily,
  setValue,
  trigger,
  getValues,
}: UseEditorAutosaveArgs) {
  const autosave = useEntryStore((s) => s.autosave);
  const markTyped = useEntryStore((s) => s.markTyped);
  const hasTyped = useEntryStore((s) => s.hasTyped);

  const debouncedAutosave = useDebounce(async () => {
    const ok = await trigger(["content", "fontFamily"]);
    if (!ok) return;

    const values = getValues();
    await autosave(values);
  }, 800);

  useEffect(() => {
    if (!editor) return;

    const onUpdate = () => {
      const html = editor.getHTML();
      setValue("content", html, { shouldValidate: true, shouldDirty: true });

      if (!hasTyped) markTyped();
      debouncedAutosave();
    };

    editor.on("update", onUpdate);

    return () => {
      editor.off("update", onUpdate);
    };
  }, [editor, debouncedAutosave, hasTyped, markTyped, setValue]);

  useEffect(() => {
    setValue("fontFamily", fontFamily, {
      shouldValidate: true,
      shouldDirty: true,
    });

    if (!hasTyped) return;
    debouncedAutosave();
  }, [fontFamily, debouncedAutosave, hasTyped, setValue]);
}
