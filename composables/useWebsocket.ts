export default function useWebSocket() {
  let wsInstance: WebSocket | null = null

  return function getWebSocket() {
    if (!wsInstance) {
      wsInstance = new WebSocket('ws://localhost:3000/_ws')
      //console.log('WebSocket instance created', wsInstance)

      wsInstance.onerror = event => {
        console.log('WebSocket error', event)
      }
    }
    return wsInstance
  }
}
