import { ThemeSwitcher } from "@/components/theme-switcher";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/navbar";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();

  // Fetch user profile from user_profiles table
  let profile = null;
  if (data.user) {
    const { data: fetchedProfile } = await supabase
      .from("user_profiles")
      .select("full_name, phone, room_no, admin, entry_no")
      .eq("id", data.user.id)
      .single();
    profile = fetchedProfile;
  }

  return (
    <main className="min-h-screen flex flex-col items-center">

      {/* Fixed transparent navbar with blur */}
      <Navbar
        user={
          data?.user && data.user.email && data.user.id
            ? { email: data.user.email, id: data.user.id }
            : null
        }
        profile={profile || null}
      />

      {/* Add margin-top equal to navbar height */}
      <div className="flex-1 w-full flex flex-col gap-20 items-center mt-16">
        {/* Make the inner container take full width up to max-w-5xl */}
        <div className="flex-1 flex flex-col gap-20 w-full max-w-5xl p-5">
          {children}
        </div>
        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
          <p>
            Powered by{" "}
            <a
              href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
            >
              Supabase
            </a>
          </p>
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
}
