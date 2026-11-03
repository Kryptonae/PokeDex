import { useContext } from "react";
import { ThemeContext } from "./theme-context";

// Small guard rail: a missing provider is a setup mistake, so fail loudly
// instead of silently rendering with an undefined theme.
export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
