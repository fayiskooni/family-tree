import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

import { cloudflare } from "@cloudflare/vite-plugin";

import path from "path"

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(), cloudflare()],
//   define: {
//     BACKEND_URL: JSON.stringify(env.VITE_BACKEND_URL),
//   },
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
// })

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

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
  })
}