<template>
  <div class="mobile-preview" ref="mobileRef">
    <div class="top-bar">
      <div class="back" v-if="inDoquito" @click="goBack()" aria-label="Volver"><i-icon-park-outline:left /></div>
      <svg class="logo" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="8" fill="#6d4aff"/><path d="M10 8h7.5a7.5 7.5 0 0 1 0 15H10z" fill="none" stroke="#fff" stroke-width="2.5"/><circle cx="22.5" cy="23.5" r="2.5" fill="#c4b5fd"/></svg>
      <div class="title">{{ title }}</div>
      <span class="status" v-if="inDoquito && saveStatus === 'saving'">Guardando…</span>
    </div>
    <div class="thumbnail-list">
      <div class="thumbnail-item" v-for="(slide, index) in slides" :key="slide.id">
        <ThumbnailSlide 
          :slide="slide" 
          :size="screenWidth - 20" 
          :visible="index < slidesLoadLimit" 
        />
      </div>
    </div>
    <div class="menu">
      <div class="menu-item" @click="changeMode('editor')"><i-icon-park-outline:edit class="icon" /> Editar</div>
      <Divider type="vertical" style="height: 30px;" />
      <div class="menu-item present" @click="changeMode('player')"><i-icon-park-outline:play class="icon" /> Presentar</div>
    </div>
  </div>

</template>

<script lang="ts" setup>
import { onMounted, ref, useTemplateRef } from 'vue'
import { inDoquito, goBack, saveStatus } from '@/doquito/bridge'
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'
import useLoadSlides from '@/hooks/useLoadSlides'
import type { Mode } from '@/types/mobile'

import ThumbnailSlide from '@/views/components/ThumbnailSlide/index.vue'
import Divider from '@/components/Divider.vue'

defineProps<{
  changeMode: (mode: Mode) => void
}>()

const { slides, title } = storeToRefs(useSlidesStore())
const { slidesLoadLimit } = useLoadSlides()


const mobileRef = useTemplateRef<HTMLElement>('mobileRef')
const screenWidth = ref(0)
const width = ref(400)

onMounted(() => {
  if (!mobileRef.value) return
  screenWidth.value = mobileRef.value.clientWidth
  width.value = document.body.clientWidth - 20
})
</script>

<style lang="scss" scoped>
.mobile-preview {
  height: 100%;
  background-color: $hoverBg;
}
.top-bar {
  height: 52px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px 0 6px;
  background-color: $headerBg;
  border-bottom: 1px solid $borderColor;

  .back {
    width: 36px;
    height: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
  }
  .logo { width: 24px; height: 24px; flex: none; }
  .title { flex: 1; min-width: 0; font-size: 14px; font-weight: 600; @include ellipsis-oneline(); }
  .status { font-size: 12px; color: $subTextColor; }
}
.thumbnail-list {
  height: calc(100% - 102px);
  padding: 10px;
  overflow: auto;
}
.thumbnail-item {
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.1);

  & + .thumbnail-item {
    margin-top: 10px;
  }
}
.menu {
  height: 50px;
  position: relative;
  box-shadow: 0 -2px 4px 0 rgba($color: #333, $alpha: 0.05);
  background: $panelBg;
  display: flex;
  justify-content: center;
  align-items: center;

  .menu-item {
    width: 50%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 13px;

    .icon {
      margin-right: 8px;
      font-size: 18px;
    }

    &.present {
      color: $themeColor;
      font-weight: 700;
    }
  }
}
</style>
