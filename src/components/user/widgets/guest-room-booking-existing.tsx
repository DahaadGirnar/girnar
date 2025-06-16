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

export default function GuestRoomBookingReview() {
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch existing guest room bookings from the API or state management
    const fetchBookings = async () => {
      setLoading(true);
      const supabase = createClient();
      const { data: requests, error: reqError } = await supabase
        .from("bookings")
        .select("id, user_id, from_date, to_date, user_profiles(full_name, entry_no, phone)")
        .eq("is_confirmed", true)
        .order("from_date", { ascending: true });

      if (reqError) {
        setError(`Failed to fetch bookings: ${reqError.message}`);
      }

      if (!requests) {
        setBookings([]);
      } else {
        const typedRequests = (requests ?? []) as BookingRequest[];
        setBookings(typedRequests);
      }

      setLoading(false);
    };

    fetchBookings();
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-2xl font-semibold">Existing Guest Room Bookings:</h2>
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
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={5}>
                Showing {bookings.length} bookings
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )}
    </div>
  );
}

