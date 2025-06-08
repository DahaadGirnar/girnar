import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function AdminPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  // Fetch user profile from user_profiles table
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("full_name, phone, room_no, admin, entry_no")
    .eq("id", data.user.id)
    .single();

  if (!profile || !profile.admin) {
    redirect("/protected");
  }

  return (
    <div>
      <h2 className="font-bold text-2xl mb-4">
        Welcome {profile?.full_name || data.user.email}!
      </h2>
      <div className="flex w-full max-w-4xl mt-4 mx-auto gap-6">
        <Button asChild size="sm">
          <Link href="/protected/admin/manage">Manage Admins</Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/protected/admin/complaints">Manage Complaints</Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/protected/admin/announcements">Manage Announcements</Link>
        </Button>
      </div>
    </div>
  );
}
