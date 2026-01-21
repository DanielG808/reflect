"use server";

import { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { AuthActionResult } from "./types";
import {
  createSupabaseServerActionClient,
  createSupabaseServerComponentClient,
} from "../supabase/server";

export async function getUser(): Promise<User | null> {
  const supabase = await createSupabaseServerComponentClient();
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
  const supabase = await createSupabaseServerActionClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { ok: false, message: error.message };
  return { ok: true };
}

export async function signup(
  email: string,
  password: string
): Promise<AuthActionResult> {
  const supabase = await createSupabaseServerActionClient();
  const { error } = await supabase.auth.signUp({ email, password });

  if (error) return { ok: false, message: error.message };
  return { ok: true };
}

export async function logout(): Promise<AuthActionResult> {
  const supabase = await createSupabaseServerActionClient();
  const { error } = await supabase.auth.signOut();

  if (error) return { ok: false, message: error.message };
  return { ok: true };
}
