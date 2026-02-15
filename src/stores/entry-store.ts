import { create } from "zustand";

import { EntryDTO } from "../lib/entries/types";
import { autosaveDraft, finalizeEntry } from "../lib/entries/server";

export type Payload = {
  content: string;
  fontFamily: string;
};

type EntryState = {
  saving: boolean;
  lastSavedAt: Date | null;
  error: string | null;

  finalSaving: boolean;
  finalError: string | null;
  finalSavedAt: Date | null;

  seq: number;
  hasTyped: boolean;
  entryId: string | null;
  entry: EntryDTO | null;

  markTyped: () => void;
  clearError: () => void;
  clearFinalError: () => void;
  setEntryId: (id: string | null) => void;

  newEntry: () => void;

  autosave: (payload: Payload) => Promise<void>;
  finalize: (content: string, fontFamily?: string) => Promise<void>;
};

export const useEntryStore = create<EntryState>((set, get) => ({
  saving: false,
  lastSavedAt: null,
  error: null,

  finalSaving: false,
  finalError: null,
  finalSavedAt: null,

  seq: 0,
  hasTyped: false,
  entryId: null,
  entry: null,

  markTyped: () => set({ hasTyped: true }),
  clearError: () => set({ error: null }),
  clearFinalError: () => set({ finalError: null }),
  setEntryId: (id) => set({ entryId: id }),

  newEntry: () => {
    const nextSeq = get().seq + 1;

    set({
      saving: false,
      lastSavedAt: null,
      error: null,

      finalSaving: false,
      finalError: null,
      finalSavedAt: null,

      seq: nextSeq,
      hasTyped: false,
      entryId: null,
      entry: null,
    });
  },

  autosave: async (payload) => {
    if (!get().hasTyped) return;

    const current = get().entry;
    if (current?.status === "FINAL") return;

    const nextSeq = get().seq + 1;

    set({
      saving: true,
      error: null,
      seq: nextSeq,
    });

    try {
      const res = await autosaveDraft({
        id: get().entryId ?? undefined,
        content: payload.content,
        fontFamily: payload.fontFamily,
      });

      if (get().seq !== nextSeq) return;

      if (!res.ok || !res.data) {
        set({ saving: false, error: res.ok ? "Autosave failed" : res.message });
        return;
      }

      const entry = res.data.entry;

      set({
        saving: false,
        lastSavedAt: new Date(entry.updatedAt),
        error: null,
        entryId: entry.id,
        entry,
      });
    } catch (e) {
      if (get().seq !== nextSeq) return;

      set({
        saving: false,
        error: e instanceof Error ? e.message : "Autosave failed",
      });
    }
  },

  finalize: async (content, fontFamily = "") => {
    const current = get().entry;
    if (current?.status === "FINAL") {
      set({ finalError: null });
      return;
    }

    const nextSeq = get().seq + 1;

    set({
      finalSaving: true,
      finalError: null,
      seq: nextSeq,
    });

    try {
      let id = get().entryId;

      if (!id) {
        const created = await autosaveDraft({
          id: undefined,
          content,
          fontFamily,
        });

        if (get().seq !== nextSeq) return;

        if (!created.ok || !created.data) {
          set({
            finalSaving: false,
            finalError: created.ok
              ? "Failed to create entry."
              : created.message,
          });
          return;
        }

        const createdEntry = created.data.entry;
        id = createdEntry.id;

        set({
          entryId: createdEntry.id,
          entry: createdEntry,
          hasTyped: true,
          lastSavedAt: new Date(createdEntry.updatedAt),
        });
      }

      const res = await finalizeEntry(id, content);

      if (get().seq !== nextSeq) return;

      if (!res.ok || !res.data) {
        set({
          finalSaving: false,
          finalError: res.ok ? "Failed to finalize entry." : res.message,
        });
        return;
      }

      const entry = res.data.entry;

      set({
        finalSaving: false,
        finalSavedAt: new Date(entry.updatedAt),
        finalError: null,
        saving: false,
        lastSavedAt: new Date(entry.updatedAt),
        error: null,
        entryId: entry.id,
        entry,
        hasTyped: true,
      });
    } catch (e) {
      if (get().seq !== nextSeq) return;

      set({
        finalSaving: false,
        finalError:
          e instanceof Error ? e.message : "Failed to finalize entry.",
      });
    }
  },
}));
