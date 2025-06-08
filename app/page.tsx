import { createClient } from "@/lib/supabase/server";
import { Hero } from "@/components/hero";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Divider from "@/components/ui/divider";
import Announcements from "@/components/announcements";
import Navbar from "@/components/navbar";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();
  if (data?.user) {
    redirect("/protected");
  }

  return (
    <main className="min-h-screen flex flex-col items-center">
      {/* Fixed navbar */}
      <Navbar user={null} profile={null} />
      {/* Add margin-top equal to navbar height */}
      <div className="flex-1 w-full flex flex-col gap-20 items-center mt-16">
        <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">
          <Hero />
          <Divider />
          <main className="flex-1 flex flex-col gap-6 px-4">
            <div className="text-center">
              Paragraph content goes here. This is a sample text to demonstrate the layout of the page.
              You can replace this with your own content.
            </div>
            <Divider />
            <Announcements private={false} />
          </main>
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
