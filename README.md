# Editor de presentaciones de Doquito

Este es el editor de presentaciones de [Doquito](https://doquito.com). Está **basado en [PPTist](https://github.com/pipipi-pikachu/PPTist)**, de pipipi-pikachu, y se distribuye con la misma licencia: **GNU AGPL-3.0** (ver `LICENSE`).

## Cambios respecto a PPTist

- Interfaz traducida al español, también las plantillas de ejemplo.
- Tema oscuro con los colores de Doquito y una cabecera propia: volver, título, estado del guardado, Descargar y Presentar.
- Sin servicios externos. Se quitaron la IA y el buscador de imágenes, que usaban `server.pptist.cn`.
- Fuentes latinas en lugar de las chinas, que pesaban unos 47 MB.
- Integración con Doquito (`src/doquito/`):
  - La presentación se carga y se guarda sola en la cuenta, mediante `postMessage` con la página que la contiene.
  - Las imágenes se suben al almacenamiento de Doquito.
  - La mascota se oculta mientras se presenta.

## Desarrollo

```bash
pnpm --filter @docuia/slides dev
```

```bash
pnpm --filter @docuia/slides build
```

`build` deja el resultado en `apps/web/public/slides`, desde donde la web lo sirve en `/slides/`.
