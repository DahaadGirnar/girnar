'use client';

import { useUser } from "@/hooks/use-user";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Complaint {
  id: string;
  title?: string;
  description?: string;
  status: "Pending" | "In Progress" | "Closed";
  created_at?: string;
  user_id: string;
  // ...add other fields as needed
}

export default function ComplaintsWidget() {
  const { user } = useUser();
  const supabase = createClient();

  const [complaints, setComplaints] = useState<Complaint[] | null>(null);
  const [complaintsError, setComplaintsError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user?.id) {
      setComplaints([]);
      return;
    }
    const fetchComplaints = async () => {
      const { data, error } = await supabase
        .from("complaints")
        .select("*")
        .eq("user_id", user.id);

      setComplaints(data as Complaint[] | null);
      setComplaintsError(error ? new Error(error.message) : null);
    };
    fetchComplaints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this complaint?")) return;
    await supabase.from("complaints").delete().eq("id", id);
    // Refetch complaints after delete
    if (user?.id) {
      const { data, error } = await supabase
        .from("complaints")
        .select("*")
        .eq("user_id", user.id);
      setComplaints(data as Complaint[] | null);
      setComplaintsError(error ? new Error(error.message) : null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-2xl">Complaints</h2>
        <Button asChild size="sm">
          <Link href="/protected/complaints/new">
            New Complaint
          </Link>
        </Button>
      </div>
      {complaintsError && (
        <p className="text-red-500">Failed to load complaints.</p>
      )}
      {!complaintsError && complaints && complaints.length === 0 && (
        <p className="text-muted-foreground">No complaints found.</p>
      )}
      {!complaintsError && complaints && complaints.length > 0 && (
        <ul className="space-y-6 w-full mx-auto">
          {complaints
            .slice()
            .sort((a: { status: "Pending" | "In Progress" | "Closed" }, b: { status: "Pending" | "In Progress" | "Closed" }) => {
              const statusOrder: { [key in "Pending" | "In Progress" | "Closed"]: number } = { Pending: 0, "In Progress": 1, Closed: 2 };
              return statusOrder[a.status] - statusOrder[b.status];
            })
            .map((c) => (
              <li
                key={c.id}
                className={`border rounded-lg p-4 shadow flex flex-col gap-2 relative ${c.status === "Closed" ? "opacity-50" : ""
                  }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <strong className="text-lg">{c.title || "No title"}</strong>
                  <span className="flex items-center text-xs ml-4 whitespace-nowrap gap-2">
                    {c.created_at ? new Date(c.created_at).toLocaleString() : ""}
                    {/* Delete button with icon */}
                    <form
                      action={handleDelete.bind(null, c.id)}
                      style={{ display: "inline" }}
                    >
                      <button
                        type="submit"
                        title="Delete"
                        className="ml-1 text-red-500 hover:text-red-700 p-0 bg-transparent border-none"
                        style={{ background: "none" }}
                        tabIndex={-1}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m5 0H6" />
                        </svg>
                      </button>
                    </form>
                  </span>
                </div>
                <div className="mb-2">{c.description || "No description"}</div>
                <div className="absolute bottom-2 right-4 text-xs text-gray-500">
                  {c.status}
                </div>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
