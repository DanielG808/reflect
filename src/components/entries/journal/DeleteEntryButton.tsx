"use client";

import {
  Dialog,
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
        <TrashIcon className="h-4 w-4 text-red-400/75 hover:text-red-500/75 duration-200 cursor-pointer" />
      </DialogTrigger>

      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription className=" ext-md pb-10 pt-2">
            This action cannot be undone. This will{" "}
            <span className="font-bold"> permanently delete </span>your journal
            entry and remove your data from our servers.
          </DialogDescription>
          <Button variant="warn">Delete Entry</Button>
          <Button variant="ghost">Cancel</Button>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
