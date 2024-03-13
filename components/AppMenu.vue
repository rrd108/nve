<script lang="ts" setup>
  const menu = ref(await $fetch('/api/menu/1'))

  if (process.client) {
    const ws = useWebsocket()

    ws().onmessage = event => {
      const { topic, _data } = JSON.parse(event.data)
      if (topic == 'update') {
        menu.value.children = _data.children
      }
    }
  }
</script>

<template>
  <section>
    <ul>
      <li v-for="item in menu?.children" :key="item?.id">
        <NuxtLink :to="item?.link" v-if="item.link">
          {{ item?.label }}
        </NuxtLink>
        <div v-if="!item.link">
          {{ item?.label }}
          <ul>
            <li v-for="subItem in item.links">
              <NuxtLink :to="subItem?.link" v-if="subItem.link">
                {{ subItem?.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </li>
    </ul>
    <EditButton :endpoint="'menu/1'" />
  </section>
</template>

<style scoped>
  section {
    position: relative;
    width: max-content;
    border: 0.1em dotted #fff;
  }
  section:hover {
    border: 0.1em dotted var(--secondary-hover);
  }
  ul {
    list-style: none;
    display: flex;
    gap: 1em;
  }
</style>
