"use client";

import * as React from "react";
import { cn } from "@/src/lib/utils/cn";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hasError?: boolean;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, hasError, id, ...props }, ref) => {
    const inputId = id ?? React.useId();

    return (
      <div className="space-y-1">
        <label htmlFor={inputId} className="text-sm font-medium text-accent/80">
          {label}
        </label>

        <input
          ref={ref}
          id={inputId}
          type={type}
          className={cn(
            `
            w-full
            bg-white/40
            border
            border-accent/60
            px-3 py-2
            rounded-lg
            text-foreground
            placeholder:text-muted
            focus:outline-none
            disabled:opacity-50
            `,
            hasError
              ? "border-warn/50 ring-2 ring-warn/25"
              : "focus:border-accent focus:ring-2 focus:ring-accent/30",
            className,
          )}
          {...props}
        />
      </div>
    );
  },
);

Input.displayName = "Input";
