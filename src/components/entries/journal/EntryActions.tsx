import { SquarePenIcon, TrashIcon } from "lucide-react";

export default function EntryActions() {
  return (
    <div className="flex p-4 space-x-4 opacity-0 group-hover:opacity-100 duration-200">
      <SquarePenIcon className="h-5 w-5 hover:text-accent-dark cursor-pointer" />
      <TrashIcon className="h-5 w-5 text-red-400/75 hover:text-red-500/75 cursor-pointer" />
    </div>
  );
}
