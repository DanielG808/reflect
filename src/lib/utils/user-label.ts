import type { User } from "@supabase/supabase-js";

export function getUserLabel(user: User | null | undefined): string {
  if (!user) return "your account";

  const meta = user.user_metadata as Record<string, unknown> | undefined;

  const username =
    typeof meta?.username === "string" ? meta.username.trim() : "";

  const fullName =
    typeof meta?.full_name === "string" ? meta.full_name.trim() : "";

  const email = typeof user.email === "string" ? user.email.trim() : "";

  return username || fullName || email || "your account";
}
