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

## 2026-11-24 · Resumen del día arriba de Dinero → Caja
- Al entrar en Caja, arriba del todo: lo vendido hoy (con nº de pedidos), lo que queda sin cobrar (y lo que os deben, si hay) y el saldo de la caja fuerte. Solo lee datos: no cambia cobros ni importes. En la pestaña Caja fuerte no sale.
- Pruebas: `node tests/run.js` → 16 bien, 0 mal (3 nuevas en `tests/hoy.test.js`).
- Sin probar en el móvil: cómo queda en el S26 de verdad y que se actualice al momento cuando entra un pedido con la pestaña abierta.

## 2026-11-25 · En el iPad de la cafetera solo salen Cafetera y Tienda
- En un aparato con uso «Cafetera» (el iPad de Laura), arriba solo están Cafetera, Tienda (con su aviso de pedidos nuevos) y el engranaje. Mostrador, Dinero y Almacén no salen, y si un enlace o el último recuerdo apuntaban ahí, se abre la Cafetera. El engranaje se queda para poder cambiar el uso del aparato (Ajustes → Equipo). El móvil, «Las dos» y el ordenador de casa no cambian. No toca cobros ni importes.
- Pruebas: `node tests/run.js` → 20 bien, 0 mal (4 nuevas en `tests/ipad.test.js`; en `nav.test.js` la lista de pestañas ya no cuenta el botón Tienda del iPad).
- Sin probar en el móvil: cómo se ve en el iPad de verdad y que Laura no eche nada de menos (si usa algo de Mostrador, se vuelve atrás en un momento).
