import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    // ⭐ GitHub Pages 必需（重要）
    // 若 repo 名稱是 leactgroup
    base: "/leactgroup/",

    plugins: [
      react(),
      tailwindcss(),
    ],

    define: {
      "process.env.GEMINI_API_KEY": JSON.stringify(env.GEMINI_API_KEY),
    },

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },

    server: {
      port: 3000,
      open: true,

      // AI Studio / Codespaces 兼容
      hmr: process.env.DISABLE_HMR !== "true",
    },

    build: {
      outDir: "dist",
      sourcemap: false,
    },
  };
});
