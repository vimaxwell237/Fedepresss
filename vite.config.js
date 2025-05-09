// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // tell Vite to write into ../dist (one level up)
  build: {
    outDir: '../dist',
    emptyOutDir: true
  }
})
