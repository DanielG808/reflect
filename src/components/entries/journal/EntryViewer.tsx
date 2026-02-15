"use client";

import { motion, type Variants } from "framer-motion";
import { useLocalStorage } from "@/src/hooks/useLocalStorage";
import Surface from "@/src/components/ui/Surface";
import { SquarePenIcon, TrashIcon } from "lucide-react";
import { EntryDTO } from "@/src/lib/entries/types";
import EntryActions from "./EntryActions";

type EntryViewerProps = {
  entry: EntryDTO;
};

const DEFAULT_FONT = "ui-sans-serif, system-ui, sans-serif";

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.14,
    },
  },
};

const item: Variants = {
  hidden: {
    opacity: 0,
    y: -8,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function EntryViewer({ entry }: EntryViewerProps) {
  const [fontFamily] = useLocalStorage("editor:font-family", DEFAULT_FONT);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col flex-1 min-h-0"
    >
      <motion.div
        variants={item}
        className="flex flex-col flex-1 min-h-0 cursor-default"
      >
        <Surface className="group flex flex-1 min-h-75 overflow-hidden">
          <div
            className="flex-1 overflow-auto p-4 whitespace-pre-wrap"
            style={{ fontFamily }}
            dangerouslySetInnerHTML={{ __html: entry.content }}
          />
          <EntryActions />
        </Surface>
      </motion.div>
    </motion.div>
  );
}
