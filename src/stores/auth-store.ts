import { create } from "zustand";

type AuthState = {
  user: { id: string; email: string | null } | null;
  isHydrating: boolean;

  authError: string | null;
  authLoading: boolean;

  setUser: (user: AuthState["user"]) => void;
  clearAuthError: () => void;

  setAuthLoading: (v: boolean) => void;
  setAuthError: (msg: string | null) => void;

  hydrateFromMe: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isHydrating: true,

  authError: null,
  authLoading: false,

  setUser: (user) => set({ user }),
  clearAuthError: () => set({ authError: null }),

  setAuthLoading: (v) => set({ authLoading: v }),
  setAuthError: (msg) => set({ authError: msg }),

  hydrateFromMe: async () => {
    set({ isHydrating: true });
    try {
      const res = await fetch("/api/me", { cache: "no-store" });
      if (!res.ok) {
        set({ user: null });
        return;
      }
      const data = (await res.json()) as {
        user: { id: string; email: string | null } | null;
      };
      set({ user: data.user });
    } finally {
      set({ isHydrating: false });
    }
  },
}));
