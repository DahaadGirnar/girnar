export type Complaint = {
  id: string;
  user_id: string;
  title?: string;
  description?: string;
  status: "Pending" | "Closed";
  category?: string;
  created_at?: string;
  user_profiles?: {
    full_name?: string;
    entry_no?: string;
    room_no?: string;
  } | null;
};
