import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function GET() {
  const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/is-admin`, { cache: "no-store" });
  if (res.status === 403) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  
  const adminClient = createAdminClient();
  const { data: userList, error: usersListError } = await adminClient.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (usersListError) {
    return NextResponse.json({ error: usersListError.message }, { status: 500 });
  }

  const users = userList?.users?.map((user) => ({
    id: user.id,
    email: user.email,
  })) ?? [];

  return NextResponse.json({ users });
}
