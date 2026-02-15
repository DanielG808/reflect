import { create } from "zustand";
import { toast } from "sonner";

import { EntryDTO } from "../lib/entries/types";
import { autosaveDraft, finalizeEntry } from "../lib/entries/server";
import { sleep } from "../lib/utils/sleep";
import {
  EntryAutosaveValues,
  entryAutosaveSchema,
  entryFinalizeSchema,
  entryDTOSchema,
} from "../lib/validations/entries";

export type Payload = EntryAutosaveValues;

type EntryState = {
  saving: boolean;
  lastSavedAt: Date | null;
  error: string | null;

  finalSaving: boolean;

  seq: number;
  hasTyped: boolean;
  entryId: string | null;
  entry: EntryDTO | null;

  markTyped: () => void;
  clearError: () => void;
  setEntryId: (id: string | null) => void;

  newEntry: () => void;

  autosave: (payload: Payload) => Promise<void>;
  finalize: (content: string, fontFamily?: string) => Promise<void>;
};

const FINALIZE_TOAST_ID = "entry-finalize";

export const useEntryStore = create<EntryState>((set, get) => ({
  saving: false,
  lastSavedAt: null,
  error: null,

  finalSaving: false,

  seq: 0,
  hasTyped: false,
  entryId: null,
  entry: null,

  markTyped: () => set({ hasTyped: true }),
  clearError: () => set({ error: null }),
  setEntryId: (id) => set({ entryId: id }),

  newEntry: () => {
    const nextSeq = get().seq + 1;

    toast.dismiss(FINALIZE_TOAST_ID);

    set({
      saving: false,
      lastSavedAt: null,
      error: null,

      finalSaving: false,

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

    const parsed = entryAutosaveSchema.safeParse(payload);
    if (!parsed.success) {
      set({
        saving: false,
        error: parsed.error.issues[0]?.message ?? "Invalid entry.",
      });
      return;
    }

    const nextSeq = get().seq + 1;

    set({
      saving: true,
      error: null,
      seq: nextSeq,
    });

    try {
      const res = await autosaveDraft({
        id: get().entryId ?? undefined,
        content: parsed.data.content,
        fontFamily: parsed.data.fontFamily,
      });

      if (get().seq !== nextSeq) return;

      if (!res.ok || !res.data) {
        set({ saving: false, error: res.ok ? "Autosave failed" : res.message });
        return;
      }

      const out = entryDTOSchema.safeParse(res.data.entry);
      if (!out.success) {
        set({ saving: false, error: "Invalid entry response." });
        return;
      }

      const entry = out.data;

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
    if (current?.status === "FINAL") return;

    const parsed = entryFinalizeSchema.safeParse({ content, fontFamily });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid entry.", {
        id: FINALIZE_TOAST_ID,
      });
      set({ finalSaving: false });
      return;
    }

    const nextSeq = get().seq + 1;

    set({
      finalSaving: true,
      seq: nextSeq,
    });

    toast.loading("Finalizing entry…", { id: FINALIZE_TOAST_ID });

    try {
      await sleep(1.5);

      let id = get().entryId;

      if (!id) {
        const created = await autosaveDraft({
          id: undefined,
          content: parsed.data.content,
          fontFamily: parsed.data.fontFamily,
        });

        if (get().seq !== nextSeq) return;

        if (!created.ok || !created.data) {
          toast.error(
            created.ok ? "Failed to create entry." : created.message,
            {
              id: FINALIZE_TOAST_ID,
            }
          );
          set({ finalSaving: false });
          return;
        }

        const createdOut = entryDTOSchema.safeParse(created.data.entry);
        if (!createdOut.success) {
          toast.error("Invalid entry response.", { id: FINALIZE_TOAST_ID });
          set({ finalSaving: false });
          return;
        }

        const createdEntry = createdOut.data;
        id = createdEntry.id;

        set({
          entryId: createdEntry.id,
          entry: createdEntry,
          hasTyped: true,
          lastSavedAt: new Date(createdEntry.updatedAt),
        });
      }

      const res = await finalizeEntry(id, parsed.data.content);

      if (get().seq !== nextSeq) return;

      if (!res.ok || !res.data) {
        toast.error(res.ok ? "Failed to finalize entry." : res.message, {
          id: FINALIZE_TOAST_ID,
        });
        set({ finalSaving: false });
        return;
      }

      const out = entryDTOSchema.safeParse(res.data.entry);
      if (!out.success) {
        toast.error("Invalid entry response.", { id: FINALIZE_TOAST_ID });
        set({ finalSaving: false });
        return;
      }

      const entry = out.data;

      set({
        finalSaving: false,
        saving: false,
        lastSavedAt: new Date(entry.updatedAt),
        error: null,
        entryId: entry.id,
        entry,
        hasTyped: true,
      });

      toast.success("Entry finalized.", { id: FINALIZE_TOAST_ID });
    } catch (e) {
      if (get().seq !== nextSeq) return;

      toast.error(
        e instanceof Error ? e.message : "Failed to finalize entry.",
        {
          id: FINALIZE_TOAST_ID,
        }
      );

      set({ finalSaving: false });
    }
  },
}));
