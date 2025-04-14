
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  optimizeDeps: {
    include: ['three', 'zustand', 'use-sync-external-store'],
    exclude: ['@react-three/fiber']
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "zustand": path.resolve(__dirname, "node_modules/zustand"),
      "use-sync-external-store": path.resolve(__dirname, "node_modules/use-sync-external-store"),
    },
    dedupe: ['three', 'react', 'react-dom', 'zustand', 'use-sync-external-store']
  },
}));
