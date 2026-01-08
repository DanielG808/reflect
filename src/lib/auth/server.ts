import { User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "../supabase/server";
import { redirect } from "next/navigation";
import { AuthActionResult } from "./types";

export async function getUser(): Promise<User | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user ?? null;
}

export async function requireUser(): Promise<User> {
  const user = await getUser();
  if (!user) redirect("/login");
  return user;
}

export async function login(
  email: string,
  password: string
): Promise<AuthActionResult> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { ok: false, message: "Invalid email or password." };
  return { ok: true };
}

export async function signup(
  email: string,
  password: string
): Promise<AuthActionResult> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signUp({ email, password });

  if (error) return { ok: false, message: error.message };
  return { ok: true };
}

export async function logout(to: string = "/login"): Promise<never> {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect(to);
}
