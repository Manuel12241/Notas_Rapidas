<script setup>
import { ref, computed } from 'vue'
import NotaFormulario from './components/NotaFormulario.vue'
import NotaTarjeta from './components/NotaTarjeta.vue'
import { useNotas } from './composables/useNotas'

const { notas, conectado, crearNota, editarNota, eliminarNota } = useNotas()

const notaEditando = ref(null)
const busqueda = ref('')

// ---- Crear / editar / eliminar ----
function guardar({ titulo, contenido, fecha }) {
  if (notaEditando.value) {
    editarNota(notaEditando.value.id, titulo, contenido, fecha)
    notaEditando.value = null
  } else {
    crearNota(titulo, contenido, fecha)
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
</script>

<template>
  <header class="barra">
    <h1>📝 Notas Rápidas</h1>
    <small class="estado" :title="conectado ? 'Guardando en PostgreSQL' : 'Sin conexión: se guarda localmente'">
      {{ conectado ? '● Conectado' : '○ Sin conexión' }}
    </small>
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
