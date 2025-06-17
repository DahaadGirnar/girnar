import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { UserPageSection, UserPageSubsection } from "@/models/UserPageSections";
import { useUserPage } from "@/hooks/use-user-page";

export default function AdminManagementNew() {
  const [emails, setEmails] = useState<{ id: string; email: string }[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [currentEmail, setCurrentEmail] = useState<{ id: string; email: string }>({ id: "", email: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const { setSection, setSubsection } = useUserPage();

  const makeAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();

    try {
      const { error } = await supabase
        .from("user_profiles")
        .update({ admin: true })
        .eq("id", currentEmail.id);

      if (error) throw error;
      setSection(UserPageSection.AdminManagement);
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
      setLoading(false);
    }
  }

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      // Fetch emails from API
      let emails: { id: string; email: string }[] = [];
      try {
        const res = await fetch("/api/user-emails");
        if (res.ok) {
          const json = await res.json();
          emails = json.users || [];
        }
      } catch (e) {
        setError(`Failed to fetch user emails: ${(e as Error).message}`);
      }

      setEmails(emails);
      setLoading(false);
    }

    fetchUsers();
  }, []);

  useEffect(() => {
    if (currentEmail.email) {
      const filteredSuggestions = emails
        .filter(user => user.email.toLowerCase().startsWith(currentEmail.email.toLowerCase()))
        .map(user => user.email);
      setSuggestions(filteredSuggestions);
      console.log("Suggestions:", filteredSuggestions);
    } else {
      setSuggestions([]);
    }

    const matched = emails.find(user => user.email === currentEmail.email);
    if (matched && matched.id !== currentEmail.id) {
      setCurrentEmail({ id: matched.id, email: matched.email });
    } else if (!matched && currentEmail.id !== "") {
      setCurrentEmail({ id: "", email: currentEmail.email });
    }
  }, [emails, currentEmail]);

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-2xl font-semibold">Make new Admin</h2>
      <form onSubmit={makeAdmin} className='mt-3'>
        <div className="flex flex-col gap-6">
          <div className="grid gap-3">
            <Label htmlFor="email">New Admin Email:</Label>
            <div className="relative">
              <Input
                id="email"
                type="text"
                placeholder="Admin Email"
                value={currentEmail.email}
                onChange={(e) => setCurrentEmail({ id: currentEmail.id, email: e.target.value })}
              />
              {(suggestions.length > 0 && suggestions[0] !== currentEmail.email) && (
                <div className="absolute left-0 right-0 top-full z-10 mt-1 w-full rounded-md border bg-background shadow-md">
                  {suggestions.map((email) => (
                    <div
                      key={email}
                      onClick={() => setCurrentEmail({ id: "", email })}
                      className="cursor-pointer px-4 py-2 text-sm hover:bg-muted"
                    >
                      {email}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={loading}>
              Make Admin
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
