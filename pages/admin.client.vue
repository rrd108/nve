<script setup lang="ts">
  definePageMeta({
    layout: 'admin',
  })

  let endpoint = ''
  const data = ref({})
  const originalData = ref({})
  const iframeRef = ref(null)
  const hasChangedData = ref(false)

  const ws = useWebsocket()

  ws().onmessage = async event => {
    const { topic, _data } = JSON.parse(event.data)

    console.log('***** Admin received data from ws ******')
    console.log({ topic, _data })
    console.log('****************************************')

    if (topic == 'endpoint') {
      endpoint = _data

      data.value = await $fetch(`/api/${endpoint}`)
      originalData.value = JSON.parse(JSON.stringify(data.value))
      hasChangedData.value = false
    }
  }

  const save = async () => {
    // find which link is changed
    if (data.value.links?.length) {
      const changedLink = data.value.links.find(
        (link, index) =>
          link.label !== originalData.value.links[index].label || link.link !== originalData.value.links[index].link
      )
      // send the changed links to the server
      await $fetch('/api/link', {
        method: 'PATCH',
        body: JSON.stringify(changedLink),
      })
    }

    if (data.value.children?.length) {
      data.value.children = data.value.children.map((item, index) => ({ ...item, position: index }))
      //console.log(data.value)
      // send the changed links to the server
      await $fetch('/api/links', {
        method: 'PATCH',
        body: JSON.stringify(
          data.value.children.map(item => ({ id: item.id, position: item.position, type: item.link ? 'link' : 'menu' }))
        ),
      })
    }

    hasChangedData.value = false
    originalData.value = JSON.parse(JSON.stringify(data.value))
  }

  // watch data changes
  watch(
    data,
    async (newData, oldData) => {
      if (!oldData.id || newData.id != oldData.id) return

      hasChangedData.value = true

      const message = { topic: 'update', _data: { ...data.value, endpoint } }
      console.log(' ***** Admin sends data to ws *****', message)
      ws().send(JSON.stringify(message))
    },
    { deep: true }
  )

  const preview = ref('desktop')

  const drag = ref(false)
  const dragOptions = {
    animation: 200,
    group: 'description',
    disabled: false,
    ghostClass: 'ghost',
  }

  const changePosition = (event: { oldIndex: number; newIndex: number }) => {
    const { oldIndex, newIndex } = event
    const movedItem = data.value.children.splice(oldIndex, 1)[0]
    data.value.children.splice(newIndex, 0, movedItem)
  }
</script>

<template>
  <h1>
    Admin
    <span @click="preview = 'mobile'">📱</span>
    <span @click="preview = 'desktop'">💻</span>
  </h1>
  <section>
    <main>
      <iframe
        :class="{ pulseOnChange: hasChangedData }"
        ref="iframeRef"
        src="http://localhost:3000?preview=true"
        :width="preview == 'mobile' ? '360px' : '1160px'"
        :height="preview == 'mobile' ? '640px' : '100%'"
      />
    </main>
    <aside>
      <h2>Admin</h2>
      <button @click="save" :disabled="!hasChangedData" :class="{ pulseOnChange: hasChangedData }">Mentés</button>
      <h3>{{ data.label }}</h3>
      <draggable
        class="list-group"
        tag="ul"
        :component-data="{
          type: 'transition-group',
          name: !drag ? 'flip-list' : null,
        }"
        v-model="data.children"
        v-bind="dragOptions"
        @start="drag = true"
        @end="drag = false"
        item-key="uid"
        dragClass="dragging"
      >
        <template #item="{ element: item }">
          <li>
            <LinkListItem :item="item" v-if="item.link" />

            <details v-if="!item.link">
              <summary>{{ item.label }}</summary>
              <draggable
                class="list-group"
                tag="ul"
                :component-data="{
                  type: 'transition-group',
                  name: !drag ? 'flip-list' : null,
                }"
                v-model="item.links"
                v-bind="dragOptions"
                @start="drag = true"
                @end="drag = false"
                @change="changePosition"
                item-key="uid"
              >
                <template #item="{ element: subItem }">
                  <li>
                    <LinkListItem :item="subItem" v-if="subItem.link" />
                  </li>
                </template>
              </draggable>
            </details>
          </li>
        </template>
      </draggable>
    </aside>
  </section>
</template>

<style scoped>
  h1 span {
    cursor: pointer;
  }
  main {
    margin: 0 auto;
  }
  section {
    display: grid;
    grid-template-columns: 4fr 1fr;
    gap: 1em;
    height: 80vh;
  }
  iframe {
    border: 0.1em solid var(--secondary);
    border-radius: 0.5em;
  }
  aside {
    background-color: var(--secondary);
    border-radius: 0.5em;
  }
  aside h2 {
    border-top-left-radius: 0.5em;
    border-top-right-radius: 0.5em;
    background-color: var(--primary-hover);
    color: #fff;
    padding: 1em;
    margin: 0;
    text-align: center;
  }
  aside h3,
  aside ul {
    margin: 0.5em;
  }
  aside ul {
    list-style: none;
    padding: 0;
  }
  li {
    padding: 0.5em;
    border-radius: 0.5em;
  }
  li:nth-child(odd) {
    background-color: var(--secondary-hover);
  }

  li li:nth-child(odd) {
    background-color: var(--secondary);
  }

  button {
    font-size: 1.25rem;
    border-radius: 0.5em;
    padding: 0.25em;
    margin-bottom: 0.5em;
    width: max-content;
    display: block;
    margin: 0.5em auto;
    padding: 0.5em 1em;
    background-color: var(--primary);
    border: 0.1em solid var(--primary);
    color: var(--accent);
  }
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    animation: none;
  }

  .pulseOnChange {
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0% {
      border-color: var(--primary);
    }
    50% {
      border-color: var(--accent);
    }
    100% {
      border-color: var(--primary);
    }
  }

  .flip-list-move {
    transition: transform 0.5s;
  }

  .no-move {
    transition: transform 0s;
  }

  .ghost,
  .ghost:nth-child(odd) {
    opacity: 0.5;
    background: #c8ebfb;
    border: 0.1em solid var(--primary-hover);
  }
  .ghost > details {
    visibility: hidden;
  }

  .list-group {
    min-height: 1rem;
  }
</style>
