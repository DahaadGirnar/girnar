import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Server action to confirm a new user (move from temp_users to user_profiles)
async function confirmUser(formData: FormData) {
  "use server";
  const userId = formData.get("userId");
  if (!userId) return;
  const supabase = await createClient();
  // Get user from temp_users
  const { data: tempUser } = await supabase.from("temp_users").select("*").eq("id", userId).single();
  if (!tempUser) return;
  // Insert into user_profiles
  await supabase.from("user_profiles").insert({ ...tempUser });
  // Delete from temp_users
  await supabase.from("temp_users").delete().eq("id", userId);
  redirect("/protected/admin/users/pending");
}

// Server action to reject a new user (delete from temp_users and auth.users)
async function rejectUser(formData: FormData) {
  "use server";
  const userId = formData.get("userId");
  if (!userId) return;
  const supabase = await createClient();
  const adminClient = createAdminClient();
  await supabase.from("temp_users").delete().eq("id", userId);
  await adminClient.auth.admin.deleteUser(userId as string);
  redirect("/protected/admin/users/pending");
}

export default async function PendingUsersPage() {
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

  // Fetch all pending users from temp_users
  const { data: pendingUsers, error: pendingError } = await supabase
    .from("temp_users")
    .select("id, full_name, phone, room_no, entry_no, email");

  if (pendingError) {
    return <div>Error loading pending users.</div>;
  }

  return (
    <div>
      <h2 className="font-bold text-2xl mb-4">Pending New Users ({pendingUsers?.length ?? 0})</h2>
      <div className="overflow-x-auto mt-2">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Full Name</th>
              <th className="px-4 py-2 border">Entry No</th>
              <th className="px-4 py-2 border">Phone</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Room No</th>
              <th className="px-4 py-2 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(pendingUsers ?? []).map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-2 border">{user.full_name}</td>
                <td className="px-4 py-2 border">{user.entry_no}</td>
                <td className="px-4 py-2 border">{user.phone}</td>
                <td className="px-4 py-2 border">{user.email}</td>
                <td className="px-4 py-2 border">{user.room_no}</td>
                <td className="px-4 py-2 border text-center flex gap-2 justify-center">
                  <form action={confirmUser}>
                    <input type="hidden" name="userId" value={user.id} />
                    <button
                      title="Accept user"
                      className="text-green-600 hover:text-green-800"
                      type="submit"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="inline w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  </form>
                  <form action={rejectUser}>
                    <input type="hidden" name="userId" value={user.id} />
                    <button
                      title="Reject user"
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
