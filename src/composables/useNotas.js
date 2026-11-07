import { ref, watch } from 'vue'

const CLAVE = 'notas-rapidas'
const CLAVE_PENDIENTES = 'notas-rapidas-pendientes'
const API = '/api/notas'

// Fecha de hoy en formato YYYY-MM-DD (hora local)
export function hoy() {
  const d = new Date()
  const mes = String(d.getMonth() + 1).padStart(2, '0')
  const dia = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mes}-${dia}`
}

function leer(clave) {
  try {
    return JSON.parse(localStorage.getItem(clave)) || []
  } catch {
    return []
  }
}

// Copia local de las notas (para mostrarlas al instante y sin Internet)
function cargarCache() {
  return leer(CLAVE).map((n) => ({
    id: n.id,
    titulo: n.titulo || '',
    contenido: n.contenido || '',
    fecha: n.fecha ? String(n.fecha).slice(0, 10) : hoy()
  }))
}

async function pedir(metodo, url, cuerpo) {
  const res = await fetch(url, {
    method: metodo,
    headers: cuerpo ? { 'Content-Type': 'application/json' } : undefined,
    body: cuerpo ? JSON.stringify(cuerpo) : undefined
  })
  if (!res.ok) throw new Error(`Error ${res.status} en ${metodo} ${url}`)
  return res.status === 204 ? null : res.json()
}

/**
 * Lógica de las notas, guardadas en PostgreSQL (tabla "notas") a través de la API.
 * Cada nota tiene: id, titulo, contenido, fecha (YYYY-MM-DD).
 *
 * - Los cambios se muestran al momento y se envían al servidor.
 * - Si no hay conexión, se guardan en una cola local y se envían
 *   automáticamente cuando vuelve la conexión.
 */
export function useNotas() {
  const notas = ref(cargarCache())
  const conectado = ref(false)
  let pendientes = leer(CLAVE_PENDIENTES)

  // Primera vez con base de datos: subir las notas que ya existían en este dispositivo
  if (!localStorage.getItem('notas-rapidas-migradas')) {
    pendientes.push(...notas.value.map((nota) => ({ tipo: 'guardar', nota: { ...nota } })))
    localStorage.setItem(CLAVE_PENDIENTES, JSON.stringify(pendientes))
    localStorage.setItem('notas-rapidas-migradas', '1')
  }

  watch(notas, (valor) => localStorage.setItem(CLAVE, JSON.stringify(valor)), {
    deep: true
  })

  function guardarPendientes() {
    localStorage.setItem(CLAVE_PENDIENTES, JSON.stringify(pendientes))
  }

  function ejecutar(op) {
    if (op.tipo === 'eliminar') return pedir('DELETE', `${API}/${encodeURIComponent(op.id)}`)
    return pedir('PUT', `${API}/${encodeURIComponent(op.nota.id)}`, op.nota)
  }

  // Envía al servidor las operaciones que quedaron pendientes, en orden
  async function sincronizar() {
    while (pendientes.length) {
      await ejecutar(pendientes[0])
      pendientes.shift()
      guardarPendientes()
    }
  }

  // Sincroniza pendientes y trae la lista actualizada desde la base de datos
  async function recargar() {
    try {
      await sincronizar()
      notas.value = await pedir('GET', API)
      conectado.value = true
    } catch (err) {
      conectado.value = false
      console.warn('Sin conexión con la base de datos, usando copia local.', err)
    }
  }

  async function enviar(op) {
    pendientes.push(op)
    guardarPendientes()
    try {
      await sincronizar()
      conectado.value = true
    } catch {
      conectado.value = false // queda en la cola y se reintenta luego
    }
  }

  function crearNota(titulo, contenido, fecha) {
    const nota = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      titulo: titulo.trim(),
      contenido: contenido.trim(),
      fecha: fecha || hoy()
    }
    notas.value.unshift(nota)
    enviar({ tipo: 'guardar', nota: { ...nota } })
  }

  function editarNota(id, titulo, contenido, fecha) {
    const nota = notas.value.find((n) => n.id === id)
    if (!nota) return
    nota.titulo = titulo.trim()
    nota.contenido = contenido.trim()
    nota.fecha = fecha || nota.fecha
    enviar({ tipo: 'guardar', nota: { ...nota } })
  }

  function eliminarNota(id) {
    notas.value = notas.value.filter((n) => n.id !== id)
    enviar({ tipo: 'eliminar', id })
  }

  recargar()
  window.addEventListener('online', recargar)

  return { notas, conectado, crearNota, editarNota, eliminarNota, recargar }
}
