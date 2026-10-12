import { nanoid } from 'nanoid'
import type { Slide } from '@/types/slides'

/** Primera diapositiva de una presentación nueva (lienzo de 1000 × 562,5). */
export function blankDeck(): Slide[] {
  return [
    {
      id: nanoid(10),
      background: { type: 'solid', color: '#ffffff' },
      elements: [
        {
          type: 'shape', id: nanoid(10), left: 0, top: 0, width: 18, height: 562.5,
          viewBox: [200, 200], path: 'M 0 0 L 200 0 L 200 200 L 0 200 Z', fill: '#6d4aff', fixedRatio: false, rotate: 0,
        },
        {
          type: 'shape', id: nanoid(10), left: 840, top: 40, width: 120, height: 120,
          viewBox: [200, 200], path: 'M 100 0 A 50 50 0 1 1 100 200 A 50 50 0 1 1 100 0 Z', fill: '#f1edff', fixedRatio: true, rotate: 0,
        },
        {
          type: 'text', id: nanoid(10), left: 90, top: 170, width: 820, height: 90, rotate: 0, lineHeight: 1.1,
          content: '<p><strong><span style="font-size: 54px;">Título de tu presentación</span></strong></p>',
          defaultFontName: 'Poppins', defaultColor: '#1b1035',
        },
        {
          type: 'text', id: nanoid(10), left: 90, top: 290, width: 820, height: 50, rotate: 0,
          content: '<p><span style="font-size: 26px;">Subtítulo · tu nombre</span></p>',
          defaultFontName: 'Poppins', defaultColor: '#6b5f8e',
        },
      ],
    },
  ]
}
