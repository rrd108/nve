<script setup lang="ts">
  import { ref } from 'vue'
  const props = defineProps<{
    name: string
  }>()

  const wsOpened = ref(false)

  const ws = useWebsocket()

  ws().onopen = () => {
    wsOpened.value = true
  }

  const send = () => {
    const message = { name: props.name }
    try {
      ws().send(JSON.stringify(message))
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }
</script>

<template>
  <button @click="send" :disabled="!wsOpened">✒️</button>
</template>

<style scoped>
  button {
    position: absolute;
    top: 0;
    right: -3em;
  }
</style>
