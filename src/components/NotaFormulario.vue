<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  // Nota que se está editando (null cuando se crea una nueva)
  notaEditando: { type: Object, default: null }
})

const emit = defineEmits(['guardar', 'cancelar'])

const titulo = ref('')
const contenido = ref('')

// Al elegir "Editar", se llenan los campos con la nota seleccionada
watch(
  () => props.notaEditando,
  (nota) => {
    titulo.value = nota ? nota.titulo : ''
    contenido.value = nota ? nota.contenido : ''
  },
  { immediate: true }
)

function enviar() {
  if (!titulo.value.trim() && !contenido.value.trim()) return
  emit('guardar', { titulo: titulo.value, contenido: contenido.value })
  titulo.value = ''
  contenido.value = ''
}
</script>

<template>
  <form class="formulario" @submit.prevent="enviar">
    <h2>{{ notaEditando ? 'Editar nota' : 'Nueva nota' }}</h2>
    <input v-model="titulo" type="text" placeholder="Título" maxlength="80" />
    <textarea v-model="contenido" rows="4" placeholder="Escribe tu nota..."></textarea>
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
