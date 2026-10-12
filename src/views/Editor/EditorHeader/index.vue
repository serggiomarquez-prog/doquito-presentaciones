<template>
  <div class="editor-header">
    <div class="left">
      <div class="menu-item back" v-if="inDoquito" v-tooltip="'Volver a Mis documentos'" @click="goBack()"><i-icon-park-outline:left class="icon" /></div>
      <svg class="doquito-logo" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="8" fill="#6d4aff"/><path d="M10 8h7.5a7.5 7.5 0 0 1 0 15H10z" fill="none" stroke="#fff" stroke-width="2.5"/><circle cx="22.5" cy="23.5" r="2.5" fill="#c4b5fd"/></svg>
      <Popover trigger="click" placement="bottom-start" v-model:value="mainMenuVisible">
        <template #content>
          <div class="main-menu">
          </div>
          <div class="import-section">
            <div class="import-label">Abrir archivo</div>
            <div class="import-grid">
              <FileInput class="import-block" accept="application/vnd.openxmlformats-officedocument.presentationml.presentation" @change="files => {
                importPPTXFile(files)
                mainMenuVisible = false
              }">
                <span class="icon"><i-custom:file-ppt /></span>
                <span class="label">PPTX</span>
                <span class="sub-label">(experimental)</span>
              </FileInput>
              <FileInput class="import-block" accept=".json" @change="files => {
                importJSON(files)
                mainMenuVisible = false
              }">
                <span class="icon"><i-custom:file-jpg /></span>
                <span class="label">JSON</span>
                <span class="sub-label">(experimental)</span>
              </FileInput>
              <FileInput class="import-block" accept=".pptist" @change="files => {
                importSpecificFile(files)
                mainMenuVisible = false
              }">
                <span class="icon"><i-custom:file-pptist /></span>
                <span class="label">PPTIST</span>
                <span class="sub-label">(formato propio)</span>
              </FileInput>
            </div>
          </div>
          <Divider :margin="10" />
          <PopoverMenuItem class="popover-menu-item" @click="setDialogForExport('pptx')"><i-icon-park-outline:download class="icon" /> Descargar</PopoverMenuItem>
          <Divider :margin="10" />
          <PopoverMenuItem class="popover-menu-item" @click="resetSlides(); mainMenuVisible = false"><i-icon-park-outline:refresh class="icon" /> Empezar de cero</PopoverMenuItem>
          <PopoverMenuItem class="popover-menu-item" @click="openMarkupPanel(); mainMenuVisible = false"><i-icon-park-outline:mark class="icon" /> Marcar tipos de diapositiva</PopoverMenuItem>
          <PopoverMenuItem class="popover-menu-item" @click="mainMenuVisible = false; hotkeyDrawerVisible = true"><i-icon-park-outline:command class="icon" /> Atajos de teclado</PopoverMenuItem>
          <Divider :margin="10" />
          <div class="statement">Editor basado en <a href="https://github.com/pipipi-pikachu/PPTist" target="_blank" rel="noopener">PPTist</a> (licencia AGPL-3.0). <a :href="SOURCE_URL" target="_blank" rel="noopener">Ver el código de este editor</a>.</div>
        </template>
        <div class="menu-item"><i-icon-park-outline:hamburger-button class="icon" /></div>
      </Popover>

      <div class="title">
        <Input 
          class="title-input" 
          ref="titleInputRef"
          v-model:value="titleValue" 
          @blur="handleUpdateTitle()" 
          v-if="editingTitle" 
        ></Input>
        <div 
          class="title-text"
          @click="startEditTitle()"
          :title="title"
          v-else
        >{{ title }}</div>
      </div>
      <span class="save-status" v-if="inDoquito && saveStatus !== 'idle'" :class="saveStatus">{{ STATUS_TEXT[saveStatus] }}</span>
    </div>

    <div class="right">
      <div class="menu-item labeled" @click="setDialogForExport('pptx')">
        <i-icon-park-outline:download class="icon" /> <span>Descargar</span>
      </div>
      <div class="group-menu-item present">
        <div class="menu-item labeled" v-tooltip="'Presentar (F5)'" @click="enterScreening()">
          <i-icon-park-outline:play class="icon" /> <span>Presentar</span>
        </div>
        <Popover trigger="click" center>
          <template #content>
            <PopoverMenuItem class="popover-menu-item" @click="enterScreeningFromStart()"><i-icon-park-outline:slide-two class="icon" /> Desde el principio</PopoverMenuItem>
            <PopoverMenuItem class="popover-menu-item" @click="enterScreening()"><i-icon-park-outline:ppt class="icon" /> Desde la diapositiva actual</PopoverMenuItem>
          </template>
          <div class="arrow-btn"><i-icon-park-outline:down class="arrow" /></div>
        </Popover>
      </div>
    </div>

    <Drawer
      :width="320"
      v-model:visible="hotkeyDrawerVisible"
      placement="right"
    >
      <HotkeyDoc />
      <template v-slot:title>Atajos de teclado</template>
    </Drawer>

    <FullscreenSpin :loading="exporting" tip="Importando…" />
  </div>
</template>

