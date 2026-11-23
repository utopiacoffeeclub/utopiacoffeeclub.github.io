# Utopía Coffee Club · app de comandas

App web instalable (PWA) de la cafetería takeaway Utopía Coffee Club (Valladolid). La usan Mario en el mostrador (Samsung S26) y Laura en la cafetera (iPad). Abren **sábados y domingos**. Todo en **castellano de España**: textos, mensajes y commits.

## Archivos
- `index.html` — la app del equipo (todo en un archivo: estilos, HTML y JS). Pestañas: Mostrador, Cafetera, Dinero, Almacén y ⚙ Ajustes.
- `pedir.html` — página de los clientes (pedidos de cafetería y tienda de Puchero). `privacidad.html` — política de datos.
- `store.js` — adaptador de Supabase (imita `db.collection().doc()`); escrituras optimistas.
- `sw.js` — service worker; `VERSION = "utopia-vNN"`.
- `supabase/` — esquema y datos de ejemplo (`seed.sql`, lo usan las pruebas). La base real es el proyecto `inswxtucoxksnsacepfa`.
- `tests/` — pruebas: `node tests/run.js` (o `node tests/run.js sacar` para un archivo). Supabase falso en memoria y Playwright.

## Ramas y publicación
- `main` = lo que está en marcha. GitHub Pages lo publica solo en https://utopiacoffeeclub.github.io/ y se actualiza en el móvil y el iPad.
- `mejoras` = trabajo de la semana (lunes a jueves). **Nunca** hagas push ni merge **a** `main` sin un «sube» explícito de Mario en el chat; eso solo pasa el viernes. (Mezclar `main` en `mejoras` sí está permitido.)
- Cada cambio visible: sube a la vez `VERSION` en `sw.js` y `>Versión NN<` en `index.html`.
- Push con `git -c push.negotiate=true push origin <rama>`; autor `mgsandonis-hash <mgsandonis@gmail.com>`.

## Método (superpowers)
1. Un fallo → `superpowers:systematic-debugging` y primero una prueba que lo reproduzca (`superpowers:test-driven-development`).
2. Una mejora → prueba primero, código mínimo, `node tests/run.js` en verde.
3. Antes de decir «hecho» → `superpowers:verification-before-completion`: ejecutar la suite y mirar la app con una captura a 412 px hecha **solo con `lib.open()` de `tests/lib.js`** (Supabase falso). Nunca abras `index.html` a pelo ni la web publicada para capturas: se conectarían a la base de datos real. Guarda las capturas en `capturas/` (ignorada por git).
4. Una mejora pequeña por día. Si algo crece, se apunta en `docs/mejoras/pendientes.md` y se para.

## Prohibido sin preguntar a Mario
- Usar `git add -A` o `git add .`: añade los archivos por su nombre.
- Cambiar Supabase: tablas, funciones, cron, datos reales (ni siquiera «arreglar» datos). No uses las herramientas de Supabase, Gmail ni Drive: la rutina no las necesita.
- Tocar el aviso por correo de la tienda, el cobro (importes, Bizum, caja, caja fuerte) o la página de clientes sin decirlo claramente en el resumen.
- Reorganizar las pestañas o quitar funciones que ya usan.
- Añadir dependencias o servicios de pago. Todo tiene que seguir siendo gratis.

## Ideas descartadas
(ninguna todavía; apúntalas aquí cuando Mario diga que no a algo)
