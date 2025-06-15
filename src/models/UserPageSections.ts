export enum UserPageSection {
  General = "General",
  Profile = "Profile",
  Announcements = "Announcements",
  Complaints = "Complaints",
  GuestRoomBooking = "Guest Room Booking",
}

export enum UserPageSubsection {
  New = "New",
  Existing = "Existing",
}

export const SectionSubsections: Record<UserPageSection, UserPageSubsection[]> = {
  [UserPageSection.General]: [],
  [UserPageSection.Profile]: [],
  [UserPageSection.Announcements]: [],
  [UserPageSection.Complaints]: [UserPageSubsection.New, UserPageSubsection.Existing],
  [UserPageSection.GuestRoomBooking]: [],
}
