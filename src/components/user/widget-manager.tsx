'use client';

import { useUserPage } from "@/hooks/use-user-page";
import { UserPageSection } from "@/models/UserPageSections";

import GeneralWidget from "./widgets/general";
import ProfileWidget from "./widgets/profile";
import AnnouncementsWidget from "./widgets/announcements";

export default function UserWidgetManager() {
  const { section } = useUserPage();

  return (
    <>
      {(section === UserPageSection.General) && <GeneralWidget />}
      {(section === UserPageSection.Profile) && <ProfileWidget />}
      {(section === UserPageSection.Announcements) && <AnnouncementsWidget />}
    </>
  );
}
