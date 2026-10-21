// Service worker del Hub (21-oct) · SOLO notificaciones (no cachea nada: el Hub siempre se sirve fresco).
// Recibe la revisión diaria de Meta Ads aunque el Hub esté cerrado (basta con que el navegador esté abierto).
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('push', (e) => {
  let d = {}; try { d = e.data ? e.data.json() : {}; } catch (_e) { d = { title: 'OdA Hub', body: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.title || 'OdA Hub', { body: d.body || '', tag: d.tag || 'oda-hub', icon: 'logo-wordmark-white.png', data: { url: d.url || './' }, requireInteraction: true }));
});
self.addEventListener('notificationclick', (e) => {
  e.notification.close(); const url = (e.notification.data && e.notification.data.url) || './';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((cs) => {
    for (const c of cs) { if ('focus' in c) { c.postMessage({ tipo: 'abrir', url }); return c.focus(); } }
    return self.clients.openWindow(url);
  }));
});
