export default defineWebSocketHandler({
  open(peer) {
    console.log('[ws] open', peer)
    peer.subscribe('endpoint')
    peer.subscribe('update')
  },

  message(peer, message) {
    console.log('[ws] message received', peer, message)

    const { topic, _data } = JSON.parse(message.text())

    console.log('******* WS MESSAGE *******')
    console.log({ topic, _data })
    console.log('**************************')

    peer.publish(topic, `${message}`)
  },

  close(peer, event) {
    console.log('[ws] close', peer, event)
  },

  error(peer, error) {
    console.log('[ws] error', peer, error)
  },
})
