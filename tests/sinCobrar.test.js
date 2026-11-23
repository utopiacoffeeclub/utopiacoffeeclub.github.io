// «Sin cobrar»: plegado, una fila por persona y cobro de varios pedidos de una vez
function datos(lib){
  const rows = lib.seedBase();
  // Lucía tiene 3 pedidos sin cobrar (o0, o8, o16) y Ana 1 (o5); el turno se abrió hace 30 min, así que o0 (hace 40 min) es de antes
  rows.push(...lib.orders(rows, 40, {pend: i => i % 8 === 0 && i < 24 || i === 5}));
  rows.push({col:"turno", id:"actual", data:{open:true, openedAt:Date.now() - 30*60e3, fondo:150, movs:[]}});
  return rows;
}
module.exports = {
  "viene plegado y resume personas y total": async (lib, assert) => {
    const {page, errors, close} = await lib.open({rows:datos(lib)});
    assert.equal(await page.$eval("#f-unpaid", d => d.open), false);
    assert.equal(await page.$eval("#unpaidCount", e => e.textContent), "2 personas");
    assert.deepEqual(errors, []); await close();
  },
  "los pedidos de una misma persona salen juntos con un solo botón": async (lib, assert) => {
    const {page, errors, close} = await lib.open({rows:datos(lib)});
    await page.click("#f-unpaid summary"); await page.click('[data-who="lucia"] .pname');
    assert.equal(await page.$$eval('[data-who="lucia"] [data-upsel]', l => l.length), 3);
    assert.match(await page.$eval("[data-upcharge]", b => b.textContent), /· 3 pedidos/);
    assert.deepEqual(errors, []); await close();
  },
  "la calculadora da las vueltas sin perder el foco": async (lib, assert) => {
    const {page, errors, close} = await lib.open({rows:datos(lib)});
    await page.click("#f-unpaid summary"); await page.click('[data-who="lucia"] .pname');
    const total = await page.$eval("[data-upcharge]", b => Number(b.textContent.match(/([\d]+,\d\d)/)[1].replace(",", ".")));
    await page.fill("#upRecv", "50");
    assert.equal((await page.$eval("#upChange b", b => b.textContent)).replace(/\u00a0/g, " "), (50 - total).toFixed(2).replace(".", ",") + " €");
    assert.equal(await page.evaluate(() => document.activeElement.id), "upRecv");
    assert.deepEqual(errors, []); await close();
  },
  "cobrar en efectivo marca los 3 pedidos y apunta una sola entrada por lo de antes de abrir": async (lib, assert) => {
    const {page, errors, close} = await lib.open({rows:datos(lib)});
    await page.click("#f-unpaid summary"); await page.click('[data-who="lucia"] .pname');
    await page.click("[data-upcharge]"); await page.waitForTimeout(500);
    const r = await page.evaluate(() => ({
      pend: ["o0","o8","o16"].map(id => window.__rows.get("orders|" + id).data.pay),
      movs: window.__rows.get("turno|actual").data.movs,
      antes: ["o0","o8","o16"].map(id => window.__rows.get("orders|" + id).data).filter(o => o.createdAt < window.__rows.get("turno|actual").data.openedAt).reduce((s,o) => s + o.total, 0) }));
    assert.deepEqual(r.pend, ["efectivo","efectivo","efectivo"]);
    assert.equal(r.movs.length, 1);
    assert.equal(r.movs[0].tipo, "entrada");
    assert.ok(r.antes > 0, "la prueba necesita algún pedido de antes de abrir");
    assert.equal(Math.round(r.movs[0].importe*100), Math.round(r.antes*100));
    assert.equal(await page.$('[data-who="lucia"]'), null);
    assert.deepEqual(errors, []); await close();
  },
};
