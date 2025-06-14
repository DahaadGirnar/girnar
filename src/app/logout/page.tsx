'use client';

import { signout } from "@/utils/supabase/actions";
import { useEffect } from "react";

export default function LogOutPage() {
  // Call signout on mount
  useEffect(() => {
    signout();
  }, []);

  return (
    <div>
      <p>Signing you out...</p>
    </div>
  );
}
