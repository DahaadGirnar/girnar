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
        <div className="mt-4 text-muted-foreground">Loading users...</div>
      )}
      {error && (
        <div className="mt-4 text-red-500">{error}</div>
      )}
      {!loading && !error && users.length === 0 && (
        <div className="mt-4 text-muted-foreground">No users found.</div>
      )}
      {!loading && !error && users.length > 0 && (
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Full Name</th>
                <th className="px-4 py-2 border">Entry No</th>
                <th className="px-4 py-2 border">Phone</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Room No</th>
                <th className="px-4 py-2 border"></th>
              </tr>
            </thead>
            <tbody>
              {(users ?? []).map((user) => (
                <tr key={user.id}>
                  <td className="px-4 py-2 border">{user.full_name}</td>
                  <td className="px-4 py-2 border">{user.entry_no}</td>
                  <td className="px-4 py-2 border">{user.phone}</td>
                  <td className="px-4 py-2 border">{user.email}</td>
                  <td className="px-4 py-2 border">{user.room_no}</td>
                  <td className="px-4 py-2 border text-center">
                    <button
                      title="Delete user"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => deleteUser(user.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="inline w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
