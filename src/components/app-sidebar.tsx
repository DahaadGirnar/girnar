"use client"

import * as React from "react"

import { NavUserActions } from "@/components/nav-user-actions"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar"

import { useUser } from "@/hooks/use-user"
import { redirect } from "next/navigation"
import { useEffect } from "react"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavUserActions />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{
          name: user?.name || "User",
          email: user?.email || "m@example.com",
          avatar: "/images/user.png"
        }} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
