"use client";

import { TrashIcon } from "lucide-react";

type DeleteEntryButtonProps = {
  entryId: string;
};

export default function DeleteEntryButton({ entryId }: DeleteEntryButtonProps) {
  return (
    <button>
      {" "}
      <TrashIcon className="h-4 w-4 text-red-400/75 hover:text-red-500/75 duration-200" />
    </button>
  );
}
