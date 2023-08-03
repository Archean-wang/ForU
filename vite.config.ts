import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  base: "/ForU/",
  plugins: [react()],
  clearScreen: false,
  server: {
    port: 12138,
    strictPort: true,
  },
  envPrefix: ["VITE_"],
}));
