export type Complaint = {
  id: string;
  title?: string;
  description?: string;
  status: "Pending" | "In Progress" | "Closed";
  category?: string;
  created_at?: string;
  user_profiles?: {
    full_name?: string;
    entry_no?: string;
    room_no?: string;
  } | null;
};
