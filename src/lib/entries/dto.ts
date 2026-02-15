import type { EntryDTO } from "./types";

export function toEntryDTO(entry: {
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
