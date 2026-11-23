// Navegación: cinco botones arriba, un nivel de apartados debajo
const sinErrores = (assert, errors) => assert.deepEqual(errors, [], "errores de JavaScript en la página");
module.exports = {
  "arriba hay Mostrador, Cafetera, Dinero, Almacén y Ajustes": async (lib, assert) => {
    const {page, errors, close} = await lib.open();
    const g = await page.$$eval(".tabs [data-group]", b => b.map(x => x.dataset.group));
    assert.deepEqual(g, ["mostrador","cafetera","dinero","almacen","ajustes"]);
    sinErrores(assert, errors); await close();
  },
  "Dinero enseña Caja, Caja fuerte, Gastos y Datos": async (lib, assert) => {
    const {page, errors, close} = await lib.open();
    await page.click('.tabs [data-group="dinero"]'); await page.waitForTimeout(150);
    const subs = await page.$$eval("#subNav button:not([hidden])", b => b.map(x => x.textContent.trim()));
    assert.deepEqual(subs, ["Caja","Caja fuerte","Gastos","Datos"]);
    sinErrores(assert, errors); await close();
  },
  "el enlace antiguo #ajustes abre uno de los apartados que antes estaban en Ajustes": async (lib, assert) => {
    const {page, errors, close} = await lib.open({hash:"ajustes"});
    assert.match(await page.$eval("#sub", e => e.textContent), /^(Ajustes|Almacén) · /);
    sinErrores(assert, errors); await close();
  },
  "a 360 px de ancho nada se sale por la derecha en ninguna sección": async (lib, assert) => {
    const {page, errors, close} = await lib.open({width:360});
    for (const p of ["pedidos","tienda","barra","caja","fuerte","gastos","datos","carta","escandallos","inventario","compra","qr","equipo"]){
      await page.evaluate(h => { location.hash = h; }, p); await page.waitForTimeout(150);
      const over = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      assert.ok(over <= 0, `#${p} se sale ${over} px`);
    }
    sinErrores(assert, errors); await close();
  },
};
