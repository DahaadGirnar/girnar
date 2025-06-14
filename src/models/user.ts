import { User } from "@supabase/supabase-js";

export interface UserModel {
  user: User;
  email: string;
}