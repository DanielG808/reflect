import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  const user = data.user
    ? { id: data.user.id, email: data.user.email ?? null }
    : null;

  return NextResponse.json({ user });
}
