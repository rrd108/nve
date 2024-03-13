<script lang="ts" setup>
  const menu = await $fetch('/api/menu/1')
</script>

<template>
  <div>
    <ul>
      <li v-for="item in menu?.links" :key="item?.id">
        <NuxtLink :to="item?.link">
          {{ item?.label }}
        </NuxtLink>
      </li>
    </ul>
    <EditButton :endpoint="'menu/1'" />
  </div>
</template>

<style scoped>
  div {
    position: relative;
    width: max-content;
  }
  ul {
    list-style: none;
    display: flex;
    gap: 1em;
  }
</style>
