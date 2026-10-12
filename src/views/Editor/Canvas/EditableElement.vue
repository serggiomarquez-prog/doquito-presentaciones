<template>
  <div 
    class="editable-element"
    ref="elementRef"
    :id="`editable-element-${elementInfo.id}`"
    :style="{
      zIndex: elementIndex,
    }"
  >
    <component
      :is="currentElementComponent"
      :elementInfo="elementInfo"
      :selectElement="selectElement"
      :contextmenus="contextmenus"
    ></component>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { ElementTypes, type PPTElement } from '@/types/slides'
import type { ContextmenuItem } from '@/components/Contextmenu/types'

import useLockElement from '@/hooks/useLockElement'
import useDeleteElement from '@/hooks/useDeleteElement'
import useCombineElement from '@/hooks/useCombineElement'
import useOrderElement from '@/hooks/useOrderElement'
import useAlignElementToCanvas from '@/hooks/useAlignElementToCanvas'
import useCopyAndPasteElement from '@/hooks/useCopyAndPasteElement'
import useSelectElement from '@/hooks/useSelectElement'

import { ElementOrderCommands, ElementAlignCommands } from '@/types/edit'

import ImageElement from '@/views/components/element/ImageElement/index.vue'
import TextElement from '@/views/components/element/TextElement/index.vue'
import ShapeElement from '@/views/components/element/ShapeElement/index.vue'
import LineElement from '@/views/components/element/LineElement/index.vue'
import ChartElement from '@/views/components/element/ChartElement/index.vue'
import TableElement from '@/views/components/element/TableElement/index.vue'
import LatexElement from '@/views/components/element/LatexElement/index.vue'
import VideoElement from '@/views/components/element/VideoElement/index.vue'
import AudioElement from '@/views/components/element/AudioElement/index.vue'

const props = defineProps<{
  elementInfo: PPTElement
  elementIndex: number
  isMultiSelect: boolean
  selectElement: (e: MouseEvent | TouchEvent, element: PPTElement, canMove?: boolean) => void
  openLinkDialog: () => void
}>()

const currentElementComponent = computed<unknown>(() => {
  const elementTypeMap = {
    [ElementTypes.IMAGE]: ImageElement,
    [ElementTypes.TEXT]: TextElement,
    [ElementTypes.SHAPE]: ShapeElement,
    [ElementTypes.LINE]: LineElement,
    [ElementTypes.CHART]: ChartElement,
    [ElementTypes.TABLE]: TableElement,
    [ElementTypes.LATEX]: LatexElement,
    [ElementTypes.VIDEO]: VideoElement,
    [ElementTypes.AUDIO]: AudioElement,
  }
  return elementTypeMap[props.elementInfo.type] || null
})

const { orderElement } = useOrderElement()
const { alignElementToCanvas } = useAlignElementToCanvas()
const { combineElements, uncombineElements } = useCombineElement()
const { deleteElement } = useDeleteElement()
const { lockElement, unlockElement } = useLockElement()
const { copyElement, pasteElement, cutElement } = useCopyAndPasteElement()
const { selectAllElements } = useSelectElement()

const contextmenus = (): ContextmenuItem[] => {
  if (props.elementInfo.lock) {
    return [{
      text: 'Desbloquear', 
      handler: () => unlockElement(props.elementInfo),
    }]
  }

  return [
    {
      text: 'Cortar',
      subText: 'Ctrl + X',
      handler: cutElement,
    },
    {
      text: 'Copiar',
      subText: 'Ctrl + C',
      handler: copyElement,
    },
    {
      text: 'Pegar',
      subText: 'Ctrl + V',
      handler: pasteElement,
    },
    { divider: true },
    {
      text: 'Centrar en horizontal',
      handler: () => alignElementToCanvas(ElementAlignCommands.HORIZONTAL),
      children: [
        { text: 'Centrar en horizontal y vertical', handler: () => alignElementToCanvas(ElementAlignCommands.CENTER), },
        { text: 'Centrar en horizontal', handler: () => alignElementToCanvas(ElementAlignCommands.HORIZONTAL) },
        { text: 'Alinear a la izquierda', handler: () => alignElementToCanvas(ElementAlignCommands.LEFT) },
        { text: 'Alinear a la derecha', handler: () => alignElementToCanvas(ElementAlignCommands.RIGHT) },
      ],
    },
    {
      text: 'Centrar en vertical',
      handler: () => alignElementToCanvas(ElementAlignCommands.VERTICAL),
      children: [
        { text: 'Centrar en horizontal y vertical', handler: () => alignElementToCanvas(ElementAlignCommands.CENTER) },
        { text: 'Centrar en vertical', handler: () => alignElementToCanvas(ElementAlignCommands.VERTICAL) },
        { text: 'Alinear arriba', handler: () => alignElementToCanvas(ElementAlignCommands.TOP) },
        { text: 'Alinear abajo', handler: () => alignElementToCanvas(ElementAlignCommands.BOTTOM) },
      ],
    },
    { divider: true },
    {
      text: 'Traer al frente',
      disable: props.isMultiSelect && !props.elementInfo.groupId,
      handler: () => orderElement(props.elementInfo, ElementOrderCommands.TOP),
      children: [
        { text: 'Traer al frente', handler: () => orderElement(props.elementInfo, ElementOrderCommands.TOP) },
        { text: 'Traer adelante', handler: () => orderElement(props.elementInfo, ElementOrderCommands.UP) },
      ],
    },
    {
      text: 'Enviar al fondo',
      disable: props.isMultiSelect && !props.elementInfo.groupId,
      handler: () => orderElement(props.elementInfo, ElementOrderCommands.BOTTOM),
      children: [
        { text: 'Enviar al fondo', handler: () => orderElement(props.elementInfo, ElementOrderCommands.BOTTOM) },
        { text: 'Enviar atrás', handler: () => orderElement(props.elementInfo, ElementOrderCommands.DOWN) },
      ],
    },
    { divider: true },
    {
      text: 'Añadir enlace',
      handler: props.openLinkDialog,
    },
    {
      text: props.elementInfo.groupId ? 'Desagrupar' : 'Agrupar',
      subText: 'Ctrl + G',
      handler: props.elementInfo.groupId ? uncombineElements : combineElements,
      hide: !props.isMultiSelect,
    },
    {
      text: 'Seleccionar todo',
      subText: 'Ctrl + A',
      handler: selectAllElements,
    },
    {
      text: 'Bloquear',
      subText: 'Ctrl + L',
      handler: lockElement,
    },
    {
      text: 'Borrar',
      subText: 'Delete',
      handler: deleteElement,
    },
  ]
}
</script>