# Notas Rápidas — PWA con Vue.js

Aplicación Web Progresiva (PWA) hecha con **Vue 3 + Vite + vite-plugin-pwa**.

## Funcionalidades
1. Crear notas (título y contenido).
2. Editar y eliminar notas.
3. Ver la lista de notas guardadas localmente (`localStorage`), con búsqueda.
4. Usarla sin Internet: un *service worker* (Workbox) guarda en caché todos los archivos.
5. Se puede instalar en la pantalla de inicio como app nativa (manifiesto + botón "Instalar app").

## Estructura
```
notas-rapidas/
├── index.html
├── vite.config.js           ← configuración PWA (manifiesto + service worker)
├── public/                  ← íconos de la app
└── src/
    ├── main.js              ← monta Vue y registra el service worker
    ├── App.vue              ← pantalla principal, estado de conexión, instalar
    ├── style.css
    ├── composables/useNotas.js        ← crear, editar, eliminar, guardar localmente
    └── components/
        ├── NotaFormulario.vue         ← formulario de nueva nota / edición
        └── NotaTarjeta.vue            ← tarjeta de cada nota
```

## Cómo ejecutarla
Requisito: Node.js 18 o más reciente.

```bash
npm install
npm run dev        # desarrollo en http://localhost:5173
```

Para probar la PWA real (offline + instalar):
```bash
npm run build
npm run preview    # abre http://localhost:4173
```

## Cómo probar sin conexión
1. Abre la app en Chrome y espera a que cargue.
2. F12 → pestaña **Application** → **Service Workers**: debe aparecer activo.
3. En la pestaña **Network** marca **Offline** y recarga: la app sigue funcionando.

## Cómo instalarla en el celular
Los service workers solo funcionan en **HTTPS** o en `localhost`. Si abres la app desde el celular con la IP de tu computadora (`http://192.168.x.x`), **no** se podrá instalar.
Lo más fácil es publicar la carpeta `dist/` (después de `npm run build`) gratis en **Netlify** (arrastrar y soltar la carpeta en app.netlify.com/drop) o en **Vercel**. Luego:
- **Android (Chrome):** abrir el enlace → botón "Instalar app" o menú ⋮ → "Instalar aplicación".
- **iPhone (Safari):** botón Compartir → "Agregar a pantalla de inicio".
