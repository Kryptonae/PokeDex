import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { ThemeProvider } from "./componenets/theme-provider";
import "./index.css";

// ThemeProvider wraps the whole app so the navbar toggle and every page
// component read from the same theme state.
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
);
