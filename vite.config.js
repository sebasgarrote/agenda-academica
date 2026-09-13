import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // SPA fallback para hosting estáticos (Vercel, Netlify, Cloudflare Pages, etc.)
  // Para que rutas como /calendar redirijan a index.html
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})
