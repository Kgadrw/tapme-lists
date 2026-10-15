import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      react: "preact/compat",
      "react-dom": "preact/compat",
      "react-dom/client": "preact/compat/client",
      "react/jsx-runtime": "preact/jsx-runtime",
    },
  },
  appType: "spa",
  server: {
    host: true,
    port: 5173,
  },
  preview: {
    host: true,
    port: 4173,
  },
  build: {
    target: "es2020",
    cssMinify: true,
    minify: "esbuild",
    modulePreload: {
      polyfill: false,
    },
    reportCompressedSize: false,
    assetsInlineLimit: 4096,
  },
  esbuild: {
    legalComments: "none",
  },
});
