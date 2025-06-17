import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data: session, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !session?.session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("admin")
    .eq("id", session.session?.user.id)
    .single();

  if (profileError || !profile?.admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({ isAdmin: true });
}
