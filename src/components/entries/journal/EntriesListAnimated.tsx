"use client";

import { motion, type Variants } from "framer-motion";
import EntryCard from "./EntryCard";
import { EntryDTO } from "@/src/lib/entries/types";

type Props = {
  username: string;
  entries: EntryDTO[];
};

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.18,
    },
  },
};

const item: Variants = {
  hidden: {
    opacity: 0,
    y: -10,
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

export default function EntriesListAnimated({ username, entries }: Props) {
  return (
    <motion.ul
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col items-stretch w-4/5 space-y-4 mx-auto pt-10"
    >
      {entries.map((entry) => (
        <motion.li key={entry.id} variants={item} className="group">
          <EntryCard username={username} entry={entry} />
        </motion.li>
      ))}
    </motion.ul>
  );
}
