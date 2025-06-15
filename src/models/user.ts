export interface UserModel {
  id: string;
  email: string;
  profile_created: boolean;
  
  // Part of Profile
  full_name?: string;
  verified?: boolean;
  admin?: boolean;
  phone?: string;
  room_no?: string;
  entry_no?: string;
}