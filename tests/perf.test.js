// Rendimiento: con 40 pedidos, entregar uno no vuelve a dibujar la carta
module.exports = {
  "entregar un pedido no repinta la carta": async (lib, assert) => {
    const rows = lib.seedBase(); rows.push(...lib.orders(rows, 40));
    rows.push({col:"turno", id:"actual", data:{open:true, openedAt:Date.now() - 3600e3, fondo:150, movs:[]}});
    const {page, errors, close} = await lib.open({rows, cpu:4});
    await page.click('#modeBar [data-mode="entregar"]'); await page.waitForTimeout(300);
    await page.evaluate(() => { window.__grid = 0; new MutationObserver(() => window.__grid++).observe(document.querySelector("#menuGrid"), {childList:true}); });
    const listos = await page.$$("[data-deliver]"); assert.ok(listos.length > 0, "no hay pedidos listos para entregar");
    await listos[0].click(); await page.waitForTimeout(800);
    assert.equal(await page.evaluate(() => window.__grid), 0);
    assert.deepEqual(errors, []); await close();
  },
};
