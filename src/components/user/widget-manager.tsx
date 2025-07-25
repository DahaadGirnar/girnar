'use client';

import { useUserPage } from "@/hooks/use-user-page";
import { UserPageSection, UserPageSubsection } from "@/models/UserPageSections";

import GeneralWidget from "./widgets/general";
import RepresentativesWidget from "./widgets/representatives";
import ProfileWidget from "./widgets/profile";
import ExistingAnnouncementsWidget from "./widgets/announcements-existing";
import NewAnnouncementsWidget from "./widgets/announcements-new";
import ExistingComplaintsWidget from "./widgets/complaints-existing";
import NewComplaintsWidget from "./widgets/complaints-new";
import ReviewComplaintsWidget from "./widgets/complaints-review";
import GuestRoomBookingNew from "./widgets/guest-room-booking-new";
import GuestRoomBookingReview from "./widgets/guest-room-booking-review";
import GuestRoomBookingExisting from "./widgets/guest-room-booking-existing";
import UserManagementExisting from "./widgets/user-management-existing";
import UserManagementNew from "./widgets/user-management-new";
import AdminManagementExisting from "./widgets/admin-management-existing";
import AdminManagementNew from "./widgets/admin-management-new";

export default function UserWidgetManager() {
  const { section, subsection } = useUserPage();

  return (
    <>
      {(section === UserPageSection.General) && <GeneralWidget />}
      {(section === UserPageSection.Representatives) && <RepresentativesWidget />}
      {(section === UserPageSection.Profile) && <ProfileWidget />}
      {(section === UserPageSection.Announcements) && (
        <>
          {(subsection === UserPageSubsection.Existing) && <ExistingAnnouncementsWidget />}
          {(subsection === UserPageSubsection.New) && <NewAnnouncementsWidget />}
        </>
      )}
      {(section === UserPageSection.Complaints) && (
        <>
          {(subsection === UserPageSubsection.Existing) && <ExistingComplaintsWidget />}
          {(subsection === UserPageSubsection.New) && <NewComplaintsWidget />}
          {(subsection === UserPageSubsection.Review) && <ReviewComplaintsWidget />}
        </>
      )}
      {(section === UserPageSection.GuestRoomBooking) && (
        <>
          {(subsection === UserPageSubsection.New) && <GuestRoomBookingNew />}
          {(subsection === UserPageSubsection.Existing) && <GuestRoomBookingExisting />}
          {(subsection === UserPageSubsection.Review) && <GuestRoomBookingReview />}
        </>
      )}
      {(section === UserPageSection.UserManagement) && (
        <>
          {(subsection === UserPageSubsection.New) && <UserManagementNew />}
          {(subsection === UserPageSubsection.Existing) && <UserManagementExisting />}
        </>
      )}
      {(section === UserPageSection.AdminManagement) && (
        <>
          {(subsection === UserPageSubsection.New) && <AdminManagementNew />}
          {(subsection === UserPageSubsection.Existing) && <AdminManagementExisting />}
        </>
      )}
    </>
  );
}
