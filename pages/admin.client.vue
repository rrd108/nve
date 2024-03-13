<script setup lang="ts">
  definePageMeta({
    layout: 'admin',
  })

  const data = ref({})
  const originalData = ref({})
  const iframeRef = ref(null)

  const ws = useWebsocket()

  ws().onmessage = async event => {
    const endpoint = JSON.parse(event.data)?.endpoint
    if (!endpoint) return

    data.value = await $fetch(`/api/${endpoint}`)
    originalData.value = JSON.parse(JSON.stringify(data.value))
  }

  ws().onerror = error => {
    console.error('WebSocket error:', error)
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
    const iframe = iframeRef.value
    iframe?.contentWindow.location.reload()
  }
</script>

<template>
  <h1>Admin</h1>
  <section>
    <main>
      <iframe ref="iframeRef" src="http://localhost:3000" width="100%" height="100%"></iframe>
    </main>
    <aside>
      <h2>Admin</h2>
      <h3>{{ data.label }}</h3>
      <ul>
        <li v-for="item in data.links">
          <label>
            Label
            <input type="text" v-model="item.label" />
          </label>
          <label>
            Link
            <input type="text" v-model="item.link" />
          </label>
        </li>
      </ul>
      <button @click="save">Mentés</button>
    </aside>
  </section>
</template>

<style scoped>
  section {
    display: grid;
    grid-template-columns: 4fr 1fr;
    gap: 1em;
    height: 80vh;
  }
  iframe {
    border: 0.1em solid #c9b3dd;
    border-radius: 0.5em;
  }
  aside {
    background-color: #c9b3dd;
    padding: 0.5em;
    border-radius: 0.5em;
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  li {
    padding: 0.5em;
    border-bottom: 0.1em solid #592c83;
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
  button {
    width: max-content;
    display: block;
    margin: 0.5em auto;
    padding: 0.5em;
    background-color: #592c83;
    color: #fff;
  }
</style>
