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

function emailToName(email: string | null | undefined): string | null {
  if (!email) return null;
  const left = email.split("@")[0];
  if (!left) return null;
  return left.replace(/[._-]+/g, " ").trim() || null;
}

function userMetaName(user: User): string | null {
  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const v =
    (typeof meta.username === "string" && meta.username.trim()) ||
    (typeof meta.name === "string" && meta.name.trim()) ||
    (typeof meta.full_name === "string" && meta.full_name.trim()) ||
    null;
  return v;
}

export async function getUsernameById(userId: string): Promise<string | null> {
  const supabase = await createSupabaseServerComponentClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("username, display_name")
    .eq("id", userId)
    .maybeSingle();

  if (error) return null;

  const name =
    (data?.display_name?.trim() || data?.username?.trim() || "")?.trim() ||
    null;

  return name;
}

export async function getMyUsername(): Promise<string | null> {
  const user = await getUser();
  if (!user) return null;

  const fromProfiles = await getUsernameById(user.id);
  if (fromProfiles) return fromProfiles;

  const fromMeta = userMetaName(user);
  if (fromMeta) return fromMeta;

  return emailToName(user.email);
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
