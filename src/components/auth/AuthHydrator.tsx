"use client";

import { useEffect } from "react";
import type { User } from "@supabase/supabase-js";
import { useAuthStore } from "@/src/stores/auth-store";

type AuthHydratorProps = {
  user: User;
};

export default function AuthHydrator({ user }: AuthHydratorProps) {
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    setUser(user);
  }, [user, setUser]);

  return null;
}
