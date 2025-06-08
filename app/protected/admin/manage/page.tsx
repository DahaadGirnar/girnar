import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Server action to remove admin rights
async function deleteAdmin(formData: FormData) {
  "use server";
  const userId = formData.get("userId");
  if (!userId) return;
  const supabase = await createClient();
  await supabase
    .from("user_profiles")
    .update({ admin: false })
    .eq("id", userId);
  redirect("/protected/admin/manage"); // reload page after deletion
}

export default async function AdminManagementPage() {
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

  // Fetch all users from user_profiles
  const { data: allUsers, error: usersError } = await supabase
    .from("user_profiles")
    .select("id, full_name, phone, room_no, admin, entry_no, email");

  if (usersError) {
    return <div>Error loading users.</div>;
  }

  // Filter admins
  const admins = (allUsers ?? []).filter((user) => user.admin);

  return (
    <div>
      <h2 className="font-bold text-2xl mb-4">Admin Management</h2>
      <div className="flex mt-4">
        <h3 className="font-semibold text-xl mb-2">Admin Users ({admins.length})</h3>
        <div className="ml-auto">
          <Button asChild size="sm">
            <Link href="/protected/admin/manage/add">Add Admin</Link>
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
              <th className="px-4 py-2 border"></th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => {
              const isCurrentUser = admin.id === data.user.id;
              return (
                <tr key={admin.id} className={isCurrentUser ? "text-gray-400" : ""}>
                  <td className="px-4 py-2 border">{admin.full_name}</td>
                  <td className="px-4 py-2 border">{admin.entry_no}</td>
                  <td className="px-4 py-2 border">{admin.phone}</td>
                  <td className="px-4 py-2 border">{admin.email}</td>
                  <td className="px-4 py-2 border text-center">
                    <form action={deleteAdmin}>
                      <input type="hidden" name="userId" value={admin.id} />
                      <button
                        title="Delete admin"
                        className={`text-red-500 hover:text-red-700 ${isCurrentUser ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`}
                        disabled={isCurrentUser}
                        type="submit"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="inline w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </form>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
