'use client';

import React, { useEffect, useState } from "react";

import { createClient } from "@/utils/supabase/client"
import { useUser } from "@/hooks/use-user";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function ProfileWidget() {
  const { user, updateUser } = useUser();

  const [fullName, setFullName] = useState(user?.full_name || "");
  const [entryNumber, setEntryNumber] = useState(user?.entry_no || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [roomNumber, setRoomNumber] = useState(user?.room_no || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ParseEntryNo = (email: string) => {
    const emailRoot = email.split('@')[0].toUpperCase();
    return "20" + emailRoot.slice(3, 5) + emailRoot.slice(0, 3) + emailRoot.slice(5, 9);
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (!user?.id) {
      setError("User not found.");
      setIsLoading(false);
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      setError("Invalid phone number.");
      setIsLoading(false);
      return;
    }

    const roomNumberRegex = /^[NSEW][A-H]\d{2}$/;
    if (!roomNumberRegex.test(roomNumber)) {
      setError("Invalid room number. Format: Wing(N,S,E,W) + Floor(A-H) + Room No. e.g., NA01");
      setIsLoading(false);
      return;
    }

    const profileData = {
      id: user.id,
      full_name: fullName,
      entry_no: entryNumber,
      phone: phone,
      room_no: roomNumber,
    };

    // Check if entry exists
    const { data: existing, error: fetchError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116: No rows found
      setError("Failed to check existing profile.");
      setIsLoading(false);
      return;
    }

    let upsertError = null;
    if (!existing) {
      // Insert new entry
      const { error: insertError } = await supabase
        .from('user_profiles')
        .insert([profileData]);
      upsertError = insertError;
    } else {
      // Update existing entry
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update(profileData)
        .eq('id', user.id);
      upsertError = updateError;
    }

    if (upsertError) {
      setError(upsertError.message);
    }
    
    setIsLoading(false);
    updateUser(); // Refresh user data
  }

  useEffect(() => {
    setEntryNumber(ParseEntryNo(user?.email || ""));
  }, [user?.email]);

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-2xl font-semibold">Your Profile:</h2>
      <form onSubmit={handleProfileUpdate} className='mt-3'>
        <div className="flex flex-col gap-6">
          <div className="grid gap-3">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={user?.email || ""}
              disabled
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="full-name">Full Name</Label>
            <Input
              id="full-name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="entry-number">Entry Number</Label>
            <Input
              id="entry-number"
              type="text"
              disabled
              value={entryNumber}
              onChange={(e) => setEntryNumber(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="numeric"
              minLength={10}
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="room-number">Room Number</Label>
            <Input
              id="room-number"
              type="text"
              placeholder="SB18"
              minLength={4}
              maxLength={4}
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value.toUpperCase())}
              required
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Profile"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
