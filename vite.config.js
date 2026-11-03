import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => ({
  // GitHub Pages project sites are served from /<repository>/ instead of the
  // domain root. Production assets must use that prefix or they 404.
  // Update this if the repository is renamed.
  base: mode === "production" ? "/PokeDex/" : "/",
  plugins: [react(), tailwindcss()],
}));
