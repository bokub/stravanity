import { fileURLToPath, URL } from 'node:url';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        navigateFallbackDenylist: [/^\/api/],
      },
      includeAssets: ['favicon.ico', 'img/icons/apple-touch-icon.png', 'img/icons/mask-icon.svg'],
      manifest: {
        name: 'Stravanity',
        short_name: 'Stravanity',
        theme_color: '#fc5200',
        icons: [
          { src: './img/icons/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: './img/icons/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
          {
            src: './img/icons/android-chrome-maskable-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: './img/icons/android-chrome-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        start_url: '.',
        display: 'standalone',
        background_color: '#000000',
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
