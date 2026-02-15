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

type DeleteEntryButtonProps = {
  entryId: string;
};

export default function DeleteEntryButton({ entryId }: DeleteEntryButtonProps) {
  return (
    <Dialog>
      <DialogTrigger>
        {" "}
        <TrashIcon className="h-4 w-4 text-red-400/75 hover:text-red-500/75 duration-200 cursor-pointer" />
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
