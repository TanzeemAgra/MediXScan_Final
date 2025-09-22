import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const baseUrl = mode == "production" ? env.PUBLIC_URL : "/";

  return {
    base: baseUrl,
    plugins: [react()],
    server: {
      port: 5173,
      host: '0.0.0.0',
      open: true
    },
    build: {
      outDir: "build",
      minify: true,
      // Soft-coded asset handling - ignore missing assets in production
      rollupOptions: {
        onwarn(warning, warn) {
          // Ignore missing asset warnings for glass-card.png and other optional assets
          if (warning.code === 'UNRESOLVED_IMPORT' && warning.id?.includes('glass-card.png')) {
            return;
          }
          if (warning.message?.includes("didn't resolve at build time")) {
            return;
          }
          warn(warning);
        }
      }
    },
    define: {
      // Define process.env for browser compatibility
      'process.env': {
        NODE_ENV: JSON.stringify(mode),
      },
      // Define global process object
      global: 'globalThis',
    },
    optimizeDeps: {
      include: ['react', 'react-dom']
    }
  };
});