import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import Divider from "@/components/ui/divider";
import Announcements from "@/components/announcements";
import { InfoIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function ProtectedPage() {
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

  const exists = !!profile;

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      {!exists && (
        <div className="w-full">
          <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
            <InfoIcon size="16" strokeWidth={2} />
            <div>
              Your profile is not complete. Complete your profile{" "}
              <Link href="/protected/profile" className="underline font-semibold">here</Link>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">
          Welcome {profile?.full_name || data.user.email}!
        </h2>
        {exists && (
          <>
            <div className="text-sm text-muted-foreground">
              <div>Entry No.: {profile?.entry_no || "N/A"}</div>
              <div>Room: {profile?.room_no || "N/A"}</div>
              <div>Phone: {profile?.phone || "N/A"}</div>
            </div>

            <div className="flex flex-row gap-4 mt-4">
              {!profile?.admin && (
                <>
                  <Link href="/protected/complaints">
                    <Button size="sm">Complaints</Button>
                  </Link>
                  <Link href="/protected/guest-room">
                    <Button size="sm">Guest Room</Button>
                  </Link>
                </>
              )}
              {profile?.admin && (
                <Link href="/protected/admin">
                  <Button size="sm">Admin Panel</Button>
                </Link>
              )}
            </div>
          </>
        )}
      </div>

      <Divider />
      {!exists && (<Announcements private={false} />)}
      {exists && (<Announcements private={true} />)}
    </div>
  );
}
