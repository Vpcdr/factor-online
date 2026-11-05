/* Service Worker - فاکتور آنلاین ver1.9.0 (اول شبکه، سپس حافظه؛ برای دریافت آپدیت‌ها و کار آفلاین) */
const C='factor-v1.9.0';
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'])).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 e.respondWith(fetch(e.request).then(r=>{if(r.ok){const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp))}return r}).catch(()=>caches.match(e.request).then(m=>m||caches.match('./index.html'))));
});

/* دکمه‌های اعلان یادآور: «نمایش» برنامه را باز و یادآور را نشان می‌دهد، «انصراف» یادآور را انجام‌شده می‌کند */
self.addEventListener('notificationclick',e=>{
 e.notification.close();
 const id=e.notification.data&&e.notification.data.id;
 e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(cs=>{
  if(e.action==='cancel'){cs.forEach(c=>c.postMessage({t:'rem-cancel',id}));return}
  if(cs.length){cs[0].focus();cs[0].postMessage({t:'rem-view',id});return}
  return self.clients.openWindow('./index.html?go=reminders&rid='+encodeURIComponent(id||''));
 }));
});
