// «Qué sacar»: billetes y monedas para dejar el cajón en 150 €
const CIERRE_22N = {"1":45,"2":7,"5":10,"10":10,"50":1,"0.1":45,"0.2":39,"0.5":22,"0.01":1,"0.02":2,"0.05":3}; // 282,50 €
function datos(lib, desglose){
  const rows = lib.seedBase(), now = Date.now();
  rows.find(r => r.col === "config").data.cajaFuerte = {saldo:218, desde:now - 9e8};
  rows.push({col:"turno", id:"actual", data:{open:false, closedAt:now - 60e3}});
  rows.push({col:"cierres", id:"c1", data:{openedAt:now - 5e6, closedAt:now - 60e3, fondo:150, contado:282.5, esperado:282.5, diferencia:0, ventas:132.5, ...(desglose ? {desglose} : {})}});
  return rows;
}
module.exports = {
  "con el cierre del 22 de noviembre dice sacar 132,50 € empezando por 30 monedas de 1 €": async (lib, assert) => {
    const {page, errors, close} = await lib.open({rows:datos(lib, CIERRE_22N), hash:"caja"});
    const t = (await page.$eval("#fondoHint .sacar", e => e.innerText)).replace(/\u00a0/g, " ");  // los importes llevan espacio duro antes del €
    assert.match(t, /30 × monedas de 1 €/);
    assert.match(t, /Total a la caja fuerte\s+132,50 €/);
    assert.doesNotMatch(t, /No sale justo/);
    assert.deepEqual(errors, []); await close();
  },
  "si al cerrar no se contó por monedas, no inventa qué sacar": async (lib, assert) => {
    const {page, errors, close} = await lib.open({rows:datos(lib, null), hash:"caja"});
    assert.equal(await page.$("#fondoHint .sacar"), null);
    assert.match(await page.$eval("#fondoHint", e => e.innerText), /cuenta por monedas/);
    assert.deepEqual(errors, []); await close();
  },
  "al cerrar, mientras se cuenta, dice qué sacar para dejar 150 €": async (lib, assert) => {
    const rows = lib.seedBase();
    rows.push({col:"turno", id:"actual", data:{open:true, openedAt:Date.now() - 3600e3, fondo:150, movs:[]}});
    const {page, errors, close} = await lib.open({rows, hash:"caja"});
    await page.click("#f-close summary");
    await page.fill("#d-0", "1"); await page.fill("#d-5", "110");   // 1 billete de 50 € y 110 monedas de 1 € = 160 €
    const t = (await page.$eval("#sacarLive", e => e.innerText)).replace(/\u00a0/g, " ");
    assert.match(t, /10 × monedas de 1 €/);
    assert.match(t, /Total a la caja fuerte\s+10,00 €/);
    assert.deepEqual(errors, []); await close();
  },
};
