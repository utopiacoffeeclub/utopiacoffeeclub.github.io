// Supabase simulado dentro del navegador, para las pruebas de tests/ (la app nunca lo carga)
(() => {
  const rows = new Map(); const chans = [];
  window.__rows = rows;
  const deep = (a,b) => { if (!a || typeof a!=="object" || Array.isArray(a) || !b || typeof b!=="object" || Array.isArray(b)) return b; const r={...a}; for (const k in b) r[k] = (r[k] && typeof r[k]==="object" && !Array.isArray(r[k]) && b[k] && typeof b[k]==="object" && !Array.isArray(b[k])) ? deep(r[k], b[k]) : b[k]; return r; };
  const fire = (t, n, o) => setTimeout(() => chans.forEach(cb => cb({eventType:t, new:n||{}, old:o||{}})), 5);
  window.__seed = list => list.forEach(r => rows.set(r.col+"|"+r.id, r));
  function from(){ const st={f:{}}; const b={select(){st.op=st.op||"select";return b;},eq(k,v){st.f[k]=v;return b;},upsert(r){st.op="up";st.r=r;return b;},delete(){st.op="del";return b;},maybeSingle(){st.one=true;return b;},then(res,rej){return Promise.resolve(run()).then(res,rej);}};
    function run(){ if(st.op==="up"){const r=JSON.parse(JSON.stringify(st.r)); rows.set(r.col+"|"+r.id,r); fire("UPDATE",r); return {data:null,error:null};}
      if(st.op==="del"){const k=st.f.col+"|"+st.f.id,o=rows.get(k); rows.delete(k); fire("DELETE",null,o); return {data:null,error:null};}
      const l=[...rows.values()].filter(r=>Object.entries(st.f).every(([k,v])=>r[k]===v)).map(r=>({id:r.id,data:JSON.parse(JSON.stringify(r.data))})); return st.one?{data:l[0]||null,error:null}:{data:l,error:null}; }
    return b; }
  const session = {user:{email:"mario@x.es"}};
  window.supabase = {createClient(){ return {
    auth:{getSession:async()=>({data:{session}}), signOut:async()=>({}), signInWithPassword:async()=>({data:{session},error:null})},
    from, rpc: async (fn,a) => { if (fn==="es_equipo") return {data:true,error:null}; if (fn==="merge_doc"){ const r=rows.get(a.p_col+"|"+a.p_id); r.data=deep(r.data,a.p_patch); fire("UPDATE",r); return {data:JSON.parse(JSON.stringify(r.data)),error:null}; } return {data:null,error:null}; },
    channel(){ const c={on(_a,_b,cb){chans.push(cb);return c;}, subscribe(cb){setTimeout(()=>cb&&cb("SUBSCRIBED"),10);return c;}}; return c; }
  }; }};
})();
