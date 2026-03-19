import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), tailwindcss()],

    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
        'formdata-polyfill': path.resolve(__dirname, 'src/empty.js'),
        'node-fetch': path.resolve(__dirname, 'src/empty.js'),
        'fetch-blob': path.resolve(__dirname, 'src/empty.js'),
        'formdata-node': path.resolve(__dirname, 'src/empty.js'),
        'cross-fetch': path.resolve(__dirname, 'src/empty.js'),
        'isomorphic-fetch': path.resolve(__dirname, 'src/empty.js'),
        'whatwg-fetch': path.resolve(__dirname, 'src/empty.js'),
        'undici': path.resolve(__dirname, 'src/empty.js'),
      },
    },

    optimizeDeps: {
      exclude: [
        'node-fetch',
        'formdata-polyfill',
        'fetch-blob',
        'formdata-node',
        'cross-fetch',
        'isomorphic-fetch',
        'whatwg-fetch',
        'undici'
      ],
    },

    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
