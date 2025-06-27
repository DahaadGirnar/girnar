export enum UserPageSection {
  General = "General",
  Representatives = "Representatives",
  Profile = "Profile",
  Announcements = "Announcements",
  Complaints = "Complaints",
  GuestRoomBooking = "Guest Room Booking",
  UserManagement = "User Management",
  AdminManagement = "Admin Management",
}

export enum UserPageSubsection {
  New = "New",
  Existing = "Existing",
  Review = "Review",
}

export const SectionSubsections: Record<UserPageSection, UserPageSubsection[]> = {
  [UserPageSection.General]: [],
  [UserPageSection.Representatives]: [],
  [UserPageSection.Profile]: [],
  [UserPageSection.Announcements]: [
    UserPageSubsection.Existing,
    UserPageSubsection.New
  ],
  [UserPageSection.Complaints]: [
    UserPageSubsection.New,
    UserPageSubsection.Existing,
    UserPageSubsection.Review
  ],
  [UserPageSection.GuestRoomBooking]: [
    UserPageSubsection.New,
    UserPageSubsection.Existing,
    UserPageSubsection.Review,
  ],
  [UserPageSection.UserManagement]: [
    UserPageSubsection.New,
    UserPageSubsection.Existing,
  ],
  [UserPageSection.AdminManagement]: [
    UserPageSubsection.New,
    UserPageSubsection.Existing,
  ],
}
