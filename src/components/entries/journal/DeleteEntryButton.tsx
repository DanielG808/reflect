"use client";

import * as React from "react";
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
import { deleteEntry } from "@/src/lib/entries/server";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type DeleteEntryButtonProps = {
  entryId: string;
};

const DELETE_TOAST_ID = "entry-delete";

export default function DeleteEntryButton({ entryId }: DeleteEntryButtonProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  async function onDelete() {
    if (deleting) return;

    setDeleting(true);
    toast.loading("Deleting entry…", { id: DELETE_TOAST_ID });

    try {
      const res = await deleteEntry(entryId);

      if (!res.ok) {
        toast.error(res.message ?? "Failed to delete entry.", {
          id: DELETE_TOAST_ID,
        });
        setDeleting(false);
        return;
      }

      toast.success("Entry deleted.", { id: DELETE_TOAST_ID });
      setOpen(false);
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete entry.", {
        id: DELETE_TOAST_ID,
      });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <TrashIcon className="h-4 w-4 text-red-400/75 opacity-0 group-hover:opacity-100 hover:text-red-500/75 duration-200 cursor-pointer" />
      </DialogTrigger>

      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>

          <DialogDescription className="text-md pb-6 pt-2">
            This action cannot be undone. This will{" "}
            <span className="font-bold">permanently delete</span> your journal
            entry and remove your entry data from our servers.
          </DialogDescription>

          <div className="flex flex-col gap-2 pt-2">
            <Button
              variant="warn"
              className="w-full"
              onClick={onDelete}
              disabled={deleting}
            >
              Delete Entry
            </Button>

            <DialogClose asChild>
              <Button variant="ghost" className="w-full" disabled={deleting}>
                Cancel
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
