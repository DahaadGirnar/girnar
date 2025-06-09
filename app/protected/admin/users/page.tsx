import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Server action to delete a user from user_profiles and auth.users
async function deleteUser(formData: FormData) {
  "use server";
  const userId = formData.get("userId");
  if (!userId) return;
  const supabase = await createClient();
  const adminClient = createAdminClient();
  // Delete from user_profiles
  await supabase.from("user_profiles").delete().eq("id", userId);
  // Delete from auth.users (service role)
  await adminClient.auth.admin.deleteUser(userId as string);
  redirect("/protected/admin/users");
}

export default async function UsersManagementPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  // Fetch user profile from user_profiles table
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("admin")
    .eq("id", data.user.id)
    .single();

  if (!profile || !profile.admin) {
    redirect("/protected");
  }

  // Fetch all non-admin users from user_profiles
  const { data: allUsers, error: usersError } = await supabase
    .from("user_profiles")
    .select("id, full_name, phone, room_no, admin, entry_no, email")
    .neq("admin", true);

  if (usersError) {
    return <div>Error loading users.</div>;
  }

  return (
    <div>
      <h2 className="font-bold text-2xl mb-4">User Management</h2>
      <div className="flex mt-4">
        <h3 className="font-semibold text-xl mb-2">All Users ({allUsers?.length ?? 0})</h3>
        <div className="ml-auto">
          <Button asChild size="sm">
            <Link href="/protected/admin/users/pending">Approve New Users</Link>
          </Button>
        </div>
      </div>
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
            {(allUsers ?? []).map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-2 border">{user.full_name}</td>
                <td className="px-4 py-2 border">{user.entry_no}</td>
                <td className="px-4 py-2 border">{user.phone}</td>
                <td className="px-4 py-2 border">{user.email}</td>
                <td className="px-4 py-2 border">{user.room_no}</td>
                <td className="px-4 py-2 border text-center">
                  <form action={deleteUser}>
                    <input type="hidden" name="userId" value={user.id} />
                    <button
                      title="Delete user"
                      className="text-red-500 hover:text-red-700"
                      type="submit"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="inline w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

