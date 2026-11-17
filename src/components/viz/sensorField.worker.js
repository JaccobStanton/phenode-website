/**
 * The home intro's sensor field, drawn in a worker (started by sensorFieldHost.js): the same renderer as on the page
 * (sensorField.js), on the two canvases the page handed over, so its frames never take time from the page.
 *
 * Messages from the page: init (the canvases, size, reduced motion, the area to keep clear), resize, start, stop, exit.
 */
import { createSensorField } from './sensorField.js'
import monoUrl from '@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2?url'

let field = null
let size = { w: 1, h: 1, dpr: 1 }
let keep = null

// The readings are set in Geist Mono, as on the page. A worker has its own fonts, so the face is added here (the file
// comes from the browser's cache: the page has loaded it). Until it's in, or where a worker can't load fonts, the
// canvas uses the next font in its list (ui-monospace).
function loadFont() {
  try {
    const face = new FontFace('Geist Mono Variable', `url(${new URL(monoUrl, self.location.href)})`, { weight: '100 900' })
    self.fonts.add(face)
    face.load().catch(() => {})
  } catch {
    /* no fonts in this worker: the fallback font it is */
  }
}

self.onmessage = ({ data: m }) => {
  if (m.type === 'init') {
    size = m.size
    keep = m.keep
    loadFont()
    field = createSensorField(m.canvas, { overlay: m.overlay, reduced: m.reduced, avoid: () => keep, measure: () => size })
    field.resize()
  } else if (!field) {
    return
  } else if (m.type === 'resize') {
    size = m.size
    keep = m.keep
    field.resize()
  } else if (m.type === 'start') field.start()
  else if (m.type === 'stop') field.stop()
  else if (m.type === 'exit') field.setExit(m.p)
}
