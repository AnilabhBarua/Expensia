import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
 preview: {
    allowedHosts: ["test.hackdays.online"],
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});