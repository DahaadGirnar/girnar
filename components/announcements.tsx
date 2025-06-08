'use client';

import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type Announcement = {
  id: string; // uuid
  title: string;
  description: string;
  is_public: boolean;
  created_at: string;
  created_by: string;

  full_name?: string; // This will be populated from user_profiles
};

interface AnnouncementsProps {
  private?: boolean;
  adminPrivalege?: boolean; // Optional prop for admin privilege
}

const Announcements: React.FC<AnnouncementsProps> = ({ private: isPrivate = false, adminPrivalege = false }) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      setLoading(true);
      setError(null);
      let query = supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false });

      if (!isPrivate) {
        query = query.eq("is_public", true);
      }

      const { data, error } = await query;

      if (error) {
        setError(error.message);
        setAnnouncements([]);
      } else {
        if (isPrivate) {
          // For each announcement, fetch full_name from user_profiles using created_by
          const announcementsWithNames = await Promise.all(
            (data || []).map(async (a: Announcement) => {
              let full_name = "Unknown";
              if (a.created_by) {
                const { data: profile } = await supabase
                  .from("user_profiles")
                  .select("full_name")
                  .eq("id", a.created_by)
                  .single();
                if (profile && profile.full_name) {
                  full_name = profile.full_name;
                }
              }
              return { ...a, full_name };
            })
          );
          setAnnouncements(announcementsWithNames);
        } else {
          setAnnouncements(data || []);
        }
      }
      setLoading(false);
    };

    fetchAnnouncements();
  }, [isPrivate]);

  // Add delete handler
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;
    await supabase.from("announcements").delete().eq("id", id);
    window.location.reload();
  };

  if (loading) return <div>Loading announcements...</div>;
  if (error) return <div>Error: {error}</div>;
  if (announcements.length === 0) return <div>No announcements found.</div>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">{isPrivate ? "All" : "Public"} Announcements</h2>
      <ul className="space-y-6 max-w-3xl mx-auto">
        {announcements.map((a) => (
          <li
            key={a.id}
            className="border rounded-lg p-4 shadow flex flex-col gap-2 relative"
          >
            <div className="flex items-center justify-between mb-1">
              <strong className="text-lg">{a.title}</strong>
              <span className="text-xs ml-4 whitespace-nowrap flex items-center gap-2">
                {new Date(a.created_at).toLocaleString()}
                {adminPrivalege && (
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
            {isPrivate && (
              <div
                className="absolute bottom-2 right-4 text-xs text-gray-500"
              >
                By: {a.full_name || "Unknown"}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Announcements;

