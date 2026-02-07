"use client"; // Only if you're using Next.js, otherwise you can omit this
import { useState, useEffect, ReactNode } from "react";
import { DarkModeContext } from "./darkModeContext";

export function DarkModeProvider({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // On mount, read the user's saved theme from localStorage
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  /**
   * Toggles dark mode on/off, stores in localStorage, and updates the <html> class.
   */
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newVal = !prev;
      if (newVal) {
        localStorage.setItem("theme", "dark");
        document.documentElement.classList.add("dark");
      } else {
        localStorage.setItem("theme", "light");
        document.documentElement.classList.remove("dark");
      }
      return newVal;
    });
  };

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}
