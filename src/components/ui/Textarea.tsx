"use client";

import * as React from "react";
import { cn } from "@/src/lib/utils/cn";

export type TextareaProps =
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label?: string;
    hasError?: boolean;
  };

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, hasError, id, rows = 8, ...props }, ref) => {
    const generatedId = React.useId();
    const textareaId = id ?? generatedId;

    return (
      <div className="space-y-1">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium text-accent/80"
          >
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={cn(
            `
          w-full
          bg-white/40
          border
          px-3 py-2
          rounded-lg
          text-foreground
          placeholder:text-muted-foreground
          focus:outline-none
          disabled:opacity-50
          resize-y
          `,
            hasError
              ? "border-warn/50 ring-2 ring-warn/25"
              : "focus:border-accent focus:ring-2 focus:ring-accent/30",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
