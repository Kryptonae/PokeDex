import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ThemeContext } from "./theme-context";

const STORAGE_KEY = "theme";

function getStoredTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "dark" || stored === "light") {
      return stored;
    }
  } catch {
    // Ignore storage errors (private mode / blocked storage).
  }

  return null;
}

function getInitialTheme() {
  if (typeof document === "undefined") {
    return "light";
  }

  if (document.documentElement.classList.contains("dark")) {
    return "dark";
  }

  const stored = getStoredTheme();
  if (stored) {
    return stored;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getInitialTheme);

  const setTheme = useCallback((nextTheme) => {
    if (nextTheme !== "light" && nextTheme !== "dark") {
      return;
    }

    setThemeState(nextTheme);
    try {
      localStorage.setItem(STORAGE_KEY, nextTheme);
    } catch {
      // Ignore storage errors (private mode / blocked storage).
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
  }, [theme]);

  useEffect(() => {
    const onStorage = (event) => {
      if (
        event.key === STORAGE_KEY &&
        (event.newValue === "light" || event.newValue === "dark")
      ) {
        setThemeState(event.newValue);
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (event) => {
      if (getStoredTheme()) {
        return;
      }

      setThemeState(event.matches ? "dark" : "light");
    };

    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
