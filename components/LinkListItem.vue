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

<style scoped></style>
