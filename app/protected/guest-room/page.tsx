'use client';

import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calander";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function GuestRoomPage() {
  const [guestName, setGuestName] = useState("");
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Check for existing booking on mount
  useEffect(() => {
    const checkExistingBooking = async () => {
      const supabase = createClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) return;
      const { data: bookings, error: bookingsError } = await supabase
        .from("bookings")
        .select("id")
        .eq("user_id", user.id)
        .limit(1);
      if (!bookingsError && bookings && bookings.length > 0) {
        router.push("/protected/guest-room/success");
      }
    };
    checkExistingBooking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromDate || !toDate) {
      setError("Please select both From and To dates.");
      return;
    }
    setIsLoading(true);
    setError(null);
    const supabase = createClient();
    try {
      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("User not authenticated");
      // Insert guest room booking
      const { error: insertError } = await supabase
        .from("bookings")
        .insert({
          user_id: user.id,
          guest_name: guestName,
          from_date: fromDate?.toISOString(),
          to_date: toDate?.toISOString(),
        });
      if (insertError) throw insertError;
      router.push("/protected/guest-room/success");
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

  return (
    <div className="flex flex-col gap-6 mt-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Guest Room Booking</CardTitle>
          <CardDescription>
            Fill the form to book a guest room.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="guestName">Guest Name</Label>
              <Input
                id="guestName"
                type="text"
                placeholder="Enter guest name"
                value={guestName}
                onChange={e => setGuestName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label>From Date <span className="text-red-500">*</span></Label>
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
            <div className="grid gap-2">
              <Label>To Date <span className="text-red-500">*</span></Label>
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
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
