export enum UserPageSection {
  General = "General",
  Profile = "Profile",
  Announcements = "Announcements",
  MakeAnnouncements = "Make Announcements",
  Complaints = "Complaints",
  GuestRoomBooking = "Guest Room Booking",
}

export enum UserPageSubsection {
  New = "New",
  Existing = "Existing",
  Review = "Review",
}

export const SectionSubsections: Record<UserPageSection, UserPageSubsection[]> = {
  [UserPageSection.General]: [],
  [UserPageSection.Profile]: [],
  [UserPageSection.Announcements]: [
    UserPageSubsection.Existing,
    UserPageSubsection.New
  ],
  [UserPageSection.MakeAnnouncements]: [],
  [UserPageSection.Complaints]: [
    UserPageSubsection.New,
    UserPageSubsection.Existing,
    UserPageSubsection.Review
  ],
  [UserPageSection.GuestRoomBooking]: [],
}
