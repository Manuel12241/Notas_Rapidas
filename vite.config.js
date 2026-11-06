import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
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
        theme_color: '#4f46e5',
        background_color: '#f5f5f7',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },

      // Workbox guarda en caché todos los archivos de la app (funciona offline)
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
        navigateFallback: '/index.html'
      },

      // Activa el service worker también con "npm run dev" para pruebas
      devOptions: {
        enabled: true
      }
    })
  ]
})
