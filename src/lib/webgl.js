import { Component } from 'react'

/** True when the browser can create a WebGL context (checked once per explorer; the 3D chunk only loads when it can). */
export function webglOk() {
  if (typeof window === 'undefined') return false
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')) } catch { return false }
}

/**
 * Public URL of a model in public/models/. VITE_MODEL_SUFFIX is for hosted previews that can't serve .glb:
 * they ship a glTF-JSON twin (e.g. wireless-node.glb.json) and build with VITE_MODEL_SUFFIX=.json.
 */
export const modelUrl = (file) => `${import.meta.env.BASE_URL}models/${file}${import.meta.env.VITE_MODEL_SUFFIX || ''}`

/** Catches a failed model load (network, decoding) so an explorer can fall back to its 2D render. */
export class ModelBoundary extends Component {
  constructor(props) { super(props); this.state = { failed: false } }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(error) { this.props.onError?.(error) }
  render() { return this.state.failed ? null : this.props.children }
}
