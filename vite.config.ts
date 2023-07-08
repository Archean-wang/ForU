import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [react()],
  clearScreen: false,
  server: {
    host: '0.0.0.0',
    port: 12138,
    strictPort: true,
  },
  envPrefix: ["VITE_"],
}));
