<template>
  <template v-if="slides.length">
    <Screen v-if="screening" />
    <Editor v-else-if="_isPC" />
    <Mobile v-else />
  </template>
  <FullscreenSpin tip="Abriendo la presentación…" v-else  loading :mask="false" />
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { nanoid } from 'nanoid'
import { useScreenStore, useMainStore, useSnapshotStore, useSlidesStore } from '@/store'
import { LOCALSTORAGE_KEY_DISCARDED_DB } from '@/configs/storage'
import { deleteDiscardedDB } from '@/utils/database'
import { isPC } from '@/utils/common'
import api from '@/services'
import { receiveDeck, startSync } from '@/doquito/bridge'
import { blankDeck } from '@/doquito/blank'

import Editor from './views/Editor/index.vue'
import Screen from './views/Screen/index.vue'
import Mobile from './views/Mobile/index.vue'
import FullscreenSpin from '@/components/FullscreenSpin.vue'

const _isPC = isPC()

const mainStore = useMainStore()
const slidesStore = useSlidesStore()
const snapshotStore = useSnapshotStore()
const screenStore = useScreenStore()
const { databaseId } = storeToRefs(mainStore)
const { slides } = storeToRefs(slidesStore)
const { screening } = storeToRefs(screenStore)

const isAudienceMode = new URLSearchParams(window.location.search).get('mode') === 'audience'

// Doquito: sin aviso al salir; los cambios se guardan solos en "Mis documentos".

onMounted(async () => {
  if (isAudienceMode) {
    slidesStore.setSlides([{
      id: nanoid(10),
      elements: [],
    }])
    screenStore.setScreening(true)
  }
  else {
    // Doquito manda la presentación guardada; si se abre suelto (desarrollo), la de ejemplo.
    const got = await receiveDeck()
    if (got) {
      if (got.title) slidesStore.setTitle(got.title)
      if (got.deck?.theme) slidesStore.setTheme(got.deck.theme)
      if (got.deck?.viewportRatio) slidesStore.setViewportRatio(got.deck.viewportRatio)
      if (got.deck?.viewportSize) slidesStore.setViewportSize(got.deck.viewportSize)
      slidesStore.setSlides(got.deck?.slides?.length ? got.deck.slides : blankDeck())
      startSync()
    }
    else if (import.meta.env.MODE !== 'development') {
      // Abierto fuera de Doquito (p. ej. /slides/index.html a mano): a la lista de presentaciones
      window.location.replace('/app/slides')
    }
    else {
      const slides = await api.getMockData('slides')
      slidesStore.setSlides(slides)
    }

    await deleteDiscardedDB()
    snapshotStore.initSnapshotDatabase()
  }
})

// 应用注销时向 localStorage 中记录下本次 indexedDB 的数据库ID，用于之后清除数据库
window.addEventListener('beforeunload', () => {
  const discardedDB = localStorage.getItem(LOCALSTORAGE_KEY_DISCARDED_DB)
  const discardedDBList: string[] = discardedDB ? JSON.parse(discardedDB) : []

  discardedDBList.push(databaseId.value)

  const newDiscardedDB = JSON.stringify(discardedDBList)
  localStorage.setItem(LOCALSTORAGE_KEY_DISCARDED_DB, newDiscardedDB)
})
</script>

<style lang="scss">
#app {
  height: 100%;
}
</style>