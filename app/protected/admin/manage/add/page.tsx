"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AddAdminPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    const supabase = createClient();

    try {
      // Check if user exists
      const { data, error: selectError } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("email", email)
        .single();

      if (selectError || !data) {
        setError("User with this email not found.");
        return;
      }

      // Update admin property
      const { error: updateError } = await supabase
        .from("user_profiles")
        .update({ admin: true })
        .eq("id", data.id);

      if (updateError) {
        setError("Failed to update admin status.");
        return;
      }

      router.push("/protected/admin/manage");
    } catch {
      setError("An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex flex-col gap-6'>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Add Admin</CardTitle>
          <CardDescription>
            Enter the email of the user you want to make an admin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddAdmin} className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Processing..." : "Make Admin"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
