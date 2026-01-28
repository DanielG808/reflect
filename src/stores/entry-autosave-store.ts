import { create } from "zustand";

export type AutosavePayload = {
  content: string;
  fontFamily: string;
};

type EntryAutosaveState = {
  saving: boolean;
  lastSavedAt: Date | null;
  error: string | null;
  seq: number;
  clearError: () => void;
  autosave: (payload: AutosavePayload) => Promise<void>;
};

async function autosaveToApi(_payload: AutosavePayload) {
  await new Promise((r) => setTimeout(r, 600));
}

export const useEntryAutosaveStore = create<EntryAutosaveState>((set, get) => ({
  saving: false,
  lastSavedAt: null,
  error: null,
  seq: 0,
  clearError: () => set({ error: null }),
  autosave: async (payload) => {
    const nextSeq = get().seq + 1;

    set({
      saving: true,
      error: null,
      seq: nextSeq,
    });

    try {
      await autosaveToApi(payload);

      if (get().seq !== nextSeq) return;

      set({
        saving: false,
        lastSavedAt: new Date(),
        error: null,
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
