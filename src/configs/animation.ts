import type { TurningMode } from '@/types/slides'

export const ANIMATION_DEFAULT_DURATION = 1000
export const ANIMATION_DEFAULT_TRIGGER = 'click'
export const ANIMATION_CLASS_PREFIX = 'animate__'

export const ENTER_ANIMATIONS = [
  {
    type: 'bounce',
    name: 'Rebote',
    children: [
      { name: 'Rebotar', value: 'bounceIn' },
      { name: 'Rebotar desde la izquierda', value: 'bounceInLeft' },
      { name: 'Rebotar desde la derecha', value: 'bounceInRight' },
      { name: 'Rebotar desde abajo', value: 'bounceInUp' },
      { name: 'Rebotar desde arriba', value: 'bounceInDown' },
    ],
  },
  {
    type: 'fade',
    name: 'Aparecer',
    children: [
      { name: 'Flotar', value: 'fadeIn' },
      { name: 'Flotar desde arriba', value: 'fadeInDown' },
      { name: 'Flotar desde arriba (largo)', value: 'fadeInDownBig' },
      { name: 'Flotar desde la izquierda', value: 'fadeInLeft' },
      { name: 'Flotar desde la izquierda (largo)', value: 'fadeInLeftBig' },
      { name: 'Flotar desde la derecha', value: 'fadeInRight' },
      { name: 'Flotar desde la derecha (largo)', value: 'fadeInRightBig' },
      { name: 'Flotar desde abajo', value: 'fadeInUp' },
      { name: 'Flotar desde abajo (largo)', value: 'fadeInUpBig' },
      { name: 'Flotar desde arriba a la izquierda', value: 'fadeInTopLeft' },
      { name: 'Flotar desde arriba a la derecha', value: 'fadeInTopRight' },
      { name: 'Flotar desde abajo a la izquierda', value: 'fadeInBottomLeft' },
      { name: 'Flotar desde abajo a la derecha', value: 'fadeInBottomRight' },
    ],
  },
  {
    type: 'rotate',
    name: 'Girar',
    children: [
      { name: 'Entrar girando', value: 'rotateIn' },
      { name: 'Girar desde abajo a la izquierda', value: 'rotateInDownLeft' },
      { name: 'Girar desde abajo a la derecha', value: 'rotateInDownRight' },
      { name: 'Girar desde arriba a la izquierda', value: 'rotateInUpLeft' },
      { name: 'Girar desde arriba a la derecha', value: 'rotateInUpRight' },
    ],
  },
  {
    type: 'zoom',
    name: 'Zoom',
    children: [
      { name: 'Entrar ampliando', value: 'zoomIn' },
      { name: 'Ampliar desde arriba', value: 'zoomInDown' },
      { name: 'Ampliar desde la izquierda', value: 'zoomInLeft' },
      { name: 'Ampliar desde la derecha', value: 'zoomInRight' },
      { name: 'Ampliar desde abajo', value: 'zoomInUp' },
    ],
  },
  {
    type: 'slide',
    name: 'Deslizar',
    children: [
      { name: 'Deslizar desde arriba', value: 'slideInDown' },
      { name: 'Deslizar desde la derecha', value: 'slideInLeft' },
      { name: 'Deslizar desde la izquierda', value: 'slideInRight' },
      { name: 'Deslizar desde abajo', value: 'slideInUp' },
    ],
  },
  {
    type: 'flip',
    name: 'Voltear',
    children: [
      { name: 'XVoltear al entrar', value: 'flipInX' },
      { name: 'YVoltear al entrar', value: 'flipInY' },
    ],
  },
  {
    type: 'back',
    name: 'Deslizar ampliando',
    children: [
      { name: 'Deslizar ampliando desde arriba', value: 'backInDown' },
      { name: 'Deslizar ampliando desde la izquierda', value: 'backInLeft' },
      { name: 'Deslizar ampliando desde la derecha', value: 'backInRight' },
      { name: 'Deslizar ampliando desde abajo', value: 'backInUp' },
    ],
  },
  {
    type: 'lightSpeed',
    name: 'Volar',
    children: [
      { name: 'Volar desde la derecha', value: 'lightSpeedInRight' },
      { name: 'Volar desde la izquierda', value: 'lightSpeedInLeft' },
    ],
  },
]

