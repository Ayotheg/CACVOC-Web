import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // `npm run dev` can't run the files in api/, so it asks the live site instead.
  server: { proxy: { '/api': { target: 'https://cacvoc-web.vercel.app', changeOrigin: true } } },
})
