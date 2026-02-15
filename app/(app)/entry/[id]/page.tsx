import MainContainer from "@/src/components/layout/MainContainer";
import H1 from "@/src/components/ui/H1";
import { requireUser } from "@/src/lib/auth/server";
import { prisma } from "@/src/server/db/prisma";
import { notFound } from "next/navigation";

export default async function EntryPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await requireUser();

  const entry = await prisma.entry.findFirst({
    where: { id: params.id, userId: user.id },
  });

  if (!entry) notFound();

  return (
    <MainContainer
      fullBleed
      className="h-full flex flex-col min-h-0 overflow-hidden"
    >
      <H1 className="text-lg">Journal Entry ✧ date:</H1>
    </MainContainer>
  );
}
