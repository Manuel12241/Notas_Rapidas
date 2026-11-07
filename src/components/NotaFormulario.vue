<script setup>
import { ref, watch } from 'vue'
import { hoy } from '../composables/useNotas'

const props = defineProps({
  // Nota que se está editando (null cuando se crea una nueva)
  notaEditando: { type: Object, default: null }
})

const emit = defineEmits(['guardar', 'cancelar'])

const titulo = ref('')
const contenido = ref('')
const fecha = ref(hoy())

// Al elegir "Editar", se llenan los campos con la nota seleccionada
watch(
  () => props.notaEditando,
  (nota) => {
    titulo.value = nota ? nota.titulo : ''
    contenido.value = nota ? nota.contenido : ''
    fecha.value = nota ? nota.fecha : hoy()
  },
  { immediate: true }
)

function enviar() {
  if (!titulo.value.trim() && !contenido.value.trim()) return
  emit('guardar', { titulo: titulo.value, contenido: contenido.value, fecha: fecha.value || hoy() })
  titulo.value = ''
  contenido.value = ''
  fecha.value = hoy()
}
</script>

<template>
  <form class="formulario" @submit.prevent="enviar">
    <h2>{{ notaEditando ? 'Editar nota' : 'Nueva nota' }}</h2>
    <input v-model="titulo" type="text" placeholder="Título" maxlength="80" />
    <textarea v-model="contenido" rows="4" placeholder="Escribe tu nota..."></textarea>
    <label class="campo-fecha">
      <span>Fecha</span>
      <input v-model="fecha" type="date" required />
    </label>
    <div class="acciones">
      <button type="submit" class="btn primario">
        {{ notaEditando ? 'Guardar cambios' : 'Agregar nota' }}
      </button>
      <button v-if="notaEditando" type="button" class="btn" @click="emit('cancelar')">
        Cancelar
      </button>
    </div>
  </form>
</template>
