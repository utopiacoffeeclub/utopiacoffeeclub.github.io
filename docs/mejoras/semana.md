# Diario de mejoras de la semana

La rutina añade una entrada por día; el viernes se revisa todo junto y, si Mario dice «sube», se publica y este archivo se vacía (queda en el historial de git).

Formato:

## AAAA-MM-DD · título corto
- Qué cambia para Mario o Laura (en una o dos frases).
- Pruebas: `node tests/run.js` → N bien, 0 mal.
- Sin probar en el móvil: lo que no se ha podido comprobar.

## 2026-11-23 · El enlace antiguo #ajustes abre QR y pagos · publicado el 24/11
- En un móvil o iPad nuevo, el enlace viejo `#ajustes` ya no lleva a Escandallos sino a Ajustes → QR y pagos. Si ya habías usado otro apartado, sigue abriendo el último que usaste. Causa: al arrancar, la app guardaba «suministros» como recuerdo antes de leer el enlace.
- Pruebas: `node tests/run.js` → 13 bien, 0 mal.
- Sin probar en el móvil: abrir el enlace en el Samsung y el iPad de verdad (solo probado con Supabase falso en el ordenador).

## 2026-11-24 · Rediseño «Noche de barra» · publicado y retirado el 24/11 (Mario prefiere el aspecto anterior)
- Toda la app del equipo con el estilo elegido: oscuro espresso o crema según el modo del aparato, letra Inter, pestañas en cápsula, carta en lista con «+» y cantidad, un solo color de acento. Arriba, el efectivo que debería haber en el cajón.
- Pruebas: `node tests/run.js` → 18 bien, 0 mal (5 nuevas del diseño). Contraste mínimo 5,6:1.
- Sin probar en el móvil: el tacto real de la lista de la carta en el S26 y cómo se ve el iPad con la luz de la cafetería.

