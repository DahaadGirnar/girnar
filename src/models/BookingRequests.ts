export type BookingRequest = {
  id: string;
  user_id: string;
  from_date: string;
  to_date: string;
  user_profiles: {
    full_name?: string;
    entry_no?: string;
    phone?: string;
  } | null;
};
