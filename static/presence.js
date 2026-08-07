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
    cursor.style.left = `${x * 100}%`
    cursor.style.top = `${y * 100}%`
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

  presence.onLeave((viewerId, _current, _leftPresence) => {
    removeRemoteCursor(viewerId)
  })

  window.addEventListener("pointermove", event => {
    const now = performance.now()

    if (!joined || now - lastCursorSentAt < 50) return

    lastCursorSentAt = now
    channel.push("cursor", {
      x: Math.min(Math.max(event.clientX / window.innerWidth, 0.000001), 0.999999),
      y: Math.min(Math.max(event.clientY / window.innerHeight, 0.000001), 0.999999),
    })
  })

  socket.connect()
})()
