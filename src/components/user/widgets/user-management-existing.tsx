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

import { Button } from "@/components/ui/button";
import { UserModel } from "@/models/user";
import { useUserPage } from "@/hooks/use-user-page";
import { UserPageSection, UserPageSubsection } from "@/models/UserPageSections";

export default function UserManagementExisting() {
  const [users, setUsers] = useState<UserModel[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const { setSection, setSubsection } = useUserPage();

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
        .eq("admin", false)
        .eq("verified", true);

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
      <div className="flex">
        <h2 className="font-bold text-2xl mb-4">Existing Users</h2>
        <Button size="sm" className="ml-auto" onClick={() => {
          setSection(UserPageSection.UserManagement);
          setSubsection(UserPageSubsection.New);
        }}>
          Approve New Users
        </Button>
      </div>
      {loading && (
        <div className="text-muted-foreground">Loading users...</div>
      )}
      {error && (
        <div className="text-red-500">{error}</div>
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
                    title="Delete user"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => deleteUser(user.id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m5 0H6" />
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
