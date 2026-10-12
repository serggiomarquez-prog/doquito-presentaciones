/*
 * Doquito: puente entre este editor (dentro de un iframe en /app/d/<id>) y la página de Doquito que lo aloja.
 *
 * Doquito → editor:  { source: 'doquito', type: 'load', title, deck }   presentación a abrir
 *                    { source: 'doquito', type: 'status', status }       'saving' | 'saved' | 'error' | 'offline'
 * Editor → Doquito:  { source: 'doquito-slides', type: 'ready' }        listo para recibir la presentación
 *                    { source: 'doquito-slides', type: 'change', title, deck }  hubo cambios (con pausa)
 *                    { source: 'doquito-slides', type: 'back' | 'share' }
 *                    { source: 'doquito-slides', type: 'screening', on }   empieza o termina de presentar
 *
 * Solo se aceptan mensajes del mismo origen (el editor se sirve desde el propio dominio en /slides/).
 */
import { ref, watch } from 'vue'
import { debounce } from 'lodash'
import type { Slide, SlideTheme } from '@/types/slides'
import { useScreenStore, useSlidesStore } from '@/store'

export interface Deck {
  slides: Slide[]
  theme?: SlideTheme
  viewportSize?: number
  viewportRatio?: number
}

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error' | 'offline'

/** Estado del guardado que muestra la cabecera. */
export const saveStatus = ref<SaveStatus>('idle')

export const inDoquito = window.parent !== window

const post = (msg: Record<string, unknown>) => {
  if (inDoquito) window.parent.postMessage({ source: 'doquito-slides', ...msg }, window.location.origin)
}

export const goBack = () => post({ type: 'back' })
/** Esconde (o vuelve a mostrar) la mascota de Doquito, p. ej. al editar en el móvil, donde taparía las herramientas. */
export const hideMascot = (on: boolean) => post({ type: 'screening', on })
export const share = () => post({ type: 'share' })

/** Espera la presentación que manda Doquito (o null si el editor se abre suelto, p. ej. en desarrollo). */
export function receiveDeck(): Promise<{ title: string; deck: Deck | null } | null> {
  if (!inDoquito) return Promise.resolve(null)
  return new Promise((resolve) => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || e.source !== window.parent) return
      const d = e.data
      if (!d || d.source !== 'doquito') return
      if (d.type === 'load') {
        window.removeEventListener('message', onMessage)
        resolve({ title: String(d.title ?? ''), deck: d.deck && Array.isArray(d.deck.slides) ? d.deck : null })
      }
    }
    window.addEventListener('message', onMessage)
    post({ type: 'ready' })
  })
}

/** Escucha el estado del guardado y envía los cambios (con una pausa, para no guardar a cada tecla). */
export function startSync() {
  if (!inDoquito) return
  window.addEventListener('message', (e) => {
    if (e.origin !== window.location.origin || e.source !== window.parent) return
    const d = e.data
    if (d?.source === 'doquito' && d.type === 'status') saveStatus.value = d.status
  })

  const store = useSlidesStore()
  const send = debounce(() => {
    const deck: Deck = {
      slides: JSON.parse(JSON.stringify(store.slides)),
      theme: JSON.parse(JSON.stringify(store.theme)),
      viewportSize: store.viewportSize,
      viewportRatio: store.viewportRatio,
    }
    post({ type: 'change', title: store.title, deck })
  }, 800)

  watch(
    () => [store.slides, store.theme, store.viewportRatio, store.title],
    () => send(),
    { deep: true },
  )
  // Mientras se presenta, Doquito esconde a su mascota para que no tape las diapositivas
  const screen = useScreenStore()
  watch(() => screen.screening, (on) => post({ type: 'screening', on }))

  // Al salir de la página, lo pendiente se manda ya
  window.addEventListener('pagehide', () => send.flush())
}
