import { ref, watch } from 'vue'

const CLAVE = 'notas-rapidas'

// Lee las notas guardadas en el dispositivo (localStorage)
function cargar() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE)) || []
  } catch {
    return []
  }
}

/**
 * Lógica de las notas: crear, editar, eliminar y guardar localmente.
 * Cada cambio se guarda automáticamente en localStorage, así que las
 * notas siguen ahí aunque se cierre la app o no haya Internet.
 */
export function useNotas() {
  const notas = ref(cargar())

  watch(
    notas,
    (valor) => localStorage.setItem(CLAVE, JSON.stringify(valor)),
    { deep: true }
  )

  function crearNota(titulo, contenido) {
    notas.value.unshift({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      titulo: titulo.trim(),
      contenido: contenido.trim(),
      fecha: new Date().toISOString()
    })
  }

  function editarNota(id, titulo, contenido) {
    const nota = notas.value.find((n) => n.id === id)
    if (nota) {
      nota.titulo = titulo.trim()
      nota.contenido = contenido.trim()
      nota.fecha = new Date().toISOString()
    }
  }

  function eliminarNota(id) {
    notas.value = notas.value.filter((n) => n.id !== id)
  }

  return { notas, crearNota, editarNota, eliminarNota }
}
