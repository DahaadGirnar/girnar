'use client';

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

type Complaint = {
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

export default function ReviewComplaintsWidget() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [complaintsError, setComplaintsError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState("Pending");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const statusOptions = ["All", "Pending", "In Progress", "Closed"];
  const categoryOptions = ["All", "Maintenance", "Mess", "SC/ST"];

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      // Fetch complaints
      const { data: complaintsData, error: complaintsError } = await supabase
        .from("complaints")
        .select("*, user_profiles(full_name, entry_no, room_no)");

      if (complaintsError) {
        setComplaintsError("Failed to load complaints.");
      } else {
        setComplaints(complaintsData || []);
      }
    };
    fetchData();
  }, []);

  function filterComplaints(list: Complaint[], status: string, category: string) {
    return list.filter((c) => {
      const statusMatch = status === "All" || c.status === status;
      const categoryMatch = category === "All" || c.category === category;
      return statusMatch && categoryMatch;
    });
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-2xl">Complaints</h2>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {selectedStatus}
                <ChevronDown className="ml-2 w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {statusOptions.map((status) => (
                <DropdownMenuItem
                  key={status}
                  onSelect={() => setSelectedStatus(status)}
                  disabled={status === selectedStatus}
                >
                  {status}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {selectedCategory}
                <ChevronDown className="ml-2 w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {categoryOptions.map((cat) => (
                <DropdownMenuItem
                  key={cat}
                  onSelect={() => setSelectedCategory(cat)}
                  disabled={cat === selectedCategory}
                >
                  {cat}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {complaintsError && (
        <p className="text-red-500">{complaintsError}</p>
      )}
      {!complaintsError && complaints && complaints.length === 0 && (
        <p className="text-muted-foreground">No complaints found.</p>
      )}
      {!complaintsError && complaints && complaints.length > 0 && (
        <ul className="space-y-6 w-full mx-auto">
          {filterComplaints(
            complaints
              .slice()
              .sort((a: { status: "Pending" | "In Progress" | "Closed" }, b: { status: "Pending" | "In Progress" | "Closed" }) => {
                const statusOrder: { [key in "Pending" | "In Progress" | "Closed"]: number } = { Pending: 0, "In Progress": 1, Closed: 2 };
                return statusOrder[a.status] - statusOrder[b.status];
              }),
            selectedStatus,
            selectedCategory
          ).map((c) => (
            <li
              key={c.id}
              className={`border rounded-lg p-4 shadow flex flex-col gap-2 relative ${c.status === "Closed" ? "opacity-50" : ""}`}
            >
              <div className="flex items-center justify-between">
                <strong className="text-lg">{c.title || "No title"}</strong>
                <span className="text-xs ml-4 whitespace-nowrap">
                  {c.created_at ? new Date(c.created_at).toLocaleString() : ""}
                </span>
              </div>
              <div className="">{c.description || "No description"}</div>
              <div className="flex items-center gap-4 text-xs text-gray-600 mb-1">
                <span>
                  <b>Name:</b> {c.user_profiles?.full_name || "N/A"}
                </span>
                <span>
                  <b>Entry No.:</b> {c.user_profiles?.entry_no || "N/A"}
                </span>
                <span>
                  <b>Room No.:</b> {c.user_profiles?.room_no || "N/A"}
                </span>
              </div>
              <div className="absolute bottom-2 right-4 text-xs text-gray-500">
                {c.status}
              </div>
              {/* Action buttons */}
              <div className="flex gap-2 mt-2">
                {c.status === "Pending" && (
                  <>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={async () => {
                        const supabase = createClient();
                        const { error } = await supabase
                          .from("complaints")
                          .update({ status: "In Progress" })
                          .eq("id", c.id);
                        if (!error) {
                          setComplaints((prev) =>
                            prev.map((comp) =>
                              comp.id === c.id
                                ? { ...comp, status: "In Progress" }
                                : comp
                            )
                          );
                        }
                      }}
                    >
                      Move to In Progress
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={async () => {
                        const supabase = createClient();
                        const { error } = await supabase
                          .from("complaints")
                          .update({ status: "Closed" })
                          .eq("id", c.id);
                        if (!error) {
                          setComplaints((prev) =>
                            prev.map((comp) =>
                              comp.id === c.id
                                ? { ...comp, status: "Closed" }
                                : comp
                            )
                          );
                        }
                      }}
                    >
                      Close
                    </Button>
                  </>
                )}
                {c.status === "In Progress" && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={async () => {
                      const supabase = createClient();
                      const { error } = await supabase
                        .from("complaints")
                        .update({ status: "Closed" })
                        .eq("id", c.id);
                      if (!error) {
                        setComplaints((prev) =>
                          prev.map((comp) =>
                            comp.id === c.id
                              ? { ...comp, status: "Closed" }
                              : comp
                          )
                        );
                      }
                    }}
                  >
                    Close
                  </Button>
                )}
                {c.status === "Closed" && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={async () => {
                      const supabase = createClient();
                      const { error } = await supabase
                        .from("complaints")
                        .delete()
                        .eq("id", c.id);
                      if (!error) {
                        setComplaints((prev) =>
                          prev.filter((comp) => comp.id !== c.id)
                        );
                      }
                    }}
                  >
                    Delete
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
