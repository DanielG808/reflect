"use server";

import { requireUser } from "@/src/lib/auth/server";
import type { AutosavePayload, EntryActionResult, EntryDTO } from "./types";
import { prisma } from "@/src/server/db/prisma";
import {
  entryAutosaveSchema,
  entryFinalizeSchema,
} from "../validations/entries";

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

  const parsed = entryAutosaveSchema.safeParse({ content, fontFamily: "" });
  if (!parsed.success)
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Invalid entry.",
    };

  try {
    const entry = await prisma.entry.create({
      data: {
        userId: user.id,
        content: parsed.data.content,
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

  const parsed = entryAutosaveSchema.safeParse({ content, fontFamily: "" });
  if (!parsed.success)
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Invalid entry.",
    };

  try {
    const existing = await prisma.entry.findFirst({
      where: { id, userId: user.id },
      select: { id: true },
    });

    if (!existing) {
      return { ok: false, message: "Entry not found." };
    }

    const entry = await prisma.entry.update({
      where: { id },
      data: { content: parsed.data.content },
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
    return { ok: false, message: "Failed to update entry." };
  }
}

export async function autosaveDraft(
  payload: AutosavePayload
): Promise<EntryActionResult<{ entry: EntryDTO }>> {
  const parsed = entryAutosaveSchema.safeParse({
    content: payload.content,
    fontFamily: payload.fontFamily,
  });
  if (!parsed.success)
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Invalid entry.",
    };

  if (payload.id) {
    return updateEntry(payload.id, parsed.data.content);
  }

  return createEntry(parsed.data.content);
}

export async function finalizeEntry(
  id: string,
  content: string
): Promise<EntryActionResult<{ entry: EntryDTO }>> {
  const user = await requireUser();

  if (!id) return { ok: false, message: "Missing entry id." };

  const parsed = entryFinalizeSchema.safeParse({ content, fontFamily: "" });
  if (!parsed.success)
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Invalid entry.",
    };

  try {
    const existing = await prisma.entry.findFirst({
      where: { id, userId: user.id },
      select: { id: true },
    });

    if (!existing) {
      return { ok: false, message: "Entry not found." };
    }

    const entry = await prisma.entry.update({
      where: { id },
      data: {
        content: parsed.data.content,
        status: "FINAL",
        version: { increment: 1 },
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
    return { ok: false, message: "Failed to finalize entry." };
  }
}
