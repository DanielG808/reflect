export type EntryStatus = "DRAFT" | "FINAL";

export type EntryActionResult<T = undefined> =
  | { ok: true; data?: T }
  | { ok: false; message: string };

export type EntryStoreStatus = "idle" | "loading" | "error";

export type EntryDTO = {
  id: string;
  userId: string;
  content: string;
  status: EntryStatus;
  createdAt: string;
  updatedAt: string;
};

export type AutosavePayload = {
  id?: string | null;
  content: string;
  fontFamily: string;
};
