# Rediseño «Noche de barra» de la app del equipo

## Para qué
Mario quiere sentir que la app es premium y no genérica. Entre tres maquetas del Mostrador (Tostadero, Noche de barra, Etiqueta) eligió **Noche de barra** porque es «muy limpio».

## Decidido por Mario
- Estilo B «Noche de barra» para toda la app del equipo.
- **Cambia con el sistema**: oscuro si el aparato está en modo oscuro, una versión clara del mismo estilo si está en claro.

## Cómo (propuesta de Claude, aceptada con «y listo»)
- Solo cambia el aspecto: mismas pestañas, mismos botones y funciones; las pruebas siguen en verde.
- Paleta oscura: fondo #15100E, superficie #201816, líneas #33281F, texto #F4EBDF, secundario #B8A796, acento único #E9788B (texto oscuro encima). Clara: fondo #F6F1EA, superficie #FFFFFF, líneas #E4DAD0, texto #1E1512, secundario #6E5C55, acento #8C1F33 (texto blanco). Estados (listo, error, aviso) con su versión para cada modo.
- Letra: Inter para todo (guardada en `fonts/`, sin servicios externos) y Bebas Neue solo para la marca y los importes grandes.
- Pestañas en cápsula, apartados y modos con subrayado, títulos de sección pequeños (nada de mayúsculas gigantes), carta en **lista** (nombre, precio, cantidad o «+»), botón de cobrar grande con el total.
- Arriba a la derecha, con la caja abierta: el efectivo que debería haber en el cajón.
- Botones de 48 px o más; números alineados.

## Alternativas descartadas
- Tostadero (A) y Etiqueta (C): Mario prefirió B.
- Oscuro siempre: Mario prefiere que siga al sistema.

## Fuera de alcance
La página de clientes (`pedir.html`) y la carta en PDF no cambian en este paso.

## Entrega
Rama `rediseno`; se mezcla en `mejoras` y se enseña en la revisión del viernes; solo se publica con «sube».
