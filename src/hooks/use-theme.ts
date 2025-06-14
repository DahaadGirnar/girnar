import {
  createContext,
  createElement,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

export interface ThemeContextType {
  isDark: boolean;
  setIsDark: (isDark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const root = document.getElementById("root");
    if (!root) return;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  return createElement(
    ThemeContext.Provider,
    { value: { isDark, setIsDark } },
    children
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
