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
import { useUser } from "@/hooks/use-user";
import { UserPageSection, UserPageSubsection } from "@/models/UserPageSections";

export default function AdminManagementExisting() {
  const [admins, setAdmins] = useState<UserModel[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const { setSection, setSubsection } = useUserPage();
  const { user } = useUser();

  const deleteAdmin = async (adminId: string) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("user_profiles")
      .update({ admin: false })
      .eq("id", adminId);

    if (error) {
      setError(`Failed to delete admin: ${error.message}`);
      return;
    }

    setAdmins((prev) => prev.filter((admin) => admin.id !== adminId));
  }

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const supabase = createClient();
      // Fetch all non-admin users from user_profiles
      const { data: allUsers, error: usersError } = await supabase
        .from("user_profiles")
        .select("id, full_name, phone, room_no, admin, entry_no")
        .eq("admin", true)
        .neq("id", user?.id) // Exclude current user

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

      setAdmins(usersWithEmail);
      setLoading(false);
    }

    fetchUsers();
  }, [user]);

  return (<div>
    <div className="flex">
      <h2 className="font-bold text-2xl mb-4">Admins Users</h2>
      <Button size="sm" className="ml-auto" onClick={() => {
        setSection(UserPageSection.AdminManagement);
        setSubsection(UserPageSubsection.New);
      }}>
        Make New Admins
      </Button>
    </div>
    {loading && (
      <div className="text-muted-foreground">Loading users...</div>
    )}
    {error && (
      <div className="text-red-500">{error}</div>
    )}
    {!loading && !error && admins.length === 0 && (
      <div className="text-muted-foreground">No users found.</div>
    )}
    {!loading && !error && admins.length > 0 && (
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
          {admins.map((admin) => (
            <TableRow key={admin.id}>
              <TableCell>{admin.full_name}</TableCell>
              <TableCell>{admin.entry_no}</TableCell>
              <TableCell>{admin.phone}</TableCell>
              <TableCell>{admin.email}</TableCell>
              <TableCell>{admin.room_no}</TableCell>
              <TableCell className="text-center">
                <button
                  title="Delete user"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => deleteAdmin(admin.id)}
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
              Showing {admins.length} users
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    )}
  </div>
  );
}
