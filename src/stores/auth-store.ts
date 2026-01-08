"use client";

import type { User } from "@supabase/supabase-js";
import { create } from "zustand";
import { toast } from "sonner";

import type { AuthActionResult, AuthStatus } from "../lib/auth/types";
import { login, logout, signup } from "../lib/auth/server";
import { getUserLabel } from "@/src/lib/utils/user-label";

type PendingAuthToast = "login" | "signup" | null;

type AuthStore = {
  user: User | null;
  status: AuthStatus;
  error: string | null;

  // internal: used to show "Logged in as X" only after explicit auth actions
  pendingAuthToast: PendingAuthToast;

  setUser: (user: User | null) => void;
  clearError: () => void;

  login: (email: string, password: string) => Promise<AuthActionResult>;
  signup: (email: string, password: string) => Promise<AuthActionResult>;
  logout: () => Promise<AuthActionResult>;
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  status: "unknown",
  error: null,
  pendingAuthToast: null,

  setUser: (user) => {
    const pending = get().pendingAuthToast;

    set({ user, status: user ? "authed" : "unauth" });

    // Only toast when *we* initiated login/signup.
    if (user && pending) {
      const label = getUserLabel(user);
      toast.success(
        pending === "login"
          ? `Logged in as ${label}`
          : `Account created for ${label}`
      );

      set({ pendingAuthToast: null });
    }
  },

  clearError: () => set({ error: null }),

  login: async (email, password) => {
    set({ status: "loading", error: null, pendingAuthToast: "login" });

    const res = await login(email, password);

    if (!res.ok) {
      set({ status: "unauth", error: res.message, pendingAuthToast: null });
      toast.error(res.message);
      return res;
    }

    // Don’t toast success here; we’ll toast when setUser(user) runs.
    set({ status: "unknown", error: null });
    return res;
  },

  signup: async (email, password) => {
    set({ status: "loading", error: null, pendingAuthToast: "signup" });

    const res = await signup(email, password);

    if (!res.ok) {
      set({ status: "unauth", error: res.message, pendingAuthToast: null });
      toast.error(res.message);
      return res;
    }

    // Same idea: wait for setUser(user) to fire to show username/email.
    set({ status: "unknown", error: null });
    return res;
  },

  logout: async () => {
    set({ status: "loading", error: null, pendingAuthToast: null });

    // capture label before user gets cleared elsewhere
    const label = getUserLabel(get().user);

    const res = await logout();

    if (!res.ok) {
      set({ status: "authed", error: res.message });
      toast.error(res.message);
      return res;
    }

    set({ user: null, status: "unauth", error: null });
    toast.success(`Logged out ${label}`);
    return res;
  },
}));
