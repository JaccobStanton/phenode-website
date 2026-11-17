import { createSensorField } from './sensorField.js'

/**
 * Puts the home intro's sensor field (sensorField.js) in `host`, an element it fills: two canvases, the field and the
 * overlay with the pings and readings above it.
 *
 * Where the browser can (OffscreenCanvas: Chrome 69+, Firefox 105+, Safari 16.4+), the drawing runs in a worker
 * (sensorField.worker.js). The field is the heaviest work on the page while the intro is on screen; off the page's
 * thread, it never competes with scrolling, taps, or the rest of the page arriving (Nov 17, performance pass).
 * Otherwise, with reduced motion (one still frame), or if the worker can't start, it's drawn on the page as before.
 *
 * Returns the renderer's controls: resize (after the host or the area to keep clear changed), start, stop, setExit,
 * destroy (removes the canvases).
 */
export function mountSensorField(host, { reduced = false, avoid = () => null } = {}) {
  let canvases = []
  let running = false, exit = 0, dead = false
  let impl = null

  // Fresh canvases each time: a canvas handed to a worker can't be drawn on from the page again.
  const make = () => {
    canvases.forEach((c) => c.remove())
    canvases = [0, 1].map(() => {
      const c = document.createElement('canvas')
      c.className = 'absolute inset-0 h-full w-full'
      host.append(c)
      return c
    })
    return canvases
  }
  const size = () => {
    const r = host.getBoundingClientRect()
    return { w: r.width, h: r.height, dpr: window.devicePixelRatio || 1 }
  }

  const onPage = () => {
    const [canvas, overlay] = make()
    const field = createSensorField(canvas, { overlay, reduced, avoid, measure: size })
    field.resize()
    field.setExit(exit)
    if (running) field.start()
    return field
  }

  const inWorker = () => {
    const [canvas, overlay] = make()
    const worker = new Worker(new URL('./sensorField.worker.js', import.meta.url), { type: 'module' })
    const a = canvas.transferControlToOffscreen()
    const b = overlay.transferControlToOffscreen()
    worker.postMessage({ type: 'init', canvas: a, overlay: b, reduced, size: size(), keep: avoid() }, [a, b])
    // It couldn't start (blocked, or no module workers in this browser) or it failed: draw on the page instead.
    worker.addEventListener('error', (e) => {
      e.preventDefault()
      worker.terminate()
      if (!dead) impl = onPage()
    }, { once: true })
    const post = (m) => worker.postMessage(m)
    return {
      resize: () => post({ type: 'resize', size: size(), keep: avoid() }),
      start: () => post({ type: 'start' }),
      stop: () => post({ type: 'stop' }),
      setExit: (p) => post({ type: 'exit', p }),
      destroy: () => worker.terminate(),
    }
  }

  const offscreen = typeof Worker === 'function' && typeof OffscreenCanvas === 'function' && 'transferControlToOffscreen' in HTMLCanvasElement.prototype
  try {
    impl = offscreen && !reduced ? inWorker() : onPage()
  } catch {
    impl = onPage()
  }

  return {
    resize: () => impl.resize(),
    start: () => { running = true; impl.start() },
    stop: () => { running = false; impl.stop() },
    setExit: (p) => { exit = p; impl.setExit(p) },
    destroy: () => {
      dead = true
      impl.destroy()
      canvases.forEach((c) => c.remove())
      canvases = []
    },
  }
}
