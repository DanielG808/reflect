"use client";

import * as React from "react";
import { Button } from "../ui/Button";
import { BoldIcon, ItalicIcon, StrikethroughIcon } from "lucide-react";
import { cn } from "@/src/lib/utils/cn";

const formatOpts = [
  { id: "bold", icon: BoldIcon },
  { id: "italic", icon: ItalicIcon },
  { id: "strike", icon: StrikethroughIcon },
] as const;

type FormatKey = (typeof formatOpts)[number]["id"];

export default function TextFormatSelector() {
  const [active, setActive] = React.useState<Record<FormatKey, boolean>>({
    bold: false,
    italic: false,
    strike: false,
  });

  function toggle(key: FormatKey) {
    setActive((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div role="group" className="inline-flex h-9">
      {formatOpts.map(({ id, icon: Icon }, i) => {
        const isActive = active[id];
        const isFirst = i === 0;
        const isLast = i === formatOpts.length - 1;

        return (
          <Button
            key={id}
            type="button"
            size="sm"
            variant="ghost"
            data-state={isActive ? "on" : "off"}
            aria-pressed={isActive}
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
              isActive && "border-accent/60 z-10"
            )}
          >
            <Icon className="h-4 w-4" />
          </Button>
        );
      })}
    </div>
  );
}
