'use client';

import { UserProvider } from "@/hooks/use-user";
import { ThemeProvider } from "@/hooks/use-theme";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </UserProvider>
  );
}
