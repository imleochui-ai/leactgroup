import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    // ⭐ Cloudflare Pages 一定要 root
    base: '/',

    plugins: [
      react(),
      tailwindcss(),
    ],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './'),
      },
    },

    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },

    build: {
      outDir: 'dist',
      sourcemap: false,
      emptyOutDir: true,
    },

    // Vite 正確讀取方式（不要用 process.env）
    define: {
      'import.meta.env.APP_ENV': JSON.stringify(env.APP_ENV),
    },
  }
})
