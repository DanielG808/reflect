import EntryViewer from "@/src/components/entries/journal/EntryViewer";
import MainContainer from "@/src/components/layout/MainContainer";
import H1 from "@/src/components/ui/H1";
import { requireUser } from "@/src/lib/auth/server";
import { toEntryDTO } from "@/src/lib/entries/dto";

import { formatEntryDate } from "@/src/lib/utils/time";
import { prisma } from "@/src/server/db/prisma";
import { notFound } from "next/navigation";

export default async function EntryPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await requireUser();

  const row = await prisma.entry.findFirst({
    where: { id: params.id, userId: user.id },
    select: {
      id: true,
      userId: true,
      content: true,
      status: true,
      version: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!row) notFound();

  const entry = toEntryDTO(row);

  return (
    <MainContainer
      fullBleed
      className="h-full flex flex-col min-h-0 overflow-hidden"
    >
      <H1 className="text-lg pb-10">
        {user.email}&apos;s Journal Entry ✧ {formatEntryDate(entry.createdAt)}:
      </H1>

      <EntryViewer entry={entry} />
    </MainContainer>
  );
}
