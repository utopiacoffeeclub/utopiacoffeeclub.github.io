# Rutina de revisión y mejora de la app de Utopía

## Para qué
Mario quiere que la app de comandas mejore un poco cada día, como Sereno, sin poner en riesgo el servicio del fin de semana (abren sábado y domingo).

## Decidido por Mario
- Se trabaja de **lunes a jueves**, una mejora pequeña por día.
- Nada se publica solo: **el viernes se revisa** lo de la semana y se sube si Mario da el visto bueno.

## Cómo (propuesta de Claude)
- **Dos ramas:** `main` es lo que está en marcha en el S26 y el iPad; `mejoras` acumula el trabajo de la semana. Solo el viernes, con un «sube» de Mario, `mejoras` pasa a `main`.
- **Pruebas en el proyecto (`tests/`):** base de datos falsa y móvil simulado con Playwright. Cubren navegación, cobro, «Sin cobrar», cierre y «qué sacar», y rendimiento con 40 pedidos. Cada fallo que aparezca se convierte primero en una prueba (método superpowers: systematic-debugging + TDD + verificación antes de decir que está hecho).
- **`CLAUDE.md` en el repo** con las reglas: castellano; subir versión en `sw.js` y en Ajustes; nunca tocar `main` sin el «sube»; no cambiar la base de datos de Supabase ni sus datos reales; ideas ya descartadas.
- **`docs/mejoras/pendientes.md`:** lista de fallos e ideas (lo que Mario cuente entra aquí). La rutina diaria coge la primera; si está vacía, busca una mejora pequeña revisando la app.
- **`docs/mejoras/semana.md`:** diario de lo hecho cada día, que es lo que se revisa el viernes.
- **Tarea diaria** (L–J, 17:13): mejora + pruebas + commit en `mejoras` + mensaje corto a Mario.
- **Tarea del viernes** (17:13): resumen de la semana con capturas, y pregunta «¿subo?». Si dice sí, en esa misma conversación se fusiona y se publica.

## Alternativas descartadas
- Publicar solo de L a J: Mario prefiere revisar antes.
- Una versión de prueba aparte en internet: usaría los datos reales de la caja; se sustituye por capturas.

## Fuera de alcance / prohibido para la rutina
Cambios en Supabase (tablas, funciones, datos), en el aviso de correo de la tienda o en importes cobrados sin decirlo claramente en el resumen.
