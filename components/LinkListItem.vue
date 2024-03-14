<script setup lang="ts">
  defineProps<{
    item: {
      label: string
      link: string
    }
  }>()
</script>

<template>
  <details>
    <summary>{{ item.label }}</summary>
    <label>
      Label
      <input type="text" v-model="item.label" />
    </label>
    <label>
      Link
      <input type="text" v-model="item.link" />
    </label>
  </details>
</template>

<style scoped>
  input,
  label,
  button {
    width: 100%;
    font-size: 1.25rem;
    border: none;
    border-radius: 0.5em;
    padding: 0.25em;
    margin-bottom: 0.5em;
  }
  .dragging {
    background: none;
  }
  .dragging > details {
    rotate: 6deg;
    background-color: #fff;
    padding: 0.5em;
    border-radius: 0.5em;
  }
</style>
