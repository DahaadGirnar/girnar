'use client';

import { createClient } from "@/utils/supabase/client";

import { useState, useEffect } from "react";
import { useUser } from "@/hooks/use-user";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function GuestRoomBookingNew() {
  const { user } = useUser();

  const [guestName, setGuestName] = useState("");
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>("");

  const [requestExists, setRequestExists] = useState(false);

  useEffect(() => {
    const checkExistingBooking = async () => {
      const supabase = createClient();
      const { data: bookings, error: bookingsError } = await supabase
        .from("bookings")
        .select("id, guest_name, from_date, to_date")
        .eq("user_id", user?.id)
        .limit(1);

      if (!bookingsError && bookings && bookings.length > 0) {
        setRequestExists(true);
        setGuestName(bookings[0].guest_name);
        setFromDate(new Date(bookings[0].from_date));
        setToDate(new Date(bookings[0].to_date));
      }
    };
    checkExistingBooking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const requestGuestRoom = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fromDate || !toDate) {
      setError("Please select both From and To dates.");
      return;
    }
    setIsLoading(true);
    setError(null);
    const supabase = createClient();

    try {
      // Insert guest room booking
      const { error: insertError } = await supabase
        .from("bookings")
        .insert({
          user_id: user?.id,
          guest_name: guestName,
          from_date: fromDate?.toISOString(),
          to_date: toDate?.toISOString(),
        });
      if (insertError) throw insertError;
      setRequestExists(true);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === "object" && err !== null && "message" in err) {
        setError(String((err as { message: unknown }).message));
      } else {
        setError("An error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  function formatDate(date?: Date) {
    return date ? date.toLocaleDateString() : "Select date";
  }

  if (requestExists) {
    return (
      <div className="flex w-full h-[89vh] items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-2xl">
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">
                  Booking Created!
                </CardTitle>
                <CardDescription>Your booking has been successfully created.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  The booking has been sent to warden for approval. You will receive a notification once the booking is approved. If you have any questions or need to make changes, please contact the warden directly.
                </p>
                <div className="text-sm mt-4">
                  <h3 className="font-semibold text-muted-foreground">Booking Details:</h3>
                  <div className="ml-4">
                    <p><span className="font-semibold text-muted-foreground">Guest Name:</span> {guestName}</p>
                    <p><span className="font-semibold text-muted-foreground">From Date:</span> {formatDate(fromDate)}</p>
                    <p><span className="font-semibold text-muted-foreground">To Date:</span> {formatDate(toDate)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-2xl font-semibold">Request Guest Room</h2>
      <form onSubmit={requestGuestRoom} className='mt-3'>
        <div className="flex flex-col gap-6">
          <div className="grid gap-3">
            <Label htmlFor="guest-name">Guest Name</Label>
            <Input
              id="guest-name"
              type="text"
              placeholder="John Doe"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 grid gap-3">
              <Label>From Date</Label>
              <DropdownMenu open={fromOpen} onOpenChange={setFromOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="justify-between"
                  >
                    {formatDate(fromDate)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="p-0">
                  <Calendar
                    mode="single"
                    selected={fromDate}
                    onSelect={(date) => {
                      setFromDate(date);
                      setFromOpen(false);
                    }}
                    className="rounded-md border"
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex-1 grid gap-3">
              <Label>To Date</Label>
              <DropdownMenu open={toOpen} onOpenChange={setToOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="justify-between"
                  >
                    {formatDate(toDate)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="p-0">
                  <Calendar
                    mode="single"
                    selected={toDate}
                    onSelect={(date) => {
                      setToDate(date);
                      setToOpen(false);
                    }}
                    className="rounded-md border"
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Request"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
