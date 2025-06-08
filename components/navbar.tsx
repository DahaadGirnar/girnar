// import { EnvVarWarning } from "@/components/env-var-warning";
// import { hasEnvVars } from "@/lib/utils";
import { AuthButton } from "@/components/auth-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export interface NavbarProps {
  user: { email: string, id: string } | null;
  profile: { full_name?: string } | null;
}

export default function Navbar({ user, profile }: NavbarProps) {
  return (
    <nav className="w-full fixed top-0 left-0 z-50 flex justify-center border-b border-b-foreground/10 h-16 bg-transparent backdrop-blur-2xl">
      <div className="w-full flex justify-between items-center p-3 px-5 text-sm">
        <div className="flex gap-5 items-center font-semibold">
          <Link href={"/"}>Girnar</Link>
        </div>
        <div className="flex items-center gap-3">
          {user && (
            <>
              <Button asChild variant="outline" size="sm">
                <Link href="/protected/complaints">Complaints</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/protected/guest-room">Guest Room</Link>
              </Button>
            </>
          )}
          {/* {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />} */}
          <AuthButton user={user} profile={profile} />
        </div>
      </div>
    </nav>
  );
}
