import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

// Registro del service worker generado por vite-plugin-pwa
import { registerSW } from 'virtual:pwa-register'

registerSW({
  immediate: true,
  onOfflineReady() {
    console.log('Notas Rápidas lista para usarse sin conexión')
  }
})

createApp(App).mount('#app')
