<script setup lang="ts">
  import { ref } from 'vue'
  const props = defineProps<{
    endpoint: string
  }>()

  const wsOpened = ref(false)

  const ws = useWebsocket()

  ws().onopen = () => {
    wsOpened.value = true
  }

  const send = () => {
    const message = { endpoint: props.endpoint }
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