export const EXIT_ANIMATIONS = [
  {
    type: 'bounce',
    name: 'Rebote',
    children: [
      { name: 'Salir rebotando', value: 'bounceOut' },
      { name: 'Salir rebotando a la izquierda', value: 'bounceOutLeft' },
      { name: 'Salir rebotando a la derecha', value: 'bounceOutRight' },
      { name: 'Salir rebotando hacia arriba', value: 'bounceOutUp' },
      { name: 'Salir rebotando hacia abajo', value: 'bounceOutDown' },
    ],
  },
  {
    type: 'fade',
    name: 'Aparecer',
    children: [
      { name: 'Salir flotando', value: 'fadeOut' },
      { name: 'Salir flotando hacia abajo', value: 'fadeOutDown' },
      { name: 'Salir flotando hacia abajo (largo)', value: 'fadeOutDownBig' },
      { name: 'Salir flotando a la izquierda', value: 'fadeOutLeft' },
      { name: 'Salir flotando a la izquierda (largo)', value: 'fadeOutLeftBig' },
      { name: 'Salir flotando a la derecha', value: 'fadeOutRight' },
      { name: 'Salir flotando a la derecha (largo)', value: 'fadeOutRightBig' },
      { name: 'Salir flotando hacia arriba', value: 'fadeOutUp' },
      { name: 'Salir flotando hacia arriba (largo)', value: 'fadeOutUpBig' },
      { name: 'Salir flotando arriba a la izquierda', value: 'fadeOutTopLeft' },
      { name: 'Salir flotando arriba a la derecha', value: 'fadeOutTopRight' },
      { name: 'Salir flotando abajo a la izquierda', value: 'fadeOutBottomLeft' },
      { name: 'Salir flotando abajo a la derecha', value: 'fadeOutBottomRight' },
    ],
  },
  {
    type: 'rotate',
    name: 'Girar',
    children: [
      { name: 'Salir girando', value: 'rotateOut' },
      { name: 'Salir girando abajo a la izquierda', value: 'rotateOutDownLeft' },
      { name: 'Salir girando abajo a la derecha', value: 'rotateOutDownRight' },
      { name: 'Salir girando arriba a la izquierda', value: 'rotateOutUpLeft' },
      { name: 'Salir girando arriba a la derecha', value: 'rotateOutUpRight' },
    ],
  },
  {
    type: 'zoom',
    name: 'Zoom',
    children: [
      { name: 'Salir reduciendo', value: 'zoomOut' },
      { name: 'Reducir hacia abajo', value: 'zoomOutDown' },
      { name: 'Reducir hacia la izquierda', value: 'zoomOutLeft' },
      { name: 'Reducir hacia la derecha', value: 'zoomOutRight' },
      { name: 'Reducir hacia arriba', value: 'zoomOutUp' },
    ],
  },
  {
    type: 'slide',
    name: 'Salir deslizando',
    children: [
      { name: 'Deslizar hacia abajo', value: 'slideOutDown' },
      { name: 'Deslizar a la izquierda', value: 'slideOutLeft' },
      { name: 'Deslizar a la derecha', value: 'slideOutRight' },
      { name: 'Deslizar hacia arriba', value: 'slideOutUp' },
    ],
  },
  {
    type: 'flip',
    name: 'Voltear',
    children: [
      { name: 'XVoltear al salir', value: 'flipOutX' },
      { name: 'YVoltear al salir', value: 'flipOutY' },
    ],
  },
  {
    type: 'back',
    name: 'Deslizar reduciendo',
    children: [
      { name: 'Deslizar reduciendo hacia abajo', value: 'backOutDown' },
      { name: 'Deslizar reduciendo a la izquierda', value: 'backOutLeft' },
      { name: 'Deslizar reduciendo a la derecha', value: 'backOutRight' },
      { name: 'Deslizar reduciendo hacia arriba', value: 'backOutUp' },
    ],
  },
  {
    type: 'lightSpeed',
    name: 'Salir volando',
    children: [
      { name: 'Volar a la derecha', value: 'lightSpeedOutRight' },
      { name: 'Volar a la izquierda', value: 'lightSpeedOutLeft' },
    ],
  },
]

export const ATTENTION_ANIMATIONS = [
  {
    type: 'shake',
    name: 'Sacudir',
    children: [
      { name: 'Balancear a los lados', value: 'shakeX' },
      { name: 'Balancear arriba y abajo', value: 'shakeY' },
      { name: 'Negar', value: 'headShake' },
      { name: 'Oscilar', value: 'swing' },
      { name: 'Sacudir', value: 'wobble' },
      { name: 'Susto', value: 'tada' },
      { name: 'Gelatina', value: 'jello' },
    ],
  },
  {
    type: 'other',
    name: 'Otros',
    children: [
      { name: 'Rebote', value: 'bounce' },
      { name: 'Parpadeo', value: 'flash' },
      { name: 'Pulso', value: 'pulse' },
      { name: 'Goma elástica', value: 'rubberBand' },
      { name: 'Latido (rápido)', value: 'heartBeat' },
    ],
  },
]

interface SlideAnimation {
  label: string
  value: TurningMode
}

export const SLIDE_ANIMATIONS: SlideAnimation[] = [
  { label: 'Ninguno', value: 'no' },
  { label: 'Aleatorio', value: 'random' },
  { label: 'Empujar en horizontal', value: 'slideX' },
  { label: 'Empujar en vertical', value: 'slideY' },
  { label: 'Empujar en horizontal (3D)', value: 'slideX3D' },
  { label: 'Empujar en vertical (3D)', value: 'slideY3D' },
  { label: 'Fundido', value: 'fade' },
  { label: 'Girar', value: 'rotate' },
  { label: 'Abrir en vertical', value: 'scaleY' },
  { label: 'Abrir en horizontal', value: 'scaleX' },
  { label: 'Ampliar', value: 'scale' },
  { label: 'Reducir', value: 'scaleReverse' },
]