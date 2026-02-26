import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig(({ mode }) => {
  // 讀取 .env 變數
  const env = loadEnv(mode, process.cwd(), '')

  return {
    // ⭐ GitHub Pages 子路徑
    base: '/leactgroup/',

    plugins: [
      react(),
      tailwindcss(),
    ],

    // ⭐ 建議使用 import.meta.env 而不是 process.env
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './'),
      },
    },

    server: {
      // Codespaces / AI Studio 兼容
      hmr: process.env.DISABLE_HMR !== 'true',
    },

    build: {
      outDir: 'dist',
      sourcemap: false,
    },
  }
})
