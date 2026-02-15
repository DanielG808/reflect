import { create } from "zustand";
import { autosaveDraft } from "../lib/entries/server";
import { EntryDTO } from "../lib/entries/types";

export type AutosavePayload = {
  content: string;
  fontFamily: string;
};

type EntryAutosaveState = {
  saving: boolean;
  lastSavedAt: Date | null;
  error: string | null;
  seq: number;
  hasTyped: boolean;
  entryId: string | null;
  entry: EntryDTO | null;
  markTyped: () => void;
  clearError: () => void;
  setEntryId: (id: string | null) => void;
  autosave: (payload: AutosavePayload) => Promise<void>;
};

export const useEntryAutosaveStore = create<EntryAutosaveState>((set, get) => ({
  saving: false,
  lastSavedAt: null,
  error: null,
  seq: 0,
  hasTyped: false,
  entryId: null,
  entry: null,

  markTyped: () => set({ hasTyped: true }),
  clearError: () => set({ error: null }),
  setEntryId: (id) => set({ entryId: id }),

  autosave: async (payload) => {
    if (!get().hasTyped) return;

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

      if (!res.ok) {
        set({
          saving: false,
          error: "Autosave failed",
        });
        return;
      }

      if (!res.data) {
        set({
          saving: false,
          error: "Autosave failed",
        });
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
}));
