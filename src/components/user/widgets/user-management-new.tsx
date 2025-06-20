import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

import { UserModel } from "@/models/user";

export default function UserManagementExisting() {
  const [users, setUsers] = useState<UserModel[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const approveUser = async (userId: string) => {
    const supabase = createClient();

    const { error: updateError } = await supabase
      .from("user_profiles")
      .update({ verified: true })
      .eq("id", userId);

    if (!updateError) {
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));

      try {
        // Send email notification
        const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000";
        await fetch(`${baseUrl}/api/mail`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: users.find(user => user.id === userId)?.email || "",
            subject: "Your Girnar Website account has been approved",
            text: "Congratulations! Your account has been approved. Now you can log in to the Girnar website and access all the features.",
          }),
        });
      } catch (emailError) {
        console.error("Failed to send approval email:", emailError);
        setError(`Failed to send approval email: ${(emailError as Error).message}`);
      }
      
    } else {
      setError(`Failed to approve user: ${updateError.message}`);
    }
  }

  const deleteUser = async (userId: string) => {
    const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/delete-user`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    if (res.ok) {
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } else {
      setError(`Failed to delete user: ${res.statusText}`);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const supabase = createClient();
      // Fetch all non-admin users from user_profiles
      const { data: allUsers, error: usersError } = await supabase
        .from("user_profiles")
        .select("id, full_name, phone, room_no, admin, entry_no")
        .eq("verified", false);

      if (usersError) {
        setError(`Failed to fetch users: ${usersError.message}`);
        setLoading(false);
        return;
      }

      // Fetch emails from API
      let emails: { id: string; email: string }[] = [];
      try {
        const res = await fetch("/api/user-emails");
        if (res.ok) {
          const json = await res.json();
          emails = json.users || [];
        }
      } catch (e) {
        setError(`Failed to fetch user emails: ${(e as Error).message}`);
      }

      // Merge emails into users
      const usersWithEmail = (allUsers as UserModel[] || []).map(user => {
        const emailObj = emails.find(e => e.id === user.id);
        return { ...user, email: emailObj?.email || "" };
      });

      setUsers(usersWithEmail);
      setLoading(false);
    }
    fetchUsers();
  }, []);

  return (
    <div>
      <h2 className="font-bold text-2xl mb-4">New Users</h2>
      {loading && (
        <div className="text-muted-foreground">Loading users...</div>
      )}
      {error && (
        <div className="text-red-600">{error}</div>
      )}
      {!loading && !error && users.length === 0 && (
        <div className="text-muted-foreground">No users found.</div>
      )}
      {!loading && !error && users.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Full Name</TableHead>
              <TableHead>Entry No</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Room No</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.full_name}</TableCell>
                <TableCell>{user.entry_no}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.room_no}</TableCell>
                <TableCell className="text-center">
                  <button
                    title="Approve user"
                    className="text-green-600 hover:text-green-800"
                    onClick={() => approveUser(user.id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="inline w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                  <button
                    title="Delete user"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => deleteUser(user.id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="inline w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={6}>
                Showing {users.length} users
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )}
    </div>
  );
}
