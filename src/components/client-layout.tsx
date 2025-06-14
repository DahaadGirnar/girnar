'use client';

import { UserProvider } from "@/hooks/use-user";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      {children}
    </UserProvider>
  );
}
