"use client";

import { SquarePenIcon, TrashIcon } from "lucide-react";
import DeleteEntryButton from "./DeleteEntryButton";

type EntryActionsProps = {
  entryId: string;
};

export default function EntryActions({ entryId }: EntryActionsProps) {
  return (
    <div className="flex p-4 space-x-4 opacity-0 group-hover:opacity-100 duration-200">
      <SquarePenIcon className="h-5 w-5 hover:text-accent-dark cursor-pointer" />
      <DeleteEntryButton entryId={entryId} buttonClassName="h-5 w-5" />
    </div>
  );
}
