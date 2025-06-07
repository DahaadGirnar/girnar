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
}

const Announcements: React.FC<AnnouncementsProps> = ({ private: isPrivate = false }) => {
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
              <span className="text-xs ml-4 whitespace-nowrap">
                {new Date(a.created_at).toLocaleString()}
              </span>
            </div>
            <div>{a.description}</div>
            {isPrivate && (
              <div className="absolute bottom-2 right-4 text-xs text-gray-500">
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

