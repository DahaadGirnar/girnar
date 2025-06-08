import Announcements from "@/components/announcements";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AnnouncementsManagementPage() {
  return (
    <div>
      <div className="flex flex-row mb-4 justify-between items-center">
        <h2 className="font-bold text-2xl">Announcements Management</h2>
        <Button asChild size="sm">
          <Link href="/protected/admin/announcements/add">New Announcement</Link>
        </Button>
      </div>
      <Announcements private={true} adminPrivalege={true} />
    </div>
  );
}
