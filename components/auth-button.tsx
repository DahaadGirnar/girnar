import Link from "next/link";
import { Button } from "./ui/button";
import { LogoutButton } from "./logout-button";

export interface AuthButtonProps {
  user: { email: string, id: string } | null;
  profile: { full_name?: string } | null;
}

export async function AuthButton({ user, profile }: AuthButtonProps) {
  return user ? (
    <div className="flex items-center gap-4">
      <Button asChild size="sm" variant={"outline"}>
        <Link href='/protected/profile'>
          Hey, {profile?.full_name || user.email}!
        </Link>
      </Button>
      <LogoutButton />
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
