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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { Complaint } from "@/models/Complaint";

export default function ReviewComplaintsWidget() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [complaintsError, setComplaintsError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState("Pending");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [closingMessage, setClosingMessage] = useState("");
  const [isClosing, setIsClosing] = useState(false);
  const statusOptions = ["All", "Pending", "Closed"];
  const categoryOptions = ["All", "Maintenance", "Mess", "Other"];

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

  const handleCloseComplaint = async (complaintToClose: Complaint) => {
    if (!complaintToClose) return;

    setIsClosing(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("complaints")
      .update({ status: "Closed" })
      .eq("id", complaintToClose.id);

    if (!error) {
      const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "http://localhost:3000";
      const res = await fetch(`${baseUrl}/api/user-emails?id=${complaintToClose.user_id}`);
      if (res.ok) {
        const { users } = await res.json();
        const userEmail = users[0]?.email;

        if (userEmail) {
          // Send email notification to user
          await fetch(`${baseUrl}/api/mail`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              to: userEmail,
              subject: "Your complaint has been closed",
              message: `Your complaint titled "${complaintToClose.title || "No title"}" has been closed. Remarks: ${closingMessage || "No remarks provided."}`,
            }),
          });
        }
      }

        setComplaints((prev) =>
          prev.map((comp) =>
            comp.id === complaintToClose.id
              ? { ...comp, status: "Closed", closing_message: closingMessage }
              : comp
          )
        );
      setClosingMessage("");
    } else {
      // Optionally handle the error, e.g., show a toast notification
      console.error("Failed to close complaint:", error.message);
    }
    setIsClosing(false);
  };

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
              .sort((a: { status: "Pending" | "Closed" }, b: { status: "Pending" | "Closed" }) => {
                const statusOrder: { [key in "Pending" | "Closed"]: number } = { Pending: 0, Closed: 1 };
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
                  <Dialog onOpenChange={(open) => !open && setClosingMessage("")}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="destructive">
                        Close
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Close Complaint</DialogTitle>
                        <DialogDescription>
                          Please provide a closing message for this complaint. This will be send to the user.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4">
                        <div className="grid w-full gap-2">
                          <Label htmlFor={`message-${c.id}`}>Remarks</Label>
                          <Textarea
                            placeholder="Type your message here."
                            id={`message-${c.id}`}
                            rows={4}
                            value={closingMessage}
                            onChange={(e) => setClosingMessage(e.target.value)}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          onClick={() => handleCloseComplaint(c)}
                          disabled={isClosing}
                        >
                          {isClosing ? "Closing..." : "Confirm"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
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
