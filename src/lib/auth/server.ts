import { User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "../supabase/server";
import { redirect } from "next/navigation";

export async function getUser(): Promise<User | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user ?? null;
}

export async function requireUser(): Promise<User | null> {
  const user = await getUser();
  if (!user) redirect("login");
  return user;
}
