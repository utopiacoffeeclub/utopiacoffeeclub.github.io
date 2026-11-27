// Dinero → Caja: resumen del día arriba (vendido hoy, por cobrar y caja fuerte)
const num = s => Number(String(s).replace(/[^\d,-]/g, "").replace(",", "."));
function datos(lib, {fuerte = true} = {}){
  const rows = lib.seedBase();
  // 10 pedidos de hoy; el 2 y el 5 están sin cobrar. Uno de ayer no cuenta. Uno anulado tampoco.
  const hoy = lib.orders(rows, 10, {pend: i => i === 2 || i === 5});
  rows.push(...hoy);
  rows.push({col:"orders", id:"ayer", data:{...hoy[0].data, num:99, createdAt:Date.now() - 36*3600e3, day:"2000-01-01", total:50}});
  rows.push({col:"orders", id:"anul", data:{...hoy[1].data, num:98, status:"anulado", total:40}});
  if (fuerte){ const cfg = rows.find(r => r.col === "config"); cfg.data.cajaFuerte = {saldo:300, desde:Date.now() - 1000}; }
  const vendido = Math.round(hoy.reduce((s,o) => s + o.data.total*100, 0))/100;
  const porCobrar = Math.round(hoy.filter(o => o.data.pay === "pendiente").reduce((s,o) => s + o.data.total*100, 0))/100;
  return {rows, vendido, porCobrar};
}
async function abrirCaja(page){ await page.click('.tabs [data-group="dinero"]'); await page.click('#subNav [data-page="caja"]'); await page.waitForTimeout(200); }
module.exports = {
  "al entrar en Caja se ve lo vendido hoy, lo que falta por cobrar y la caja fuerte": async (lib, assert) => {
    const d = datos(lib);
    const {page, errors, close} = await lib.open({rows:d.rows});
    await abrirCaja(page);
    assert.equal(await page.$eval("#cajaHoy", e => !e.hidden && e.offsetHeight > 0), true);
    assert.equal(num(await page.$eval("#hoyVend b", e => e.textContent)), d.vendido);
    assert.equal(num(await page.$eval("#hoyPend b", e => e.textContent)), d.porCobrar);
    assert.equal(num(await page.$eval("#hoySafe b", e => e.textContent)), 300);
    assert.deepEqual(errors, []); await close();
  },
  "sin caja fuerte empezada lo dice en vez de poner 0": async (lib, assert) => {
    const {page, errors, close} = await lib.open({rows:datos(lib, {fuerte:false}).rows});
    await abrirCaja(page);
    assert.match(await page.$eval("#hoySafe", e => e.textContent), /sin contar/i);
    assert.deepEqual(errors, []); await close();
  },
  "en la pestaña Caja fuerte no sale el resumen": async (lib, assert) => {
    const {page, errors, close} = await lib.open({rows:datos(lib).rows});
    await page.click('.tabs [data-group="dinero"]'); await page.click('#subNav [data-page="fuerte"]'); await page.waitForTimeout(200);
    assert.equal(await page.$eval("#cajaHoy", e => e.offsetHeight), 0);
    assert.deepEqual(errors, []); await close();
  },
  "al apuntar una deuda con Caja abierta, el resumen la suma al momento": async (lib, assert) => {
    const {page, errors, close} = await lib.open({rows:datos(lib).rows});
    await abrirCaja(page);
    await page.fill("#fondo", "150"); await page.click("#openBtn"); await page.waitForTimeout(300);
    await page.$eval("#f-deudas", d => d.open = true);
    await page.fill("#dName", "Pepe"); await page.fill("#dAmt", "4,50"); await page.uncheck("#dCash");
    await page.click('#debtForm button[type="submit"]'); await page.waitForTimeout(300);
    assert.match(await page.$eval("#hoyPend", e => e.textContent), /4,50\s*€ que nos deben/);
    assert.deepEqual(errors, []); await close();
  },
  "lo vendido hoy deja claro que incluye lo que aún no se ha cobrado": async (lib, assert) => {
    const {page, errors, close} = await lib.open({rows:datos(lib).rows});
    await abrirCaja(page);
    assert.match(await page.$eval("#hoyVend span", e => e.textContent), /cobrado o no/);
    assert.deepEqual(errors, []); await close();
  },
};
