"use server";

import type { AuthActionResult } from "./types";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";

export async function loginAction(
  email: string,
  password: string
): Promise<AuthActionResult> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { ok: false, message: "Invalid email or password." };
  return { ok: true };
}

export async function signupAction(
  email: string,
  password: string
): Promise<AuthActionResult> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signUp({ email, password });

  if (error) return { ok: false, message: error.message };
  return { ok: true };
}

export async function logoutAction(): Promise<AuthActionResult> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signOut();

  if (error) return { ok: false, message: error.message };
  return { ok: true };
}
