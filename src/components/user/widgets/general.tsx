'use client';

import { AlertCircleIcon } from "lucide-react"

import { useUser } from "@/hooks/use-user";
import { useUserPage } from "@/hooks/use-user-page";
import { UserPageSection } from "@/models/UserPageSections";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

export default function GeneralWidget() {
  const { user } = useUser();
  const { setSection } = useUserPage();

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-2xl font-semibold">Welcome, {user?.full_name ?? user?.email}!</h2>
      {!user?.profile_created && (
        <Alert>
          <AlertCircleIcon />
          <AlertTitle>Profile not created</AlertTitle>
          <AlertDescription>
            Please complete your profile to access all features.{" "}
            <span
              className="font-semibold underline cursor-pointer"
              onClick={() => {setSection(UserPageSection.Profile)}}
            >
              Go here to complete your profile.
            </span>
          </AlertDescription>
        </Alert>
      )}
      {user?.profile_created && !user?.verified && (
        <Alert>
          <AlertCircleIcon />
          <AlertTitle>Profile not verified</AlertTitle>
          <AlertDescription>
            Wait for admin verification to access all features. If you have any questions, please contact the admin.
          </AlertDescription>
        </Alert>
      )}
      {(user?.profile_created && user?.verified) && (
        <div className="ml-4 text-sm text-muted-foreground">
          <strong>Email:</strong> {user?.email || "Not provided"}<br />
          <strong>Room No.:</strong> {user?.room_no || "Not provided"}<br />
          <strong>Phone:</strong> {user?.phone || "Not provided"}
        </div>
      )}
    </div>
  );
}
