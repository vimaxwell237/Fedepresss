// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',        // if you’re hosting at https://domain.com/ — adjust if in subfolder
  build: {
    outDir: 'dist', // default, but make explicit for clarity
    assetsDir: 'assets'
  }
});
