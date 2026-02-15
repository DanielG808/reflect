"use server";

import { requireUser } from "@/src/lib/auth/server";
import type { AutosavePayload, EntryActionResult, EntryDTO } from "./types";
import { prisma } from "@/src/server/db/prisma";

function toEntryDTO(entry: {
  id: string;
  userId: string;
  content: string;
  status: "DRAFT" | "FINAL";
  version: number;
  createdAt: Date;
  updatedAt: Date;
}): EntryDTO {
  return {
    id: entry.id,
    userId: entry.userId,
    content: entry.content,
    status: entry.status,
    version: entry.version,
    createdAt: entry.createdAt.toISOString(),
    updatedAt: entry.updatedAt.toISOString(),
  };
}

export async function createEntry(
  content: string = ""
): Promise<EntryActionResult<{ entry: EntryDTO }>> {
  const user = await requireUser();

  try {
    const entry = await prisma.entry.create({
      data: {
        userId: user.id,
        content,
      },
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

    return { ok: true, data: { entry: toEntryDTO(entry) } };
  } catch {
    return { ok: false, message: "Failed to create entry." };
  }
}

export async function updateEntry(
  id: string,
  content: string
): Promise<EntryActionResult<{ entry: EntryDTO }>> {
  const user = await requireUser();

  if (!id) return { ok: false, message: "Missing entry id." };

  try {
    const updated = await prisma.entry.updateMany({
      where: { id, userId: user.id },
      data: { content },
    });

    if (updated.count === 0) {
      return { ok: false, message: "Entry not found." };
    }

    const entry = await prisma.entry.findFirst({
      where: { id, userId: user.id },
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

    if (!entry) return { ok: false, message: "Entry not found." };

    return { ok: true, data: { entry: toEntryDTO(entry) } };
  } catch {
    return { ok: false, message: "Failed to update entry." };
  }
}

export async function autosaveDraft(
  payload: AutosavePayload
): Promise<EntryActionResult<{ entry: EntryDTO }>> {
  if (payload.id) {
    return updateEntry(payload.id, payload.content);
  }

  return createEntry(payload.content);
}

export async function finalizeEntry(
  id: string,
  content: string
): Promise<EntryActionResult<{ entry: EntryDTO }>> {
  const user = await requireUser();

  if (!id) return { ok: false, message: "Missing entry id." };

  try {
    const updated = await prisma.entry.updateMany({
      where: { id, userId: user.id },
      data: {
        content,
        status: "FINAL",
        version: { increment: 1 },
      },
    });

    if (updated.count === 0) {
      return { ok: false, message: "Entry not found." };
    }

    const entry = await prisma.entry.findFirst({
      where: { id, userId: user.id },
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

    if (!entry) return { ok: false, message: "Entry not found." };

    return { ok: true, data: { entry: toEntryDTO(entry) } };
  } catch {
    return { ok: false, message: "Failed to finalize entry." };
  }
}
