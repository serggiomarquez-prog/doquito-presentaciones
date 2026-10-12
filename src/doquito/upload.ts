/*
 * Doquito: las imágenes que se añaden a la presentación se suben al almacenamiento de Doquito
 * (como en el editor de documentos) en vez de guardarse dentro del archivo, que pesaría demasiado.
 * Doquito → editor responde { source: 'doquito', type: 'uploaded', reqId, url } (url vacía si falló).
 */
const inDoquito = window.parent !== window
let seq = 0

export function uploadToDoquito(file: File): Promise<string | null> {
  if (!inDoquito) return Promise.resolve(null)
  const reqId = `up-${Date.now()}-${++seq}`
  return new Promise((resolve) => {
    const done = (url: string | null) => {
      window.removeEventListener('message', onMessage)
      clearTimeout(timer)
      resolve(url)
    }
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || e.source !== window.parent) return
      const d = e.data
      if (d?.source === 'doquito' && d.type === 'uploaded' && d.reqId === reqId) done(typeof d.url === 'string' && d.url ? d.url : null)
    }
    const timer = setTimeout(() => done(null), 60_000)
    window.addEventListener('message', onMessage)
    window.parent.postMessage({ source: 'doquito-slides', type: 'upload', reqId, file }, window.location.origin)
  })
}
