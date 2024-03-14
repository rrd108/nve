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
    const changedLink = data.value.links.find(
      (link, index) =>
        link.label !== originalData.value.links[index].label || link.link !== originalData.value.links[index].link
    )
    // send the changed links to the server
    await $fetch('/api/save', {
      method: 'PATCH',
      body: JSON.stringify(changedLink),
    })
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
      console.log('Admin sends data to ws', message)
      ws().send(JSON.stringify(message))
    },
    { deep: true }
  )

  const preview = ref('desktop')
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
      <ul>
        <li v-for="item in data.children">
          <div v-if="item.link">
            <label>
              Label
              <input type="text" v-model="item.label" />
            </label>
            <label>
              Link
              <input type="text" v-model="item.link" />
            </label>
          </div>
          <details v-if="!item.link">
            <summary>{{ item.label }}</summary>
            <ul>
              <li v-for="subItem in item.links">
                <label>
                  Label
                  <input type="text" v-model="subItem.label" />
                </label>
                <label>
                  Link
                  <input type="text" v-model="subItem.link" />
                </label>
              </li>
            </ul>
          </details>
        </li>
      </ul>
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
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    animation: none;
  }
  button {
    width: max-content;
    display: block;
    margin: 0.5em auto;
    padding: 0.5em 1em;
    background-color: var(--primary);
    border: 0.1em solid var(--primary);
    color: var(--accent);
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
</style>
