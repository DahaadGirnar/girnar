"use client"

import {
  Megaphone,
  AlertTriangle,
  BedDouble,
  UserCog,
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
import { useSidebar } from "@/components/ui/sidebar";
import { UserPageSection, UserPageSubsection } from "@/models/UserPageSections"
import { useUserPage } from "@/hooks/use-user-page"

export function NavUserActions() {
  const { setSection, setSubsection } = useUserPage();
  const { user } = useUser();
  const { setOpenMobile } = useSidebar();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      {user?.admin && (
        <SidebarGroupLabel>User Actions</SidebarGroupLabel>
      )}
      <SidebarMenu>
        {user?.verified && (
          <>
            <SidebarMenuItem>
              <SidebarMenuButton asChild onClick={() => {
                setSection(UserPageSection.Announcements);
                setSubsection(UserPageSubsection.Existing);
                setOpenMobile(false);
              }}>
                <div className="flex items-center gap-2">
                  <Megaphone />
                  <span className="select-none">Announcements</span>
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
                    <AlertTriangle />
                    <span>Complaints</span>
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
                            setSection(UserPageSection.Complaints);
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
                            setSection(UserPageSection.Complaints);
                            setSubsection(UserPageSubsection.New);
                            setOpenMobile(false);
                          }}
                        >
                          New
                        </span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>

                    {user?.admin && (
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <span
                            className="select-none"
                            onClick={() => {
                              setSection(UserPageSection.Complaints);
                              setSubsection(UserPageSubsection.Review);
                              setOpenMobile(false);
                            }}
                          >
                            Review
                          </span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    )}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>

            <SidebarMenuItem>
              <SidebarMenuButton asChild onClick={() => {
                setSection(UserPageSection.GuestRoomBooking);
                setSubsection(UserPageSubsection.New);
                setOpenMobile(false);
              }}>
                <div className="flex items-center gap-2">
                  <BedDouble />
                  <span className="select-none">Guest Room Booking</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild onClick={() => {
                setSection(UserPageSection.Representatives);
                setSubsection(null)
                setOpenMobile(false);
              }}>
                <div className="flex items-center gap-2">
                  <UserCog />
                  <span className="select-none">Representatives</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </>
        )}
      </SidebarMenu>
    </SidebarGroup>
  )
}
