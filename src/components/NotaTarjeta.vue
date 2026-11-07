<script setup>
import { computed } from 'vue'

const props = defineProps({
  nota: { type: Object, required: true }
})

defineEmits(['editar', 'eliminar'])

const fechaTexto = computed(() =>
  new Date(props.nota.fecha).toLocaleString('es-GT', {
    dateStyle: 'medium',
    timeStyle: 'short'
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
