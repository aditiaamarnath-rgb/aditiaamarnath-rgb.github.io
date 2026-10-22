import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const { LAUNCH_EDITOR } = loadEnv(mode, '.', 'LAUNCH_EDITOR')
  if (LAUNCH_EDITOR) process.env.LAUNCH_EDITOR = LAUNCH_EDITOR

  return {
  base: loadEnv(mode, '.', 'VITE_').VITE_BASE_PATH || '/',
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  }
})
