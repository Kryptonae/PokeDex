import { createContext } from "react";

// Kept in a separate module so the provider file only exports components,
// which keeps React Fast Refresh working during development.
export const ThemeContext = createContext(null);
