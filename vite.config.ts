import { webcrypto } from 'node:crypto';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import pkg from './package.json';

// Node 18 + workbox need Web Crypto for SW generation
const cryptoPolyfill = webcrypto as Crypto;
for (const g of [globalThis, global] as Record<string, unknown>[]) {
  if (!(g as { crypto?: Crypto }).crypto?.getRandomValues) {
    Object.defineProperty(g, 'crypto', {
      value: cryptoPolyfill,
      configurable: true,
      writable: true,
    });
  }
}

export default defineConfig({
  base: '/word-search/',
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
  plugins: [
    react(),
    VitePWA({
      // "prompt" lets us show Update now so users aren't forced mid-game
      registerType: 'prompt',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'WordSeek — Word Search',
        short_name: 'WordSeek',
        description: 'A premium word search puzzle experience',
        theme_color: '#08080d',
        background_color: '#08080d',
        display: 'standalone',
        orientation: 'any',
        start_url: '/word-search/',
        scope: '/word-search/',
        icons: [
          {
            src: 'pwa-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        // Production SW needs Web Crypto (Node 20+). Local Node 18 falls back safely.
        mode: Number(process.versions.node.split('.')[0]) >= 20 ? 'production' : 'development',
      },
    }),
  ],
});