import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, "electron-src/main/index.ts"),
        },
      },
    },
  },
  preload: {
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, "electron-src/preload/index.ts"),
        },
      },
    },
  },
  renderer: {
    plugins: [react()],
    server: {
      port: 9527,
      strictPort: true,
    },
    envPrefix: ["VITE_"],
    root: ".",
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, "index.html"),
        },
      },
    },
  },
});