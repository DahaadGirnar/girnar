'use client';

import { useEffect } from 'react';
import { useUser } from "@/hooks/use-user"

export default function PrivatePage() {
  const { user, updateUser, loading } = useUser();

  useEffect(() => {
    if (!user) {
      updateUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {loading && <p>Loading user data...</p>}
      {!loading && !user && <p>Please log in</p>}
      {!loading && user && <p>Welcome, {user.User.email}!</p>}
    </>
  );
}
