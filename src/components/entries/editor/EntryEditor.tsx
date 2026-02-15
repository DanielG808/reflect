"use client";

import { useEffect } from "react";
import { EditorContent } from "@tiptap/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Form from "@/src/components/forms/Form";
import { useLocalStorage } from "@/src/hooks/useLocalStorage";
import { useEntryEditor } from "@/src/hooks/useEntryEditor";
import AutoSaveStatus from "./AutoSaveStatus";
import EditorControls from "./EditorControls";
import NewEntryButton from "./NewEntryButton";
import { useEditorAutosave } from "@/src/hooks/useEditorAutoSave";
import {
  EntryAutosaveValues,
  entryAutosaveSchema,
} from "@/src/lib/validations/entries";

const DEFAULT_FONT = "ui-sans-serif, system-ui, sans-serif";

export default function EntryEditor() {
  const [fontFamily, setFontFamily] = useLocalStorage(
    "editor:font-family",
    DEFAULT_FONT
  );
  const [content, setContent] = useLocalStorage<string>("editor:content", "");

  const form = useForm<EntryAutosaveValues>({
    resolver: zodResolver(entryAutosaveSchema),
    mode: "onChange",
    defaultValues: { content, fontFamily },
  });

  useEffect(() => {
    form.setValue("content", content, { shouldValidate: true });
  }, [content, form]);

  useEffect(() => {
    form.setValue("fontFamily", fontFamily, { shouldValidate: true });
  }, [fontFamily, form]);

  const { editor } = useEntryEditor({
    content,
    setContent,
    fontFamily,
    placeholder: "What's on your mind?",
  });

  useEditorAutosave({
    editor,
    fontFamily,
    setValue: form.setValue,
    trigger: form.trigger,
    getValues: form.getValues,
  });

  return (
    <Form
      form={form}
      onSubmit={() => {}}
      className="flex flex-col flex-1 min-h-0 overflow-hidden"
    >
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
    </Form>
  );
}
