<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import NotaFormulario from './components/NotaFormulario.vue'
import NotaTarjeta from './components/NotaTarjeta.vue'
import { useNotas } from './composables/useNotas'

const { notas, crearNota, editarNota, eliminarNota } = useNotas()

const notaEditando = ref(null)
const busqueda = ref('')

// ---- Crear / editar / eliminar ----
function guardar({ titulo, contenido }) {
  if (notaEditando.value) {
    editarNota(notaEditando.value.id, titulo, contenido)
    notaEditando.value = null
  } else {
    crearNota(titulo, contenido)
  }
}

function seleccionarParaEditar(nota) {
  notaEditando.value = nota
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function borrar(id) {
  if (confirm('¿Eliminar esta nota?')) {
    eliminarNota(id)
    if (notaEditando.value?.id === id) notaEditando.value = null
  }
}

// ---- Visualizar (con búsqueda) ----
const notasFiltradas = computed(() => {
  const q = busqueda.value.toLowerCase().trim()
  if (!q) return notas.value
  return notas.value.filter(
    (n) => n.titulo.toLowerCase().includes(q) || n.contenido.toLowerCase().includes(q)
  )
})

// ---- Estado de conexión ----
const enLinea = ref(navigator.onLine)
const actualizarConexion = () => (enLinea.value = navigator.onLine)

// ---- Botón "Instalar app" ----
const eventoInstalacion = ref(null)
function guardarEventoInstalacion(e) {
  e.preventDefault()
  eventoInstalacion.value = e
}
async function instalar() {
  if (!eventoInstalacion.value) return
  eventoInstalacion.value.prompt()
  await eventoInstalacion.value.userChoice
  eventoInstalacion.value = null
}
const quitarBotonInstalar = () => (eventoInstalacion.value = null)

onMounted(() => {
  window.addEventListener('online', actualizarConexion)
  window.addEventListener('offline', actualizarConexion)
  window.addEventListener('beforeinstallprompt', guardarEventoInstalacion)
  window.addEventListener('appinstalled', quitarBotonInstalar)
})

onUnmounted(() => {
  window.removeEventListener('online', actualizarConexion)
  window.removeEventListener('offline', actualizarConexion)
  window.removeEventListener('beforeinstallprompt', guardarEventoInstalacion)
  window.removeEventListener('appinstalled', quitarBotonInstalar)
})
</script>

<template>
  <header class="barra">
    <h1>📝 Notas Rápidas</h1>
    <div class="barra-derecha">
      <span class="estado" :class="enLinea ? 'online' : 'offline'">
        {{ enLinea ? 'En línea' : 'Sin conexión' }}
      </span>
      <button v-if="eventoInstalacion" class="btn instalar" @click="instalar">
        Instalar app
      </button>
    </div>
  </header>

  <main class="contenedor">
    <NotaFormulario
      :nota-editando="notaEditando"
      @guardar="guardar"
      @cancelar="notaEditando = null"
    />

    <section>
      <div class="encabezado-lista">
        <h2>Mis notas ({{ notas.length }})</h2>
        <input v-model="busqueda" type="search" placeholder="Buscar..." class="buscar" />
      </div>

      <p v-if="notas.length === 0" class="vacio">
        Aún no tienes notas. ¡Escribe la primera!
      </p>
      <p v-else-if="notasFiltradas.length === 0" class="vacio">
        No hay notas que coincidan con la búsqueda.
      </p>

      <div class="lista">
        <NotaTarjeta
          v-for="nota in notasFiltradas"
          :key="nota.id"
          :nota="nota"
          @editar="seleccionarParaEditar"
          @eliminar="borrar"
        />
      </div>
    </section>
  </main>
</template>
