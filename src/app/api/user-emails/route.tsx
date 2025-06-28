import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const adminParam = url.searchParams.get("admin");
  const id = url.searchParams.get("id");

  // If admin param is not provided, or is not "true", check for admin
  if (adminParam !== "true") {
    const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/is-admin`, { cache: "no-store" });
    if (res.status === 403) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const adminClient = createAdminClient();

  if (id) {
    const {
      data: { user },
      error,
    } = await adminClient.auth.admin.getUserById(id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ users: [{ id: user?.id, email: user?.email }] });
  }

  const { data: userList, error: usersListError } = await adminClient.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (usersListError) {
    return NextResponse.json({ error: usersListError.message }, { status: 500 });
  }

  // Only fetch admin user ids if admin param is provided
  let adminUserIds: string[] = [];
  if (adminParam === "true" || adminParam === "false") {
    const { data: roles, error: rolesError } = await adminClient
      .from("user_profiles")
      .select("id")
      .eq("admin", true);
    if (rolesError) {
      return NextResponse.json({ error: rolesError.message }, { status: 500 });
    }
    adminUserIds = roles?.map((r) => r.id) ?? [];
  }

  let users = userList?.users?.map((user) => ({
    id: user.id,
    email: user.email,
  })) ?? [];

  if (adminParam === "true") {
    users = users.filter((user) => adminUserIds.includes(user.id));
  } else if (adminParam === "false") {
    users = users.filter((user) => !adminUserIds.includes(user.id));
  }
  // If adminParam is not provided, return all users (already filtered above)

  return NextResponse.json({ users });
}
