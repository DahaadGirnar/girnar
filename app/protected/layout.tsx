import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col items-center">

      {/* Fixed transparent navbar with blur */}
      <nav className="w-full fixed top-0 left-0 z-50 flex justify-center border-b border-b-foreground/10 h-16 bg-transparent backdrop-blur-2xl">
        <div className="w-full flex justify-between items-center p-3 px-5 text-sm">
          <div className="flex gap-5 items-center font-semibold">
            <Link href={"/"}>Girnar</Link>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Link href="/protected/complaints">Complaints</Link>
            </Button>
            <Button variant="outline" size="sm">
              <Link href="/protected/guest-room">Guest Room</Link>
            </Button>
            {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
          </div>
        </div>
      </nav>
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
