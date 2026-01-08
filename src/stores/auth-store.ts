import { User } from "@supabase/supabase-js";
import { AuthActionResult, AuthStatus } from "../lib/auth/types";
import { create } from "zustand";
import { login, logout, signup } from "../lib/auth/server";

type AuthStore = {
  user: User | null;
  status: AuthStatus;
  error: string | null;
  setUser: (user: User | null) => void;
  clearError: () => void;
  login: (email: string, password: string) => Promise<AuthActionResult>;
  signup: (email: string, password: string) => Promise<AuthActionResult>;
  logout: () => Promise<AuthActionResult>;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  status: "unknown",
  error: null,

  setUser: (user) => set({ user, status: user ? "authed" : "unauth" }),
  clearError: () => set({ error: null }),

  login: async (email, password) => {
    set({ status: "loading", error: null });

    const res = await login(email, password);

    if (!res.ok) {
      set({ status: "unauth", error: res.message });
      return res;
    }

    set({ status: "unknown", error: null });
    return res;
  },

  signup: async (email, password) => {
    set({ status: "loading", error: null });

    const res = await signup(email, password);

    if (!res.ok) {
      set({ status: "unauth", error: res.message });
      return res;
    }

    set({ status: "unknown", error: null });
    return res;
  },

  logout: async () => {
    set({ status: "loading", error: null });

    const res = await logout();

    if (!res.ok) {
      set({ status: "authed", error: res.message });
      return res;
    }

    set({ user: null, status: "unauth", error: null });
    return res;
  },
}));
