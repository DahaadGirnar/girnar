"use client"

import {
  Megaphone,
  AlertTriangle,
  BedDouble
} from "lucide-react"

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { useUser } from "@/hooks/use-user"
import { UserPageSection } from "@/models/UserPageSections"
import { useUserPage } from "@/hooks/use-user-page"

export function NavUserActions() {
  const { setSection } = useUserPage();
  const { user } = useUser();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarMenu>
        {user?.verified && (
          <>
            <SidebarMenuItem>
              <SidebarMenuButton asChild onClick={() => setSection(UserPageSection.Announcements)}>
                <div className="flex items-center gap-2">
                  <Megaphone />
                  <span className="select-none">Announcements</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild onClick={() => setSection(UserPageSection.Complaints)}>
                <div className="flex items-center gap-2">
                  <AlertTriangle />
                  <span className="select-none">Complaints</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild onClick={() => setSection(UserPageSection.GuestRoomBooking)}>
                <div className="flex items-center gap-2">
                  <BedDouble />
                  <span className="select-none">Guest Room Booking</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </>
        )}
      </SidebarMenu>
    </SidebarGroup>
  )
}
