import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import manifest from './src/manifest.json';
import path from 'path';

export default defineConfig(({ mode }) => ({
  publicDir: 'public',
  plugins: [
    react(),
    crx({
      manifest,
      browser: 'chrome',
      contentScripts: {
        injectCss: true,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        popup: 'index.html',
      },
    },
    sourcemap: mode === 'development',
    minify: mode === 'production',
  },
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
  },
}));
