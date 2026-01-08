"use client";

import * as React from "react";
import { cn } from "@/src/lib/utils/cn";

type H1Props = React.HTMLAttributes<HTMLHeadingElement> & {
  tone?: "accent" | "default" | "muted" | "warn";
};

const toneClasses: Record<NonNullable<H1Props["tone"]>, string> = {
  accent: "text-accent",
  default: "text-foreground",
  muted: "text-muted",
  warn: "text-warn",
};

export default function H1({
  className,
  tone = "accent",
  children,
  ...props
}: H1Props) {
  return (
    <h1
      className={cn(
        "text-2xl font-semibold tracking-tight",
        toneClasses[tone],
        className
      )}
      {...props}
    >
      {children}
    </h1>
  );
}
