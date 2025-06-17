'use client';

import { useEffect, useState, ReactNode } from "react";
import { UserProvider } from "@/hooks/use-user";
import { ThemeProvider } from "next-themes";

export default function ClientLayout({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent rendering until after hydration to avoid mismatch
  if (!mounted) return null;

  return (
    <UserProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </UserProvider>
  );
}
