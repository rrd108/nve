<script lang="ts" setup>
  const menu = await $fetch('/api/menu/2')
</script>

<template>
  <section class="component">
    <ul>
      <li v-for="item in menu?.children" :key="item?.id">
        <NuxtLink :to="item?.link">
          {{ item?.label }}
        </NuxtLink>
      </li>
    </ul>
    <EditButton :endpoint="'menu/2'" />
  </section>
</template>

<style scoped>
  ul {
    list-style: none;
    display: flex;
    gap: 1em;
  }
</style>
