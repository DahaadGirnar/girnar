'use client';

import { useUserPage } from "@/hooks/use-user-page";
import { UserPageSection, UserPageSubsection } from "@/models/UserPageSections";

import GeneralWidget from "./widgets/general";
import ProfileWidget from "./widgets/profile";
import AnnouncementsWidget from "./widgets/announcements";
import ExistingComplaintsWidget from "./widgets/complaints-existing";
import NewComplaintsWidget from "./widgets/complaints-new";

export default function UserWidgetManager() {
  const { section, subsection } = useUserPage();

  return (
    <>
      {(section === UserPageSection.General) && <GeneralWidget />}
      {(section === UserPageSection.Profile) && <ProfileWidget />}
      {(section === UserPageSection.Announcements) && <AnnouncementsWidget />}
      {(section === UserPageSection.Complaints) && (
        <>
          {(subsection === UserPageSubsection.Existing) && <ExistingComplaintsWidget />}
          {(subsection === UserPageSubsection.New) && <NewComplaintsWidget />}
        </>
      )}
    </>
  );
}
