"use client"

import {
  Megaphone,
  AlertTriangle,
  BedDouble
} from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar"

import { useUser } from "@/hooks/use-user"
import { UserPageSection, UserPageSubsection } from "@/models/UserPageSections"
import { useUserPage } from "@/hooks/use-user-page"

export function NavAdminActions() {
  const { setSection, setSubsection } = useUserPage();
  const { user } = useUser();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Admin Actions</SidebarGroupLabel>
      <SidebarMenu>
        {user?.verified && (
          <>
            <SidebarMenuItem>
              <SidebarMenuButton asChild onClick={() => {
                setSection(UserPageSection.Announcements);
                setSubsection(UserPageSubsection.New);
              }}>
                <div className="flex items-center gap-2">
                  <Megaphone />
                  <span className="select-none">Make Announcement</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild onClick={() => {
                setSection(UserPageSection.Complaints);
                setSubsection(UserPageSubsection.Review);
              }}>
                <div className="flex items-center gap-2">
                  <AlertTriangle />
                  <span className="select-none">Review Complaints</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild onClick={() => {
                setSection(UserPageSection.GuestRoomBooking);
                setSubsection(null);
              }}>
                <div className="flex items-center gap-2">
                  <BedDouble />
                  <span className="select-none">Review Guest Room Booking</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </>
        )}
      </SidebarMenu>
    </SidebarGroup>
  )
}
