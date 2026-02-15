"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TrashIcon } from "lucide-react";
import { Button } from "../../ui/Button";

type DeleteEntryButtonProps = {
  entryId: string;
};

export default function DeleteEntryButton({ entryId }: DeleteEntryButtonProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <TrashIcon className="h-4 w-4 text-red-400/75 opacity-0 group-hover:opacity-100 hover:text-red-500/75 duration-200 cursor-pointer" />
      </DialogTrigger>

      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>

          <DialogDescription className="text-md pb-6 pt-2">
            This action cannot be undone. This will{" "}
            <span className="font-bold">permanently delete</span> your journal
            entry and remove your data from our servers.
          </DialogDescription>

          <div className="flex flex-col gap-2 pt-2">
            <Button variant="warn" className="w-full">
              Delete Entry
            </Button>

            <DialogClose asChild>
              <Button variant="ghost" className="w-full">
                Cancel
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
