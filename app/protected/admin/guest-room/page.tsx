import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Server action to accept a guest room request (mark as confirmed)
async function acceptRequest(formData: FormData) {
  "use server";
  const requestId = formData.get("requestId");
  if (!requestId) return;
  const supabase = await createClient();
  // Mark the request as confirmed
  await supabase
    .from("bookings")
    .update({ status: "confirmed" })
    .eq("id", requestId);
  redirect("/protected/admin/guest-room");
}

// Server action to reject a guest room request (delete from bookings)
async function rejectRequest(formData: FormData) {
  "use server";
  const requestId = formData.get("requestId");
  if (!requestId) return;
  const supabase = await createClient();
  await supabase.from("bookings").delete().eq("id", requestId);
  redirect("/protected/admin/guest-room");
}

export default async function PendingGuestRoomRequestsPage() {
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

  // Fetch all pending guest room requests (status is not confirmed)
  const { data: requests, error: reqError } = await supabase
    .from("bookings")
    .select("id, user_id, from_date, to_date")
    .neq("status", "confirmed")
    .order("from_date", { ascending: true });

  if (reqError) {
    return <div>Error loading guest room requests.</div>;
  }

  // Fetch all confirmed guest room bookings
  const { data: confirmedRequests } = await supabase
    .from("bookings")
    .select("id, user_id, from_date, to_date")
    .eq("status", "confirmed")
    .order("from_date", { ascending: true });

  // Fetch user profiles for confirmed bookings
  const confirmedUserIds = (confirmedRequests ?? []).map((req) => req.user_id);
  type UserProfile = { id: string; full_name?: string; entry_no?: string; phone?: string };
  let confirmedUserProfilesMap: Record<string, UserProfile> = {};
  if (confirmedUserIds.length > 0) {
    const { data: confirmedUserProfiles } = await supabase
      .from("user_profiles")
      .select("id, full_name, entry_no, phone")
      .in("id", confirmedUserIds);
    confirmedUserProfilesMap = (confirmedUserProfiles ?? []).reduce((acc: Record<string, UserProfile>, profile: UserProfile) => {
      acc[profile.id] = profile;
      return acc;
    }, {});
  }

  // Fetch all user profiles for the user_ids in requests
  const userIds = (requests ?? []).map((req) => req.user_id);
  let userProfilesMap: Record<string, UserProfile> = {};
  if (userIds.length > 0) {
    const { data: userProfiles } = await supabase
      .from("user_profiles")
      .select("id, full_name, entry_no, phone")
      .in("id", userIds);
    userProfilesMap = (userProfiles ?? []).reduce((acc: Record<string, UserProfile>, profile: UserProfile) => {
      acc[profile.id] = profile;
      return acc;
    }, {});
  }

  return (
    <div>
      {/* Confirmed Bookings Table */}
      {(confirmedRequests && confirmedRequests.length > 0) && (
        <>
          <h2 className="font-bold text-2xl mb-4">Confirmed Guest Room Bookings ({confirmedRequests.length})</h2>
          <div className="overflow-x-auto mt-2 mb-8">
            <table className="min-w-full border border-green-300">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">Name</th>
                  <th className="px-4 py-2 border">Entry No</th>
                  <th className="px-4 py-2 border">Phone</th>
                  <th className="px-4 py-2 border">From Date</th>
                  <th className="px-4 py-2 border">To Date</th>
                </tr>
              </thead>
              <tbody>
                {confirmedRequests.map((req) => {
                  const userProfile = confirmedUserProfilesMap[String(req.user_id)] || {};
                  return (
                    <tr key={req.id}>
                      <td className="px-4 py-2 border">{userProfile.full_name ?? "-"}</td>
                      <td className="px-4 py-2 border">{userProfile.entry_no ?? "-"}</td>
                      <td className="px-4 py-2 border">{userProfile.phone ?? "-"}</td>
                      <td className="px-4 py-2 border">{req.from_date}</td>
                      <td className="px-4 py-2 border">{req.to_date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
      {/* Pending Requests Table */}
      {(requests && requests.length > 0) && (
        <>
          <h2 className="font-bold text-2xl mb-4">Pending Guest Room Requests ({requests.length})</h2>
          <div className="overflow-x-auto mt-2">
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">Name</th>
                  <th className="px-4 py-2 border">Entry No</th>
                  <th className="px-4 py-2 border">Phone</th>
                  <th className="px-4 py-2 border">From Date</th>
                  <th className="px-4 py-2 border">To Date</th>
                  <th className="px-4 py-2 border text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => {
                  const userProfile = userProfilesMap[String(req.user_id)] || {};
                  return (
                    <tr key={req.id}>
                      <td className="px-4 py-2 border">{userProfile.full_name ?? "-"}</td>
                      <td className="px-4 py-2 border">{userProfile.entry_no ?? "-"}</td>
                      <td className="px-4 py-2 border">{userProfile.phone ?? "-"}</td>
                      <td className="px-4 py-2 border">{req.from_date}</td>
                      <td className="px-4 py-2 border">{req.to_date}</td>
                      <td className="px-4 py-2 border text-center flex gap-2 justify-center">
                        <form action={acceptRequest}>
                          <input type="hidden" name="requestId" value={req.id} />
                          <button
                            title="Accept request"
                            className="text-green-600 hover:text-green-800"
                            type="submit"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="inline w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                        </form>
                        <form action={rejectRequest}>
                          <input type="hidden" name="requestId" value={req.id} />
                          <button
                            title="Reject request"
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
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
      {(!confirmedRequests && !requests) && (
        <div>
          <h2 className="font-bold text-2xl mb-4">No Guest Room Requests</h2>
        </div>
      )}
    </div>
  );
}

