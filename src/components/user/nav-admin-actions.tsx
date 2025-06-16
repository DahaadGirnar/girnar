"use client"

import {
  Megaphone,
  AlertTriangle,
  BedDouble,
  ChevronRight
} from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton
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

            <Collapsible
              asChild
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton>
                    <BedDouble />
                    <span>User Management</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <span
                          className="select-none"
                          onClick={() => {
                            setSection(UserPageSection.UserManagement);
                            setSubsection(UserPageSubsection.Existing);
                          }}
                        >
                          Existing
                        </span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>

                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <span
                          className="select-none"
                          onClick={() => {
                            setSection(UserPageSection.GuestRoomBooking);
                            setSubsection(UserPageSubsection.New);
                          }}
                        >
                          New
                        </span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>

            <Collapsible
              asChild
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton>
                    <BedDouble />
                    <span>Guest Room Booking</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <span
                          className="select-none"
                          onClick={() => {
                            setSection(UserPageSection.GuestRoomBooking);
                            setSubsection(UserPageSubsection.Existing);
                          }}
                        >
                          Existing
                        </span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>

                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <span
                          className="select-none"
                          onClick={() => {
                            setSection(UserPageSection.GuestRoomBooking);
                            setSubsection(UserPageSubsection.Review);
                          }}
                        >
                          Review
                        </span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </>
        )}
      </SidebarMenu>
    </SidebarGroup>
  )
}
