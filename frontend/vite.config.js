import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

import { cloudflare } from "@cloudflare/vite-plugin";

import path from "path";

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const backendUrl = env.VITE_BACKEND_URL || "http://localhost:5001/api/auth";
  let proxyTarget = "http://localhost:5001";

  try {
    proxyTarget = new URL(backendUrl).origin;
  } catch {
    proxyTarget = "http://localhost:5001";
  }

  return defineConfig({
    plugins: [react(), cloudflare()],
    define: {
      BACKEND_URL: JSON.stringify(env.VITE_BACKEND_URL),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: proxyTarget,
          changeOrigin: true,
          secure: true,
        },
      },
    },
  });
};
