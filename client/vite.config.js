import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Setting the alias "@" to refer to the "src" directory
      '@': path.resolve(__dirname, './src'),
    },
  },
});
