const CACHE="gold-radar-github-v1";
const SHELL=["/","/index.html","/manifest.webmanifest","/icon.svg"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match("/")))});
self.addEventListener("push",e=>{let p={title:"黄金策略提醒",body:"发现新的候选交易机会，请打开黄金雷达查看。",url:"/"};if(e.data){try{p={...p,...e.data.json()}}catch{p.body=e.data.text()}}e.waitUntil(self.registration.showNotification(p.title,{body:p.body,icon:"/icon.svg",tag:"gold-signal",data:{url:p.url}}))});
self.addEventListener("notificationclick",e=>{e.notification.close();e.waitUntil(self.clients.matchAll({type:"window",includeUncontrolled:true}).then(cs=>{for(const c of cs){if("focus"in c){c.navigate(e.notification.data?.url||"/");return c.focus()}}return self.clients.openWindow(e.notification.data?.url||"/")}))});
