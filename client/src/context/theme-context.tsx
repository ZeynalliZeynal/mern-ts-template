"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export type Themes = "device" | "dark" | "light";

interface ThemeSwitcherContext {
  theme: Themes;
  changeTheme: (theme: Themes) => void;
}

const ThemeSwitcherContext = createContext<ThemeSwitcherContext | null>(null);

export const useThemeSwitcher = () => {
  const context = useContext(ThemeSwitcherContext);
  if (!context) throw new Error("Context is outside of the provider");
  return context;
};

export const ThemeSwitcher = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Themes>("device");

  const changeTheme = (theme: Themes) => {
    setTheme(theme);
    localStorage.setItem("theme", JSON.stringify(theme));
  };
  useEffect(() => {
    if (localStorage.getItem("theme")) {
      setTheme(JSON.parse(localStorage.getItem("theme") as string));
    }
  }, [theme]);

  useEffect(() => {
    if (theme === "device") {
      if (window.matchMedia("(prefers-color-scheme:dark)").matches) {
        if (!document.documentElement.className.includes("dark"))
          document.documentElement.classList.add("dark");
      } else document.documentElement.classList.remove("dark");
    } else if (theme === "dark") {
      if (!document.documentElement.className.includes("dark"))
        document.documentElement.classList.add("dark");
    } else document.documentElement.classList.remove("dark");
  }, [theme]);

  return (
    <ThemeSwitcherContext.Provider
      value={{
        theme,
        changeTheme,
      }}
    >
      {children}
    </ThemeSwitcherContext.Provider>
  );
};
