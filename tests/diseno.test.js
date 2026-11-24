// Rediseño «Noche de barra»: paleta según el sistema, letra Inter, carta en lista y efectivo en la cabecera
const fondo = page => page.evaluate(() => getComputedStyle(document.body).backgroundColor);
function conCaja(lib, abierta){
  const rows = lib.seedBase(), m = rows.find(r => r.col === "menu"), day = new Date().toISOString().slice(0,10);
  if (abierta){
    rows.push({col:"turno", id:"actual", data:{open:true, openedAt:Date.now() - 3600e3, fondo:150, movs:[]}});
    rows.push({col:"orders", id:"e1", data:{num:1, customer:"Ana", items:[{id:m.id, name:m.data.name, qty:1, price:2.2, station:"barra"}], total:2.2, status:"entregado", pay:"efectivo", createdAt:Date.now() - 60e3, day}});
  } else rows.push({col:"turno", id:"actual", data:{open:false, closedAt:Date.now() - 60e3}});
  return rows;
}
module.exports = {
  "en modo oscuro el fondo es espresso y en claro crema": async (lib, assert) => {
    let o = await lib.open({scheme:"dark"}); assert.equal(await fondo(o.page), "rgb(21, 16, 14)"); assert.deepEqual(o.errors, []); await o.close();
    o = await lib.open({scheme:"light"}); assert.equal(await fondo(o.page), "rgb(246, 241, 234)"); assert.deepEqual(o.errors, []); await o.close();
  },
  "el texto usa Inter": async (lib, assert) => {
    const {page, close} = await lib.open();
    assert.match(await page.evaluate(() => getComputedStyle(document.body).fontFamily), /^"?Inter/);
    assert.ok(await page.evaluate(() => document.fonts.check('16px Inter')), "la fuente Inter no está cargada");
    await close();
  },
  "la carta se ve en lista, una columna": async (lib, assert) => {
    const {page, close} = await lib.open();
    const xs = await page.$$eval("#menuGrid .prod", ps => [...new Set(ps.slice(0, 6).map(p => Math.round(p.getBoundingClientRect().left)))]);
    assert.equal(xs.length, 1, `productos en ${xs.length} columnas`);
    const h = await page.$eval("#menuGrid .prod", p => p.getBoundingClientRect().height);
    assert.ok(h >= 48, `fila de ${h} px`);
    await close();
  },
  "con la caja abierta la cabecera dice el efectivo del cajón": async (lib, assert) => {
    const {page, errors, close} = await lib.open({rows:conCaja(lib, true)});
    assert.equal((await page.$eval("#cajaNow", e => e.textContent)).replace(/ /g, " "), "152,20 €");
    assert.deepEqual(errors, []); await close();
  },
  "con la caja cerrada la cabecera no da importe": async (lib, assert) => {
    const {page, close} = await lib.open({rows:conCaja(lib, false)});
    assert.equal(await page.$eval("#cajaNow", e => e.hidden), true);
    await close();
  },
};
