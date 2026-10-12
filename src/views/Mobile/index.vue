<template>
  <div class="mobile">
    <component 
      :is="currentComponent" 
      :changeMode="changeMode"
    ></component>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { hideMascot } from '@/doquito/bridge'
import type { Mode } from '@/types/mobile'

import MobileEditor from './MobileEditor/index.vue'
import MobilePlayer from './MobilePlayer.vue'
import MobilePreview from './MobilePreview.vue'

const mode = ref<Mode>('preview')
    
const changeMode = (_mode: Mode) => mode.value = _mode

// Al editar o presentar en el móvil, la mascota de Doquito se esconde para no tapar los botones
watch(mode, (m) => hideMascot(m !== 'preview'))

const currentComponent = computed(() => {
  const componentMap = {
    'editor': MobileEditor,
    'player': MobilePlayer,
    'preview': MobilePreview,
  }
  return componentMap[mode.value] || null
})
</script>

<style lang="scss" scoped>
.mobile {
  height: 100%;
}
</style>