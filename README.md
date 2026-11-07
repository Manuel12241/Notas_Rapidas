# Notas Rápidas — PWA con Vue.js

Aplicación Web Progresiva (PWA) hecha con **Vue 3 + Vite + vite-plugin-pwa**.

## Funcionalidades
1. Crear notas (título y contenido).
2. Editar y eliminar notas.
3. Ver la lista de notas guardadas en **PostgreSQL** (base de datos `Notas Rapidas`), con búsqueda. Sin conexión se guardan en `localStorage` y se envían solas al volver la conexión.
4. Usarla sin Internet: un *service worker* (Workbox) guarda en caché todos los archivos.
5. Se puede instalar en la pantalla de inicio como app nativa (manifiesto; desde el menú del navegador).

## Estructura
```
notas-rapidas/
├── index.html
├── .env                     ← datos de conexión a PostgreSQL (no se sube a git)
├── server/
│   ├── db.js                ← conexión (pool) a PostgreSQL
│   └── index.js             ← API Express: GET/PUT/DELETE /api/notas
├── vite.config.js           ← configuración PWA (manifiesto + service worker)
├── public/                  ← íconos de la app
└── src/
    ├── main.js              ← monta Vue y registra el service worker
    ├── App.vue              ← pantalla principal
    ├── style.css
    ├── composables/useNotas.js        ← crear, editar, eliminar, guardar localmente
    └── components/
        ├── NotaFormulario.vue         ← formulario de nueva nota / edición
        └── NotaTarjeta.vue            ← tarjeta de cada nota
```

## Base de datos
En pgAdmin, dentro de la base `Notas Rapidas`, crear la tabla:
```sql
CREATE TABLE notas (
    id        VARCHAR(20)  PRIMARY KEY,
    titulo    VARCHAR(80)  NOT NULL DEFAULT '',
    contenido TEXT         NOT NULL DEFAULT '',
    fecha     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
```
Los datos de conexión están en `.env` (copia `.env.example` si no existe).

## Cómo ejecutarla
Requisito: Node.js 20.6 o más reciente.

```bash
npm install
npm run dev        # API (puerto 3000) + app en http://localhost:5173
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
- **Android (Chrome):** abrir el enlace → menú ⋮ → "Instalar aplicación".
- **iPhone (Safari):** botón Compartir → "Agregar a pantalla de inicio".
