import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { metaImagesPlugin } from "./vite-plugin-meta-images";
import viteCompression from "vite-plugin-compression";

export default defineConfig({
  // Base path for GitHub Pages deployment
  // Set VITE_BASE_PATH env variable to your repo name (e.g., /HabitFlowTrackerPWA/)
  base: process.env.VITE_BASE_PATH || "/",
  plugins: [
    react(),
    runtimeErrorOverlay(),
    tailwindcss(),
    metaImagesPlugin(),
    // Compression for production builds
    viteCompression({
      algorithm: "brotliCompress",
      ext: ".br",
    }),
    viteCompression({
      algorithm: "gzip",
      ext: ".gz",
    }),
    ...(process.env.NODE_ENV !== "production" &&
      process.env.REPL_ID !== undefined
      ? [
        await import("@replit/vite-plugin-cartographer").then((m) =>
          m.cartographer(),
        ),
        await import("@replit/vite-plugin-dev-banner").then((m) =>
          m.devBanner(),
        ),
      ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
    },
  },
  css: {
    postcss: {
      plugins: [],
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          "vendor-react": ["react", "react-dom", "wouter"],
          // Heavy charting library
          "vendor-charts": ["recharts"],
          // Animation library
          "vendor-animation": ["framer-motion"],
          // Date utilities
          "vendor-date": ["date-fns"],
          // UI components - split into groups
          "vendor-ui-core": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-toast",
            "@radix-ui/react-tooltip",
          ],
          "vendor-ui-form": [
            "@radix-ui/react-checkbox",
            "@radix-ui/react-label",
            "@radix-ui/react-radio-group",
            "@radix-ui/react-select",
            "@radix-ui/react-slider",
            "@radix-ui/react-switch",
          ],
          // Utilities
          "vendor-utils": ["clsx", "tailwind-merge", "class-variance-authority"],
        },
      },
    },
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
