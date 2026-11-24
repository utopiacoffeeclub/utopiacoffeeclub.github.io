# Rediseño «Noche de barra» — plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans. Steps use `- [ ]`.

**Goal:** Aplicar el estilo Noche de barra (claro/oscuro según el sistema) a `index.html` sin cambiar su funcionamiento.
**Architecture:** Un bloque CSS final «Rediseño» que redefine los tokens y re-estiliza los componentes existentes; Inter local en `fonts/`; un único añadido de JS: el efectivo de la caja en la cabecera.
**Tech Stack:** CSS, JS sin dependencias; pruebas Playwright de `tests/`.
**Spec:** `docs/superpowers/specs/2026-11-24-rediseno-noche-de-barra-design.md`

## Global Constraints
- Colores exactos del spec; un solo acento por modo. Botones ≥ 48 px. Texto ≥ 15 px salvo etiquetas.
- Sin servicios externos (fuentes en `fonts/`). Versión en `sw.js` y Ajustes a la vez.
- `node tests/run.js` en verde.

## Review Focus
- Contraste del acento y del texto secundario en los dos modos (≥ 4,5:1).
- 360 px sin desbordes (prueba existente).
- iPad horizontal (1180 px): la Cafetera sigue usando el ancho.
- Modo oscuro forzado desde Ajustes (`data-theme`) también usa la paleta nueva.
- Pantallas con tablas y gráficos (Datos) legibles en oscuro.

### Task 1: Paleta, letra y componentes
**Files:** `index.html` (bloque CSS final), `fonts/inter-*.woff2`, `sw.js`; Test: `tests/diseno.test.js`
- [ ] Prueba: en modo oscuro el fondo es rgb(21,16,14), en claro rgb(246,241,234), el cuerpo usa Inter, el acento del botón de cobrar es el del spec, y la carta se ve en lista (una columna). Verla fallar.
- [ ] Bloque CSS + Inter local + versión. Verde. Capturas 412 px oscuro/claro e iPad 1180 px.
### Task 2: Efectivo de la caja en la cabecera
**Files:** `index.html`; Test: `tests/diseno.test.js`
- [ ] Prueba: con caja abierta (fondo 150 + 1 pedido en efectivo 2,20) la cabecera muestra «152,20 €»; con caja cerrada no muestra importe. Verla fallar; implementar; verde.
