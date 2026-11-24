// Ejecuta todas las pruebas: node tests/run.js [filtro]
const fs = require("fs"), path = require("path"), assert = require("assert/strict");
const lib = require("./lib");
(async () => {
  const filtro = process.argv[2] || "";
  const files = fs.readdirSync(__dirname).filter(f => f.endsWith(".test.js") && f.includes(filtro)).sort();
  let ok = 0, ko = 0;
  for (const f of files){
    const tests = require(path.join(__dirname, f));
    for (const [name, fn] of Object.entries(tests)){
      const t0 = Date.now();
      try { await fn(lib, assert); ok++; console.log(`✔ ${f} › ${name} (${Date.now()-t0} ms)`); }
      catch(e){ ko++; console.log(`✘ ${f} › ${name}\n    ${String(e.message).split("\n").slice(0,6).join("\n    ")}`); }
    }
  }
  await lib.done();
  console.log(`\n${ok} bien, ${ko} mal`);
  process.exit(ko ? 1 : 0);
})();
