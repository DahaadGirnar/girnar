import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ComplaintsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  // Fetch complaints where id == user.id
  const { data: complaints, error: complaintsError } = await supabase
    .from("complaints")
    .select("*")
    .eq("user_id", data.user.id);

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-2xl">Complaints</h2>
        <Button>
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
        <ul className="space-y-6 w-max-2xl w-full mx-auto">
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
                  <span className="text-xs ml-4 whitespace-nowrap">
                    {c.created_at ? new Date(c.created_at).toLocaleString() : ""}
                  </span>
                </div>
                <div>{c.description || "No description"}</div>
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
