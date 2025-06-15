import { User } from "@supabase/supabase-js";

export interface UserModel {
  user: User;
  name?: string;
  email: string;
}