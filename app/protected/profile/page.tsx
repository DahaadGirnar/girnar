import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { ProfileCompletionForm } from "@/components/profile-completion-form";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  // Fetch user profile from user_profiles table
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("full_name, phone, room_no")
    .eq("id", data.user.id)
    .single();

  const exists = !!profile;

  return (
    <>
      {!exists && (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-sm">
            <ProfileCompletionForm />
          </div>
        </div>
      )}

      {exists && (
        <div>
          <h2 className="font-bold text-2xl mb-4">
            Welcome {profile?.full_name || data.user.email}!
          </h2>
        </div>
      )}
    </>
  );
}
