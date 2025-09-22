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