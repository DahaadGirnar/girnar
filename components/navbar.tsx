'use client';

import { AuthButton } from "@/components/auth-button";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isMobile;
}

export interface NavbarProps {
  user: { email: string, id: string } | null;
  profile: { full_name?: string } | null;
}

const MenuIcon = ({ open, onClick }: { open: boolean; onClick: () => void }) => (
  <button
    aria-label={open ? "Close menu" : "Open menu"}
    className="relative w-8 h-8 flex flex-col justify-center items-center z-50"
    onClick={onClick}
  >
    <motion.span
      animate={{
        rotate: open ? 45 : 0,
        y: open ? 6 : 0,
      }}
      className="block w-6 h-0.5 bg-foreground mb-1 rounded origin-center"
    />
    <motion.span
      animate={{ opacity: open ? 0 : 1 }}
      className="block w-6 h-0.5 bg-foreground mb-1 rounded origin-center"
    />
    <motion.span
      animate={{
        rotate: open ? -45 : 0,
        y: open ? -6 : 0,
      }}
      className="block w-6 h-0.5 bg-foreground rounded origin-center"
    />
  </button>
);

const MobileMenu = ({
  user,
  profile,
  menuOpen,
  onClick,
}: NavbarProps & { menuOpen: boolean; onClick: () => void }) => (
  <AnimatePresence>
    {menuOpen && (
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -40, opacity: 0 }}
        className="bg-background rounded-lg shadow-lg p-6 flex flex-col gap-4 min-w-[70vw] max-w-xs items-center fixed top-20 right-4 z-50"
        onClick={e => e.stopPropagation()}
      >
        <Button asChild variant="outline" size="sm" onClick={onClick}>
          <Link href="/protected/complaints">Complaints</Link>
        </Button>
        <Button asChild variant="outline" size="sm" onClick={onClick}>
          <Link href="/protected/guest-room">Guest Room</Link>
        </Button>
        <AuthButton user={user} profile={profile} />
      </motion.div>
    )}
  </AnimatePresence>
);

export default function Navbar({ user, profile }: NavbarProps) {
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full fixed top-0 left-0 z-50 flex justify-center border-b border-b-foreground/10 h-16 bg-transparent backdrop-blur-2xl">
      <div className="w-full flex justify-between items-center p-3 px-5 text-sm">
        <div className="flex gap-5 items-center font-semibold">
          <Link href={"/"}>Girnar</Link>
        </div>
        <div className="flex items-center gap-3">
          {!user && <AuthButton user={user} profile={profile} />}

          {(user && !isMobile) && (
            <>
              <Button asChild variant="outline" size="sm">
                <Link href="/protected/complaints">Complaints</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/protected/guest-room">Guest Room</Link>
              </Button>
              <AuthButton user={user} profile={profile} />
            </>
          )}

          {(user && isMobile) && (
            <>
              <MenuIcon open={menuOpen} onClick={() => setMenuOpen((prev) => !prev)} />
              <MobileMenu
                user={user}
                profile={profile}
                menuOpen={menuOpen}
                onClick={() => setMenuOpen(false)}
              />
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
