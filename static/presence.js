(() => {
  const serverUrl = document
    .querySelector('meta[name="presence-server-url"]')
    ?.getAttribute("content")

  if (!serverUrl || !window.Phoenix) return

  const cursorLayer = document.createElement("div")
  cursorLayer.id = "presence-cursor-layer"
  cursorLayer.setAttribute("aria-hidden", "true")
  document.body.appendChild(cursorLayer)

  const remoteCursors = new Map()

  function getRemoteCursor(viewerId) {
    let cursor = remoteCursors.get(viewerId)

    if (!cursor) {
      cursor = document.createElement("div")
      cursor.className = "presence-cursor"
      cursorLayer.appendChild(cursor)
      remoteCursors.set(viewerId, cursor)
    }

    return cursor
  }

  function removeRemoteCursor(viewerId) {
    remoteCursors.get(viewerId)?.remove()
    remoteCursors.delete(viewerId)
  }

  const socketUrl = new URL("/socket", serverUrl).toString()
  const socket = new window.Phoenix.Socket(socketUrl)
  const page = window.location.pathname.replace(/^\/+|\/+$/g, "") || "home"
  const channel = socket.channel(`presence:${page}`, {})
  const presence = new window.Phoenix.Presence(channel)
  let joined = false
  let lastCursorSentAt = 0

  channel.on("cursor", ({viewer_id: viewerId, x, y}) => {
    const cursor = getRemoteCursor(viewerId)
    cursor.style.left = `${x * document.documentElement.scrollWidth}px`
    cursor.style.top = `${y * document.documentElement.scrollHeight}px`
  })

  channel.onClose(() => {
    joined = false
    remoteCursors.forEach(cursor => cursor.remove())
    remoteCursors.clear()
  })

  channel
    .join()
    .receive("ok", () => {
      joined = true
    })

  let viewerCount = 0

  presence.onSync(() => {
    viewerCount = presence.list().length
    if (viewerCount <= 1) {
      remoteCursors.forEach(cursor => cursor.remove())
      remoteCursors.clear()
    }
  })

  presence.onLeave((viewerId, _current, _leftPresence) => {
    removeRemoteCursor(viewerId)
  })

  window.addEventListener("pointermove", event => {
    const now = performance.now()

    if (!joined || viewerCount <= 1 || now - lastCursorSentAt < 50) return

    lastCursorSentAt = now
    channel.push("cursor", {
      x: Math.min(Math.max(event.pageX / document.documentElement.scrollWidth, 0.000001), 0.999999),
      y: Math.min(Math.max(event.pageY / document.documentElement.scrollHeight, 0.000001), 0.999999),
    })
  })

  socket.connect()
})()
