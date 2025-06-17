'use client';

import { useEffect } from 'react';
import { useUser } from "@/hooks/use-user"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import UserPageBreadcrumb from '@/components/user/user-page-breadcrumb';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { UserPageProvider } from '@/hooks/use-user-page';
import { redirect } from 'next/navigation';

import UserWidgetManager from '@/components/user/widget-manager';

export default function Page() {
  const { user, updateUser, loading } = useUser();

  useEffect(() => {
    if (!user) {
      updateUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!user && !loading) {
    redirect('/auth/login');
  }

  return (
    <UserPageProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <UserPageBreadcrumb />
            </div>
            <div className="ml-auto flex items-center gap-2 pr-4">
              <div className="hidden md:block">
                <span className="text-sm text-muted-foreground">{user?.full_name ?? user?.email}</span>
              </div>
              <ThemeSwitcher />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <UserWidgetManager />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </UserPageProvider>
  );
}

