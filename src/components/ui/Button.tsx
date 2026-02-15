"use client";

import * as React from "react";
import { cn } from "@/src/lib/utils/cn";

type ButtonVariant = "accent" | "ghost" | "warn";
type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const variantClasses: Record<ButtonVariant, string> = {
  accent: `
    bg-accent text-white/90
    border border-white/20
    hover:bg-accent-dark hover:border-white/25
    focus-visible:ring-accent/30

    data-[state=on]:bg-accent-dark
    data-[state=on]:border-white/25
  `,
  ghost: `
    bg-transparent text-accent
    border border-accent/35
    hover:bg-white/15 hover:border-accent/50
    focus-visible:ring-accent/25
    data-[state=on]:bg-border-dark/60
    data-[state=on]:border-accent/60
`,

  warn: `
    bg-warn/80 text-background
    border border-white/20
    hover:bg-warn hover:border-white/25
    focus-visible:ring-warn/25

    data-[state=on]:bg-warn
    data-[state=on]:border-white/25
  `,
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-base",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "accent", size = "md", type = "button", ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          `
          inline-flex items-center justify-center gap-2
          rounded-lg
          font-medium
          transition-all duration-200 cursor-pointer
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0
          disabled:pointer-events-none disabled:opacity-50
          `,
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
