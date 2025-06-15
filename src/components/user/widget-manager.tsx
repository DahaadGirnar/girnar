'use client';

import { useUserPage } from "@/hooks/use-user-page";
import { UserPageSection, UserPageSubsection } from "@/models/UserPageSections";

import GeneralWidget from "./widgets/general";
import ProfileWidget from "./widgets/profile";
import ExistingAnnouncementsWidget from "./widgets/announcements-existing";
import NewAnnouncementsWidget from "./widgets/announcements-new";
import ExistingComplaintsWidget from "./widgets/complaints-existing";
import NewComplaintsWidget from "./widgets/complaints-new";
import ReviewComplaintsWidget from "./widgets/complaints-review";
import GuestRoomBooking from "./widgets/guest-room-booking";

export default function UserWidgetManager() {
  const { section, subsection } = useUserPage();

  return (
    <>
      {(section === UserPageSection.General) && <GeneralWidget />}
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
      {(section === UserPageSection.GuestRoomBooking) && <GuestRoomBooking />}
    </>
  );
}
