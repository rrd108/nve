<script lang="ts" setup>
  const menu = ref(await $fetch('/api/menu/1'))

  if (process.client) {
    const ws = useWebsocket()

    ws().onmessage = event => {
      const { topic, _data } = JSON.parse(event.data)

      console.log('***** AppMenu received data from ws ******')
      console.log({ topic, _data })
      console.log('********************************************')

      if (topic == 'update') {
        menu.value.children = _data.children
      }
    }
  }

  const showSubmenu = ref(0)
</script>

<template>
  <section class="component">
    <nav>
      <ul>
        <li
          v-for="item in menu?.children"
          :key="item?.uid"
          @mouseenter="showSubmenu = item.uid"
          @mouseleave="showSubmenu = 0"
        >
          <NuxtLink :to="item?.link" v-if="item.link">
            {{ item?.label }}
          </NuxtLink>
          <div v-if="!item.link">
            {{ item?.label }}
            <ul v-show="showSubmenu == item.uid">
              <li v-for="subItem in item.links">
                <NuxtLink :to="subItem?.link" v-if="subItem.link">
                  {{ subItem?.label }}
                </NuxtLink>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </nav>
    <EditButton :endpoint="'menu/1'" />
  </section>
</template>

<style scoped>
  nav {
    height: 3em;
    z-index: 1;
  }
  nav > ul {
    display: flex;
    gap: 1em;
    justify-content: flex-end;
    cursor: pointer;
  }
  nav a {
    text-decoration: none;
    display: inline-block;
  }
  ul {
  }
  nav > ul li {
    text-align: center;
    width: 5rem;
  }
  li a {
    padding: 0.5em;
    white-space: nowrap;
  }
  li a:hover {
  }
  ul ul li {
    text-align: left;
  }
</style>
