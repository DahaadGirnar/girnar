'use client';

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useUser } from "@/hooks/use-user";

type Announcement = {
  id: string; // uuid
  title: string;
  description: string;
  is_public: boolean;
  created_at: string;
  created_by: string;

  user_profiles: { full_name?: string }; // This will be populated from user_profiles
};

export default function AnnouncementsWidget() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const supabase = createClient();
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("announcements")
        .select("*, user_profiles(full_name)")
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
        setAnnouncements([]);
      } else {
        setAnnouncements(data || []);
      }
      setLoading(false);
    };

    fetchAnnouncements();
  }, []);

  // Add delete handler
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;
    const supabase = createClient();
    await supabase.from("announcements").delete().eq("id", id);
    window.location.reload();
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Announcements</h2>
      {loading && (
        <div className="text-gray-500 mb-4">Loading...</div>
      )}
      {error && (
        <div className="text-red-500 mb-4">Error: {error}</div>
      )}
      <ul className="space-y-6 w-full mx-auto">
        {!loading && !error && announcements.length === 0 && (
          <li className="text-gray-500 text-center">No announcements found.</li>
        )}
        {!loading && !error && announcements.map((a) => (
          <li
            key={a.id}
            className="border rounded-lg p-4 shadow flex flex-col gap-2 relative"
          >
            <div className="flex items-center justify-between mb-1">
              <strong className="text-lg">{a.title}</strong>
              <span className="text-xs ml-4 whitespace-nowrap flex items-center gap-2">
                {new Date(a.created_at).toLocaleString()}
                {user?.admin && (
                  <button
                    type="submit"
                    title="Delete"
                    className="ml-1 text-red-500 hover:text-red-700 p-0 bg-transparent border-none"
                    style={{ background: "none" }}
                    tabIndex={-1}
                    onClick={() => handleDelete(a.id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m5 0H6" />
                    </svg>
                  </button>
                )}
              </span>
            </div>
            <div className="mb-2">{a.description}</div>
            <div
              className="absolute bottom-2 right-4 text-xs text-gray-500"
            >
              By: {a.user_profiles.full_name || "Unknown"}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
