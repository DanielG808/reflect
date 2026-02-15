// src/components/editor/TextFormatSelector.tsx
"use client";

import * as React from "react";
import type { Editor } from "@tiptap/react";
import { BoldIcon, ItalicIcon, StrikethroughIcon } from "lucide-react";

import { cn } from "@/src/lib/utils/cn";
import { Button } from "../../ui/Button";

const formatOpts = [
  { id: "bold", icon: BoldIcon },
  { id: "italic", icon: ItalicIcon },
  { id: "strike", icon: StrikethroughIcon },
] as const;

type FormatKey = (typeof formatOpts)[number]["id"];

type Props = {
  editor: Editor | null;
};

export default function TextFormatSelector({ editor }: Props) {
  function isActive(key: FormatKey) {
    if (!editor) return false;
    if (key === "bold") return editor.isActive("bold");
    if (key === "italic") return editor.isActive("italic");
    if (key === "strike") return editor.isActive("strike");
    return false;
  }

  function toggle(key: FormatKey) {
    if (!editor) return;

    const chain = editor.chain().focus();
    if (key === "bold") chain.toggleBold().run();
    if (key === "italic") chain.toggleItalic().run();
    if (key === "strike") chain.toggleStrike().run();
  }

  // Re-render when selection/formatting changes so the pressed state stays correct
  const [, force] = React.useReducer((x) => x + 1, 0);
  React.useEffect(() => {
    if (!editor) return;

    const rerender = () => force();
    editor.on("selectionUpdate", rerender);
    editor.on("transaction", rerender);

    return () => {
      editor.off("selectionUpdate", rerender);
      editor.off("transaction", rerender);
    };
  }, [editor]);

  const disabled = !editor;

  return (
    <div role="group" className="inline-flex h-9">
      {formatOpts.map(({ id, icon: Icon }, i) => {
        const active = isActive(id);
        const isFirst = i === 0;
        const isLast = i === formatOpts.length - 1;

        return (
          <Button
            key={id}
            type="button"
            size="sm"
            variant="ghost"
            disabled={disabled}
            data-state={active ? "on" : "off"}
            aria-pressed={active}
            onClick={() => toggle(id)}
            className={cn(
              `
                h-9
                px-2
                bg-white/40
                flex items-center justify-center
                relative
                border
                border-input
              `,
              i !== 0 && "-ml-px",
              isFirst && "rounded-l-lg rounded-r-none",
              !isFirst && !isLast && "rounded-none",
              isLast && "rounded-r-lg rounded-l-none",
              "hover:z-10 focus-visible:z-20",
              active && "border-accent/60 z-10"
            )}
          >
            <Icon className="h-4 w-4" />
          </Button>
        );
      })}
    </div>
  );
}
