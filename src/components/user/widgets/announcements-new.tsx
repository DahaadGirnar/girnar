'use client';

import { useState } from "react";
import { useUser } from "@/hooks/use-user";
import { createClient } from "@/utils/supabase/client";

import { UserPageSection, UserPageSubsection } from "@/models/UserPageSections";
import { useUserPage } from "@/hooks/use-user-page";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

export default function NewAnnouncementsWidget() {
  const { user } = useUser();
  const { setSection, setSubsection } = useUserPage();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const makeAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const supabase = createClient();

    try {
      const { error: insertError } = await supabase
        .from("announcements")
        .insert({
          title,
          description,
          is_public: isPublic,
          user_id: user?.id,
        });
      if (insertError) throw insertError;

      setSection(UserPageSection.Announcements);
      setSubsection(UserPageSubsection.Existing);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-2xl font-semibold">Your Profile:</h2>
      <form onSubmit={makeAnnouncement} className="mt-4">
        <div className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              type="text"
              placeholder="Announcement title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Announcement description"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="is_public"
              checked={isPublic}
              onCheckedChange={(checked) => setIsPublic(!!checked)}
            />
            <Label htmlFor="is_public">Public</Label>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Saving..." : "Create"}
          </Button>
        </div>
      </form>
    </div>
  );
}
