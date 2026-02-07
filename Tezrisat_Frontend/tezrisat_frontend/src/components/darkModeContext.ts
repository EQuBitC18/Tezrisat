import { createContext, useContext } from "react";

export type DarkModeContextType = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
};

export const DarkModeContext = createContext<DarkModeContextType>({
  isDarkMode: false,
  toggleDarkMode: () => {},
});

export function useDarkModeContext() {
  return useContext(DarkModeContext);
}
