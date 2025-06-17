import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { useState, useEffect } from "react";
import { BookingRequest } from "@/models/BookingRequests";
import { createClient } from "@/utils/supabase/client";

export default function GuestRoomBookingExisting() {
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch existing guest room bookings from the API or state management
    const fetchBookings = async () => {
      setLoading(true);
      const supabase = createClient();
      const { data: confirmedRequests, error: reqError } = await supabase
        .from("bookings")
        .select("id, user_id, from_date, to_date, user_profiles(full_name, entry_no, phone)")
        .eq("is_confirmed", false)
        .order("from_date", { ascending: true });

      if (reqError) {
        setError(`Failed to fetch bookings: ${reqError.message}`);
      }

      if (!confirmedRequests) {
        setBookings([]);
      } else {
        const typedConfirmedRequests = (confirmedRequests ?? []) as BookingRequest[];
        setBookings(typedConfirmedRequests);
      }

      setLoading(false);
    };

    fetchBookings();
  }, []);

  // Accept a guest room request (mark as confirmed)
  const handleAccept = async (requestId: string) => {
    const supabase = createClient();
    await supabase
      .from("bookings")
      .update({ is_confirmed: true })
      .eq("id", requestId);
    setBookings((prev) => prev.filter((b) => b.id !== requestId));
  };

  // Reject a guest room request (delete from bookings)
  const handleReject = async (requestId: string) => {
    const supabase = createClient();
    await supabase.from("bookings").delete().eq("id", requestId);
    setBookings((prev) => prev.filter((b) => b.id !== requestId));
  };

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-2xl font-semibold">Pending Guest Room Bookings:</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && bookings.length === 0 && (
        <p>No bookings found.</p>
      )}
      {!loading && !error && bookings.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Entry No</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>From Date</TableHead>
              <TableHead>To Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.user_profiles?.full_name || "N/A"}</TableCell>
                <TableCell>{booking.user_profiles?.entry_no || "N/A"}</TableCell>
                <TableCell>{booking.user_profiles?.phone || "N/A"}</TableCell>
                <TableCell>{booking.from_date}</TableCell>
                <TableCell>{booking.to_date}</TableCell>
                <TableCell>
                  <button
                    title="Accept request"
                    className="text-green-600 hover:text-green-800 mr-2"
                    onClick={() => handleAccept(booking.id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="inline w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                  <button
                    title="Reject request"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleReject(booking.id)}
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
                Showing {bookings.length} bookings
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )}
    </div>
  );
}