<script lang="ts" setup>
import { nextTick, ref, useTemplateRef } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import useScreening from '@/hooks/useScreening'
import useImport from '@/hooks/useImport'
import useSlideHandler from '@/hooks/useSlideHandler'
import type { DialogForExportTypes } from '@/types/export'
import { inDoquito, goBack, saveStatus, type SaveStatus } from '@/doquito/bridge'
import { SOURCE_URL } from '@/doquito/config'

import HotkeyDoc from './HotkeyDoc.vue'
import FileInput from '@/components/FileInput.vue'
import FullscreenSpin from '@/components/FullscreenSpin.vue'
import Drawer from '@/components/Drawer.vue'
import Input from '@/components/Input.vue'
import Popover from '@/components/Popover.vue'
import PopoverMenuItem from '@/components/PopoverMenuItem.vue'
import Divider from '@/components/Divider.vue'

const mainStore = useMainStore()
const slidesStore = useSlidesStore()
const { title } = storeToRefs(slidesStore)
const { enterScreening, enterScreeningFromStart } = useScreening()
const { importSpecificFile, importPPTXFile, importJSON, exporting } = useImport()
const { resetSlides } = useSlideHandler()

const mainMenuVisible = ref(false)
const hotkeyDrawerVisible = ref(false)
const editingTitle = ref(false)
const titleValue = ref('')
const titleInputRef = useTemplateRef<InstanceType<typeof Input>>('titleInputRef')

const startEditTitle = () => {
  titleValue.value = title.value
  editingTitle.value = true
  nextTick(() => titleInputRef.value?.focus())
}

const handleUpdateTitle = () => {
  slidesStore.setTitle(titleValue.value)
  editingTitle.value = false
}

const STATUS_TEXT: Record<SaveStatus, string> = { idle: '', saving: 'Guardando…', saved: '✓ Guardado', error: 'No se pudo guardar', offline: 'Sin conexión: se guardará al volver' }

const setDialogForExport = (type: DialogForExportTypes) => {
  mainStore.setDialogForExport(type)
  mainMenuVisible.value = false
}

const openMarkupPanel = () => {
  mainStore.setMarkupPanelState(true)
}

</script>

<style lang="scss" scoped>
.editor-header {
  background-color: $headerBg;
  height: 52px;
  user-select: none;
  border-bottom: 1px solid $borderColor;
  display: flex;
  justify-content: space-between;
  padding: 0 5px;
}
.left, .right {
  display: flex;
  justify-content: center;
  align-items: center;
}
.menu-item {
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  padding: 0 10px;
  border-radius: $borderRadius;
  cursor: pointer;

  .icon {
    font-size: 18px;
    color: $textColor2;
  }
  .text {
    width: 18px;
    text-align: center;
    font-size: 17px;
  }

  &:hover {
    background-color: $hoverBg;
  }
}
.popover-menu-item {
  display: flex;
  padding: 8px 10px;

  .icon {
    font-size: 18px;
    margin-right: 10px;
  }
}
.statement {
  font-size: 12px;
  color: $subTextColor;
  padding: 8px 10px;
  font-style: italic;
}
.main-menu {
  width: 300px;
}
.import-section {
  padding: 5px 0;

  .import-label {
    font-size: 12px;
    color: $subTextColor;
    margin-bottom: 6px;
  }
  .import-grid {
    display: flex;
    gap: 8px;
    justify-content: space-between;
  }
  .import-block {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 12px 8px;
    border-radius: $borderRadius;
    border: 1px solid $borderColor;
    transition: background-color .2s;
    cursor: pointer;
  
    &:hover {
      background-color: $hoverBg;
    }
    .icon {
      font-size: 24px;
      margin-bottom: 2px;
    }
    .label {
      font-size: 12px;
      text-align: center;
    }
    .sub-label {
      font-size: 10px;
      color: $subTextColor;
    }
  }
}

.group-menu-item {
  height: 30px;
  display: flex;
  margin: 0 8px;
  padding: 0 2px;
  border-radius: $borderRadius;

  &:hover {
    background-color: $hoverBg;
  }

  .menu-item {
    padding: 0 3px;
  }
  .arrow-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
}
.title {
  height: 30px;
  margin-left: 2px;
  font-size: 13px;

  .title-input {
    width: 200px;
    height: 100%;
    padding-left: 0;
    padding-right: 0;

    ::v-deep(input) {
      height: 28px;
      line-height: 28px;
    }
  }
  .title-text {
    min-width: 20px;
    max-width: 400px;
    line-height: 30px;
    padding: 0 6px;
    border-radius: $borderRadius;
    cursor: pointer;

    @include ellipsis-oneline();

    &:hover {
      background-color: $hoverBg;
    }
  }
}
.doquito-logo {
  width: 26px;
  height: 26px;
  margin: 0 4px 0 2px;
  flex: none;
}
.save-status {
  margin-left: 8px;
  font-size: 12px;
  color: $subTextColor;
  white-space: nowrap;

  &.error { color: #f87171; }
  &.saved { color: #86efac; }
}
.menu-item.labeled {
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  margin-left: 4px;
}
.group-menu-item.present {
  background-color: $themeColor;
  border-radius: 8px;
  margin-right: 4px;

  .menu-item, .arrow-btn, .icon, .arrow { color: #fff; }
  .menu-item:hover, &:hover { background-color: $themeHoverColor; }
}
</style>