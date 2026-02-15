"use server";

import { requireUser } from "@/src/lib/auth/server";
import type { AutosavePayload, EntryActionResult, EntryDTO } from "./types";
import { prisma } from "@/src/server/db/prisma";
import { toEntryDTO } from "./dto";
import {
  entryAutosaveSchema,
  entryFinalizeSchema,
  entryDTOSchema,
  entryDTOListSchema,
} from "../validations/entries";

export async function createEntry(
  content: string = ""
): Promise<EntryActionResult<{ entry: EntryDTO }>> {
  const user = await requireUser();

  const parsed = entryAutosaveSchema.safeParse({ content, fontFamily: "" });
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Invalid entry.",
    };
  }

  try {
    const row = await prisma.entry.create({
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

    const entry = toEntryDTO(row);

    const out = entryDTOSchema.safeParse(entry);
    if (!out.success) {
      return { ok: false, message: "Invalid entry response." };
    }

    return { ok: true, data: { entry: out.data } };
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
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Invalid entry.",
    };
  }

  try {
    const existing = await prisma.entry.findFirst({
      where: { id, userId: user.id },
      select: { id: true },
    });

    if (!existing) {
      return { ok: false, message: "Entry not found." };
    }

    const row = await prisma.entry.update({
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

    const entry = toEntryDTO(row);

    const out = entryDTOSchema.safeParse(entry);
    if (!out.success) {
      return { ok: false, message: "Invalid entry response." };
    }

    return { ok: true, data: { entry: out.data } };
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

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Invalid entry.",
    };
  }

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
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Invalid entry.",
    };
  }

  try {
    const existing = await prisma.entry.findFirst({
      where: { id, userId: user.id },
      select: { id: true },
    });

    if (!existing) {
      return { ok: false, message: "Entry not found." };
    }

    const row = await prisma.entry.update({
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

    const entry = toEntryDTO(row);

    const out = entryDTOSchema.safeParse(entry);
    if (!out.success) {
      return { ok: false, message: "Invalid entry response." };
    }

    return { ok: true, data: { entry: out.data } };
  } catch {
    return { ok: false, message: "Failed to finalize entry." };
  }
}

export async function deleteEntry(
  id: string
): Promise<EntryActionResult<{ id: string }>> {
  const user = await requireUser();

  if (!id) return { ok: false, message: "Missing entry id." };

  try {
    const existing = await prisma.entry.findFirst({
      where: { id, userId: user.id },
      select: { id: true },
    });

    if (!existing) {
      return { ok: false, message: "Entry not found." };
    }

    await prisma.entry.delete({
      where: { id },
    });

    return { ok: true, data: { id } };
  } catch {
    return { ok: false, message: "Failed to delete entry." };
  }
}

export async function getSavedEntries(): Promise<
  EntryActionResult<{ entries: EntryDTO[] }>
> {
  const user = await requireUser();

  try {
    const rows = await prisma.entry.findMany({
      where: { userId: user.id, status: "FINAL" },
      orderBy: { updatedAt: "desc" },
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

    const entries = rows.map(toEntryDTO);

    const out = entryDTOListSchema.safeParse(entries);
    if (!out.success) {
      return { ok: false, message: "Invalid saved entries response." };
    }

    return { ok: true, data: { entries: out.data } };
  } catch {
    return { ok: false, message: "Failed to fetch saved entries." };
  }
}

export async function getDraftEntries(): Promise<
  EntryActionResult<{ entries: EntryDTO[] }>
> {
  const user = await requireUser();

  try {
    const rows = await prisma.entry.findMany({
      where: { userId: user.id, status: "DRAFT" },
      orderBy: { updatedAt: "desc" },
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

    const entries = rows.map(toEntryDTO);

    const out = entryDTOListSchema.safeParse(entries);
    if (!out.success) {
      return { ok: false, message: "Invalid draft entries response." };
    }

    return { ok: true, data: { entries: out.data } };
  } catch {
    return { ok: false, message: "Failed to fetch draft entries." };
  }
}
