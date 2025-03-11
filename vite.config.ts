
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
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Add optimizeDeps configuration to avoid ESM issues
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020'
    }
  },
  // Ensure the project uses ES2020 features minimum
  build: {
    target: 'es2020'
  }
}));
