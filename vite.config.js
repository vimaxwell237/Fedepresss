// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // adjust if you’re deploying to a sub-path
  build: {
    // this will output into "<project-root>/dist"
    outDir: 'dist',
    emptyOutDir: true,
    // optional: put JS/CSS/assets under "assets/" inside dist
    assetsDir: 'assets',
  }
});
