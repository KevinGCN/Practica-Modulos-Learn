import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // proxy de desarrollo: /api local → tu Express en :3000 (sin CORS en dev)
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: p => p.replace(/^\/api/, ''),
      },
    },
  },
});
