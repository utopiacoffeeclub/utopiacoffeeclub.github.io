# Rutina de revisión y mejora — plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dejar en el repo unas pruebas automáticas, las reglas y la lista de pendientes, y programar las tareas L–J (mejora) y viernes (revisión y publicación).

**Architecture:** Pruebas de extremo a extremo con Playwright contra la app servida desde disco, con `vendor/supabase.js` sustituido por un cliente falso en memoria (`tests/mock-supa.js`) y datos de `supabase/seed.sql`. Rama `mejoras` para el trabajo; `main` solo con el «sube» del viernes.

**Tech Stack:** Node 18+, Playwright (ya instalado en el entorno, `require("playwright")`), sin dependencias nuevas.

**Spec:** `docs/superpowers/specs/2026-11-23-rutina-mejora-design.md`

## Global Constraints
- Todo en castellano (textos, mensajes a Mario, commits).
- Versión: subir a la vez `VERSION` de `sw.js` (`utopia-vNN`) y `>Versión NN<` de `index.html`.
- Nunca `git push` a `main` sin un «sube» explícito de Mario en el chat.
- Sin cambios en Supabase (tablas, funciones, cron ni datos reales).
- Pruebas: `node tests/run.js` debe acabar con código 0.

## Review Focus
- Móvil estrecho (360 px): nada se sale por la derecha → `tests/nav.test.js` comprueba `scrollWidth <= innerWidth` a 360 px.
- Pedido sin cobrar de un día con la caja ya cerrada: el efectivo entra como una sola entrada en la caja de hoy → `tests/sinCobrar.test.js`.
- Cierre contado sin desglose (modo rápido): no debe aparecer «Saca del cajón» → `tests/sacar.test.js`.
- Con 40 pedidos, entregar uno no repinta la carta entera → `tests/perf.test.js` (0 repintados de `#menuGrid`).
- Errores de JavaScript en cualquier pantalla → cada prueba falla si hay `pageerror`.

---

### Task 1: Arnés de pruebas
**Files:** Create `tests/mock-supa.js`, `tests/lib.js`, `tests/run.js`, `tests/nav.test.js`, `tests/sinCobrar.test.js`, `tests/sacar.test.js`, `tests/perf.test.js`
**Interfaces — Produces:** `lib.open({role, width, seedExtra, hash}) -> {page, errors, close()}`; `lib.seedBase()` -> filas de `seed.sql` con `config.setupDone=true`; cada `*.test.js` exporta `async (lib, assert) => void`.
- [ ] Copiar el cliente falso a `tests/mock-supa.js`.
- [ ] Escribir `lib.js` (sirve el repo en `https://app.test/`, sin service worker) y `run.js` (ejecuta todos los `*.test.js`, imprime ✔/✘ y sale con 1 si alguno falla).
- [ ] Pruebas con aserciones: navegación (5 botones, subapartados, enlace antiguo `#ajustes`, 360 px sin desbordar), «Sin cobrar» (agrupa por persona, cobra 3 pedidos, entrada única en caja), «qué sacar» (cierre 282,50 € → suma 132,50 €, saca 30 de 1 €; sin desglose no aparece), rendimiento (0 repintados de carta al entregar).
- [ ] `node tests/run.js` → todo ✔. Commit.

### Task 2: Reglas y listas
**Files:** Create `CLAUDE.md`, `docs/mejoras/pendientes.md`, `docs/mejoras/semana.md`
- [ ] `CLAUDE.md`: qué es la app, archivos clave, ramas, versión, pruebas, prohibiciones, método superpowers, ideas descartadas.
- [ ] `pendientes.md` con las primeras entradas; `semana.md` vacío con formato `## AAAA-MM-DD · título` + qué cambió + qué no se probó en el móvil.
- [ ] Commit y push de la rama `mejoras`.

### Task 3: Tareas programadas
- [ ] Crear «Utopía: mejora diaria» (`CRON_TZ=Europe/Madrid 13 17 * * 1-4`).
- [ ] Crear «Utopía: revisión del viernes» (`CRON_TZ=Europe/Madrid 13 17 * * 5`).
- [ ] Comprobar con `list_triggers` que están activas y con la próxima ejecución correcta.
