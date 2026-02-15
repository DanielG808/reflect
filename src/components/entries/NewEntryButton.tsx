"use client";

import type { Editor } from "@tiptap/react";
import { Button } from "../ui/Button";
import { useEntryStore } from "@/src/stores/entry-store";

type NewEntryButtonProps = {
  editor: Editor | null;
  content: string;
  fontFamily: string;
  setContent: (value: string) => void;
};

export default function NewEntryButton({
  editor,
  content,
  fontFamily,
  setContent,
}: NewEntryButtonProps) {
  const finalize = useEntryStore((s) => s.finalize);
  const finalSaving = useEntryStore((s) => s.finalSaving);
  const newEntry = useEntryStore((s) => s.newEntry);
  const entry = useEntryStore((s) => s.entry);

  const isFinal = entry?.status === "FINAL";

  return (
    <Button
      className="mt-4"
      disabled={finalSaving || isFinal}
      onClick={async () => {
        await finalize(content, fontFamily);

        const next = useEntryStore.getState().entry;
        if (next?.status !== "FINAL") return;

        newEntry();
        setContent("");
        editor?.commands.setContent("");
        editor?.commands.focus("start");
      }}
    >
      {finalSaving ? "Saving..." : "Create New Entry"}
    </Button>
  );
}
