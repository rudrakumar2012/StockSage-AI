// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'https://stocksage-ai.onrender.com/' // For development
    }
  },
  build: {
    outDir: 'dist'
  },
  define: {
    'process.env': {
      NODE_ENV: '"production"'
    }
  }
});
