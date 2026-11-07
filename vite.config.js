import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  // Redirige /api al servidor Express (server/index.js) que habla con PostgreSQL
  server: { proxy: { '/api': 'http://localhost:3000' } },
  preview: { proxy: { '/api': 'http://localhost:3000' } },
  plugins: [
    vue(),
    VitePWA({
      // El service worker se actualiza solo cuando hay una versión nueva
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],

      // Manifiesto: permite "Agregar a pantalla de inicio" como app nativa
      manifest: {
        name: 'Notas Rápidas',
        short_name: 'Notas',
        description: 'Crea, edita y elimina notas, incluso sin conexión a Internet.',
        lang: 'es',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        theme_color: '#1a1a1a',
        background_color: '#f6f6f3',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },

      // Workbox guarda en caché todos los archivos de la app (funciona offline)
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
        navigateFallback: '/index.html',
        // Las llamadas a la API nunca se sirven desde la caché
        navigateFallbackDenylist: [/^\/api/]
      },

      // Activa el service worker también con "npm run dev" para pruebas
      devOptions: {
        enabled: true
      }
    })
  ]
})
