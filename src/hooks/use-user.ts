import {
  createContext,
  createElement,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

import { createClient } from '@/utils/supabase/client'
import { UserModel } from "@/models/user";

export interface UserContextType {
  user: UserModel | null;
  setUser: (user: UserModel | null) => void;
  loading: boolean;
  updateUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const getUser = async () => {
  const supabase = createClient()

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    return null;
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();

  if (!profile) {
    return {
      id: data.user.id,
      email: data.user.email,
      profile_created: false,
    }
  }

  return {
    id: data.user.id,
    email: data.user.email,
    profile_created: true,
    ...profile,
  };
};

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserModel | null>(null);
  const [updateUser, setUpdateUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!updateUser) return;
    setLoading(true);
    (async () => {
      setUser(await getUser());
      setLoading(false);
    })();
    setUpdateUser(false);
  }, [updateUser]);

  return createElement(
    UserContext.Provider,
    { value: { user, setUser, loading, updateUser: () => setUpdateUser(true) } },
    children
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
