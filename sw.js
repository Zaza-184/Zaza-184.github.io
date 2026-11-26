/* ZAZA service worker: الصور والأصول بتتخزن (فتح أسرع في الزيارات التالية)، والصفحات والبيانات بتيجي من الشبكة الأول عشان التحديثات تظهر.
   غيّر رقم النسخة V لو بدّلت صورة بنفس الاسم. */
const V='zaza-v1',SHELL=['./','index.html','assets/assistant.js','assets/logo.webp','data/kb.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=V).map(x=>caches.delete(x)))).then(()=>clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);
if(r.method!='GET'||u.origin!=location.origin||/admin\.html|live\.json/.test(u.pathname))return;
if(/\.(webp|png|jpg|jpeg|svg|woff2?)$/.test(u.pathname)){e.respondWith(caches.open(V).then(async c=>{const m=await c.match(r);if(m)return m;const n=await fetch(r);if(n.ok)c.put(r,n.clone());return n}));return}
e.respondWith(fetch(r).then(n=>{if(n.ok){const cp=n.clone();caches.open(V).then(c=>c.put(r,cp))}return n}).catch(()=>caches.match(r)))});
