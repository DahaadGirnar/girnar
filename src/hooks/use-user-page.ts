import {
  createContext,
  createElement,
  useContext,
  useState,
  type ReactNode,
} from "react";

import { UserPageSection, UserPageSubsection } from "@/models/UserPageSections";

type UserPageContextType = {
  section: UserPageSection;
  setSection: (section: UserPageSection) => void;
  subsection: UserPageSubsection | null;
  setSubsection: (subsection: UserPageSubsection | null) => void;
};

const UserPageContext = createContext<UserPageContextType | undefined>(undefined);

export function UserPageProvider({ children }: { children: ReactNode }) {
  const [section, setSection] = useState<UserPageSection>(UserPageSection.General);
  const [subsection, setSubsection] = useState<UserPageSubsection | null>(null);

  return createElement(
    UserPageContext.Provider,
    { value: { section, setSection, subsection, setSubsection } },
    children
  );
}

export function useUserPage() {
  const context = useContext(UserPageContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
