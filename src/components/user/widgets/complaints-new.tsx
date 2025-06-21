'use client';

import { useState } from "react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { useUser } from "@/hooks/use-user";
import { UserPageSection, UserPageSubsection } from "@/models/UserPageSections";
import { useUserPage } from "@/hooks/use-user-page";
import { createClient } from "@/utils/supabase/client";

export default function NewComplaintsWidget() {
  const { user } = useUser();
  const { setSection, setSubsection } = useUserPage();

  const CATEGORY_OPTIONS = [
    { value: "Maintenance", label: "Maintenance" },
    { value: "Mess", label: "Mess" },
    { value: "Other", label: "Other" },
  ];

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0].value);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const lodgeComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const supabase = createClient();

    try {
      // Insert complaint
      const { error: insertError } = await supabase
        .from("complaints")
        .insert({
          user_id: user?.id,
          title,
          description,
          category,
          // status is default 'Pending'
        });
      if (insertError) throw insertError;

      // Send email notification to admins
      try {
        const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
          ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
          : "http://localhost:3000";
        
        const mailResponse = await fetch(`${baseUrl}/api/user-emails?admin=true`);
        if (!mailResponse.ok) {
          throw new Error("Failed to fetch admin emails");
        }
        const { users } = await mailResponse.json();
        const adminEmails = users.map((user: { email: string }) => user.email);

        await fetch(`${baseUrl}/api/mail`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: adminEmails,
            subject: "New Complaint Lodged",
            text: `A new complaint has been lodged by ${user?.full_name} (${user?.entry_no}).\n\nTitle: ${title}\nCategory: ${category}\nDescription: ${description}\n\nPlease review it in the admin panel.`,
          })
        });

      } catch (emailError) {
        console.error("Failed to send complaint email:", emailError);
      }

      setSection(UserPageSection.Complaints);
      setSubsection(UserPageSubsection.Existing);
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

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-2xl font-semibold">Register new Complaint</h2>
      <form onSubmit={lodgeComplaint} className='mt-3'>
        <div className="flex flex-col gap-6">
          <div className="flex gap-6">
            <div className="flex-1 grid gap-3">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                type="text"
                placeholder="Complaint Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="w-32 grid gap-3">
              <Label htmlFor="category">Category</Label>
              <DropdownMenu open={categoryOpen} onOpenChange={setCategoryOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="justify-between"
                  >
                    {
                      CATEGORY_OPTIONS.find(
                        (opt) => opt.value === category
                      )?.label
                    }
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {CATEGORY_OPTIONS.map((opt) => (
                    <DropdownMenuItem
                      key={opt.value}
                      onSelect={() => {
                        setCategory(opt.value);
                        setCategoryOpen(false);
                      }}
                    >
                      {opt.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Complaint Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Lodging..." : "Lodge"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
