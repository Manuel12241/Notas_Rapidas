<script setup>
import { computed } from 'vue'

const props = defineProps({
  nota: { type: Object, required: true }
})

defineEmits(['editar', 'eliminar'])

// "fecha" viene como YYYY-MM-DD; se agrega la hora para que no se corra un día por zona horaria
const fechaTexto = computed(() =>
  new Date(`${props.nota.fecha}T00:00:00`).toLocaleDateString('es-GT', {
    dateStyle: 'medium'
  })
)
</script>

<template>
  <article class="tarjeta">
    <h3>{{ nota.titulo || 'Sin título' }}</h3>
    <p class="contenido">{{ nota.contenido }}</p>
    <footer>
      <small>{{ fechaTexto }}</small>
      <div class="acciones">
        <button class="btn-texto" @click="$emit('editar', nota)">Editar</button>
        <button class="btn-texto peligro" @click="$emit('eliminar', nota.id)">Eliminar</button>
      </div>
    </footer>
  </article>
</template>
