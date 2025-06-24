"use client"

import {
  Megaphone,
  AlertTriangle,
  BedDouble,
  ChevronRight,
  User,
  Shield
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
import { useSidebar } from "@/components/ui/sidebar";
import { UserPageSection, UserPageSubsection } from "@/models/UserPageSections"
import { useUserPage } from "@/hooks/use-user-page"

export function NavAdminActions() {
  const { setSection, setSubsection } = useUserPage();
  const { user } = useUser();
  const { setOpenMobile } = useSidebar();

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
                setOpenMobile(false);
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
                setOpenMobile(false);
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
                            setOpenMobile(false);
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
                            setOpenMobile(false);
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

            <Collapsible
              asChild
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton>
                    <User />
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
                            setOpenMobile(false);
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
                            setSection(UserPageSection.UserManagement);
                            setSubsection(UserPageSubsection.New);
                            setOpenMobile(false);
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
                    <Shield />
                    <span>Admin Management</span>
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
                            setSection(UserPageSection.AdminManagement);
                            setSubsection(UserPageSubsection.Existing);
                            setOpenMobile(false);
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
                            setSection(UserPageSection.AdminManagement);
                            setSubsection(UserPageSubsection.New);
                            setOpenMobile(false);
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
          </>
        )}
      </SidebarMenu>
    </SidebarGroup>
  )
}
