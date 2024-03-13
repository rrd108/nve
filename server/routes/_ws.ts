export default defineWebSocketHandler({
  open(peer) {
    console.log('[ws] open', peer)
    peer.subscribe('admin')
  },

  message(peer, message) {
    console.log('[ws] message received', peer, message)
    peer.publish('admin', `${message}`)
  },

  close(peer, event) {
    console.log('[ws] close', peer, event)
  },

  error(peer, error) {
    console.log('[ws] error', peer, error)
  },
})
