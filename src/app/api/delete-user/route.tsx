import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function DELETE(request: NextRequest) {
    const baseUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/is-admin`, { cache: "no-store" });
    if (res.status === 403) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { userId } = await request.json();
    if (!userId) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const supabase = await createClient();
    const adminClient = createAdminClient();
    // Delete from user_profiles
    await supabase.from("user_profiles").delete().eq("id", userId);
    // Delete from auth.users (service role)
    await adminClient.auth.admin.deleteUser(userId as string);
    return NextResponse.json({ success: true }, { status: 200 });
}
