// Textos que se lean bien a 360 px, en claro y en oscuro: contraste mínimo 4,5:1 (3:1 en letra grande)
const sinErrores = (assert, errors) => assert.deepEqual(errors, [], "errores de JavaScript en la página");
async function flojos(lib, {hash, dark}){
  const rows = lib.seedBase(); rows.push(...lib.orders(rows, 14, {pend: i => i % 3 === 0}));
  const {page, errors, close} = await lib.open({width:360, rows, hash});
  if (dark) await page.emulateMedia({colorScheme:"dark"});
  await page.evaluate(() => {
    document.querySelectorAll("details").forEach(d => d.open = true);
    // Avisos con número (tienda, web, almacén…): se enseñan aunque no haya pedidos para mirar su color
    ["shopBadge","shopBadge2","shopBadge3","webBadge","modeBadge","lowBadge"].forEach(id => { const b = document.getElementById(id); if (b){ b.textContent = "3"; b.hidden = false; } });
  });
  await page.waitForTimeout(200);
  const malos = await page.evaluate(() => {
    const rgb = c => (c.match(/[\d.]+/g) || []).map(Number);
    const lum = ([r,g,b]) => { const f = v => (v /= 255) <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4); return 0.2126*f(r) + 0.7152*f(g) + 0.0722*f(b); };
    const fondo = e => { for (; e; e = e.parentElement){ const cs = getComputedStyle(e); if (cs.backgroundImage !== "none") return null; const c = rgb(cs.backgroundColor); if (c.length === 3 || c[3] > 0.5) return c; } return [255,255,255]; };
    const out = [];
    for (const e of document.querySelectorAll("body *")){
      if (!e.offsetParent || e.disabled) continue;
      const txt = [...e.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join("").trim();
      if (!txt) continue;
      const cs = getComputedStyle(e), bg = fondo(e); if (!bg) continue;
      const fg = rgb(cs.color), a = fg[3] ?? 1, mix = fg.slice(0,3).map((v,i) => v*a + bg[i]*(1-a));
      const L1 = lum(mix), L2 = lum(bg), cr = (Math.max(L1,L2)+0.05) / (Math.min(L1,L2)+0.05);
      const fs = parseFloat(cs.fontSize), grande = fs >= 24 || (fs >= 18.6 && +cs.fontWeight >= 700);
      if (cr < (grande ? 3 : 4.5)) out.push(`${txt.slice(0,25)} (${cr.toFixed(2)}:1)`);
    }
    return [...new Set(out)];
  });
  await close();
  return {malos, errors};
}
const casos = {};
for (const hash of ["pedidos","tienda","barra","caja"]) for (const dark of [false, true])
  casos[`${hash} en modo ${dark ? "oscuro" : "claro"} se lee bien a 360 px`] = async (lib, assert) => {
    const {malos, errors} = await flojos(lib, {hash, dark});
    assert.deepEqual(malos, [], "textos con poco contraste");
    sinErrores(assert, errors);
  };
module.exports = casos;
