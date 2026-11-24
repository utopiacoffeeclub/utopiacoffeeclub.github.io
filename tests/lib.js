// Utilidades de las pruebas: sirve la app desde disco con un Supabase falso en memoria
const { chromium } = require("playwright");
const fs = require("fs"), path = require("path");
const ROOT = path.join(__dirname, "..");
const TYPES = {".js":"application/javascript", ".html":"text/html", ".png":"image/png", ".webp":"image/webp", ".woff2":"font/woff2", ".json":"application/json", ".webmanifest":"application/manifest+json", ".css":"text/css", ".svg":"image/svg+xml", ".gif":"image/gif"};
let browser = null;

function seedBase(){
  const rows = [];
  const sql = fs.readFileSync(path.join(ROOT, "supabase/seed.sql"), "utf8");
  for (const m of sql.matchAll(/\('([^']+)', '([^']+)', '((?:[^']|'')*)'::jsonb\)/g)) rows.push({col:m[1], id:m[2], data:JSON.parse(m[3].replace(/''/g, "'"))});
  const cfg = rows.find(r => r.col === "config"); cfg.data.setupDone = true; cfg.data.fondoHabitual = 150; cfg.data.bizum = "600111222";
  return rows;
}
// Pedidos de ejemplo: n pedidos con la carta del seed; opts.pend(i) decide cuáles quedan sin cobrar
function orders(rows, n, opts = {}){
  const menu = rows.filter(r => r.col === "menu"), now = Date.now(), day = new Date().toISOString().slice(0,10);
  const names = opts.names || ["Lucía","Pablo","Belén","Martha","Cristian","Ana","Sergio","Nuria"];
  const out = [];
  for (let i = 0; i < n; i++){
    const m = menu[i % menu.length], q = 1 + (i % 2);
    out.push({col:"orders", id:"o"+i, data:{num:i+1, customer:names[i % names.length], items:[{id:m.id, name:m.data.name, qty:q, price:m.data.price, station:m.data.station || "barra"}],
      total:m.data.price*q, status: i < 8 ? "nuevo" : i < 12 ? "listo" : "entregado", pay: opts.pend && opts.pend(i) ? "pendiente" : "efectivo",
      createdAt: now - (n - i)*60e3, day}});
  }
  return out;
}
async function open({role = "caja", width = 412, rows = null, hash = "", cpu = 1} = {}){
  browser = browser || await chromium.launch();
  const ctx = await browser.newContext({viewport:{width, height:880}});
  await ctx.route(/^https:\/\/app\.test\/(.*)$/, r => {
    const f = new URL(r.request().url()).pathname.slice(1) || "index.html";
    if (f === "sw.js") return r.abort();
    if (f === "vendor/supabase.js") return r.fulfill({contentType:"application/javascript", body:fs.readFileSync(path.join(__dirname, "mock-supa.js"))});
    const p = path.join(ROOT, f);
    if (!fs.existsSync(p)) return r.fulfill({status:404, body:""});
    r.fulfill({contentType: TYPES[path.extname(f)] || "application/octet-stream", body:fs.readFileSync(p)});
  });
  await ctx.route(/^https:\/\/(?!app\.test)/, r => r.abort());
  const page = await ctx.newPage(), errors = [];
  page.on("pageerror", e => errors.push(e.message));
  if (cpu > 1){ const cdp = await ctx.newCDPSession(page); await cdp.send("Emulation.setCPUThrottlingRate", {rate:cpu}); }
  const seed = rows || seedBase();
  await page.addInitScript(({seed, role}) => { localStorage.setItem("rol", role); const iv = setInterval(() => { if (window.__seed){ window.__seed(seed); clearInterval(iv); } }, 1); }, {seed, role});
  await page.goto("https://app.test/index.html" + (hash ? "#" + hash : ""));
  await page.waitForTimeout(1000);
  return {page, errors, close: () => ctx.close()};
}
const done = async () => { if (browser) await browser.close(); browser = null; };
module.exports = {seedBase, orders, open, done};
