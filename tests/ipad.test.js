// iPad de la cafetera (uso «barra»): Laura solo ve Cafetera y Tienda (y el engranaje para cambiar el uso)
const sinErrores = (assert, errors) => assert.deepEqual(errors, [], "errores de JavaScript en la página");
const visibles = page => page.$$eval(".tabs button", b => b.filter(x => x.offsetParent !== null).map(x => [...x.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join("").trim() || x.getAttribute("aria-label")));
module.exports = {
  "en el iPad de la cafetera arriba solo salen Cafetera, Tienda y Ajustes": async (lib, assert) => {
    const {page, errors, close} = await lib.open({role:"barra", width:820});
    assert.deepEqual(await visibles(page), ["Cafetera","Tienda","Ajustes"]);
    sinErrores(assert, errors); await close();
  },
  "en el iPad, Tienda abre los pedidos de tienda sin la barra de Cobrar y Entregar": async (lib, assert) => {
    const {page, errors, close} = await lib.open({role:"barra", width:820});
    await page.click('.tabs [data-group="tiendaB"]'); await page.waitForTimeout(150);
    assert.equal(await page.$eval("#v-tienda", e => e.hidden), false);
    assert.equal(await page.$eval("#modeBar", e => e.hidden || getComputedStyle(e).display === "none"), true);
    assert.equal(await page.$eval('.tabs [data-group="tiendaB"]', e => e.getAttribute("aria-pressed")), "true");
    sinErrores(assert, errors); await close();
  },
  "en el iPad, un enlace a Mostrador o Dinero lleva a la Cafetera": async (lib, assert) => {
    const {page, errors, close} = await lib.open({role:"barra", width:820, hash:"caja"});
    assert.equal(await page.$eval("#sub", e => e.textContent), "Cafetera · cafés y matcha");
    sinErrores(assert, errors); await close();
  },
  "en el móvil del mostrador siguen las cinco pestañas": async (lib, assert) => {
    const {page, errors, close} = await lib.open({role:"caja"});
    assert.deepEqual(await visibles(page), ["Mostrador","Cafetera","Dinero","Almacén","Ajustes"]);
    sinErrores(assert, errors); await close();
  },
};
