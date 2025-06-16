import { defineConfig } from 'vite';
import { resolve } from 'path';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/Starter-Pack-With-Vite/',
  root: resolve(__dirname, 'src'),
  publicDir: resolve(__dirname, 'public'), // <--- Public directory
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    cssCodeSplit: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  plugins: [
    VitePWA({
      strategies: 'injectManifest',
      // Karena sw.js Anda berada di publicDir, dan publicDir akan disalin ke root outDir,
      // Workbox harus mencari sw.js di outDir yang dihasilkan.
      // Dengan 'injectManifest', Workbox akan mengurus penyalinan file SW sumber.
      // Jadi, srcDir harus relatif ke root proyek jika SW ada di folder public.
      srcDir: resolve(__dirname, 'public'), // <--- UBAH INI: Path ABSOLUT atau RELATIF KE ROOT PROYEK
      filename: 'sw.js', // Tetap nama filenya

      // PASTIKAN TIDAK ADA BLOK 'workbox: { ... }' LAIN DI SINI.
      // Semua konfigurasi caching Workbox harus ada di sw.js manual Anda.

      includeAssets: [
        'favicon.ico',
        'apple-touch-icon.png',
        'masked-icon.svg',
        // Path aset ini sudah relatif ke publicDir secara default oleh Vite
        'images/logo.png',
        'images/icons/icon-192x192.png',
        'images/icons/icon-512x512.png',
        // Jika styles ada di src/, maka biarkan seperti ini.
        // Jika styles ada di public/, maka pastikan Vite mengidentifikasinya dengan benar.
        'styles/styles.css',
        'styles/responsives.css',
        'styles/leaflet.css',
        'manifest.webmanifest',
      ],
      manifest: {
        name: 'Story App',
        short_name: 'StoryApp',
        description: 'Aplikasi berbagi cerita dengan notifikasi',
        theme_color: '#4f46e5',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: 'images/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'images/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      devOptions: {
        enabled: true,
        type: 'module',
        navigateFallback: 'index.html'
      },
    }),
  ],
  server: {
    port: 3000,
    open: true,
    https: false
  }
});