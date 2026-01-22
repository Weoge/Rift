const CACHE_NAME = 'Rift';
const urlsToCache = [
    '/',
    '/static/css/main.css',
    '/static/images/icon-192x192.png',
    '/static/images/icon-512x512.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    
    if (url.pathname.startsWith('/auth/') || url.pathname === '/app' || url.pathname.startsWith('/app/')) {
        event.respondWith(fetch(event.request));
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});

self.addEventListener('message', event => {
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => caches.delete(cacheName))
                );
            })
        );
    }
});

self.addEventListener('push', event => {
    let data = {};
    
    try {
        data = event.data ? event.data.json() : {};
    } catch (e) {
        console.error('Failed to parse push data:', e);
        data = {
            title: 'Rift Messenger',
            body: 'Новое сообщение'
        };
    }
    
    const title = data.title || 'Rift Messenger';
    const options = {
        body: data.body || 'Новое сообщение',
        icon: data.icon || '/static/images/icon-192x192.png',
        badge: '/static/images/icon-192x192.png',
        vibrate: data.vibrate || [200, 100, 200],
        data: data.data || {},
        tag: data.tag || 'default',
        requireInteraction: data.requireInteraction || false,
        actions: data.data && data.data.type === 'call' ? [
            { action: 'answer', title: 'Ответить' },
            { action: 'decline', title: 'Отклонить' }
        ] : [],
        silent: false,
        renotify: true
    };
    
    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    const action = event.action;
    const notificationData = event.notification.data;
    
    if (action === 'decline') {
        return;
    }
    
    const urlToOpen = notificationData.url || '/app';
    
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUntracked: true })
            .then(clientList => {
                for (let client of clientList) {
                    if (client.url === urlToOpen && 'focus' in client) {
                        return client.focus();
                    }
                }
                if (clients.openWindow) {
                    return clients.openWindow(urlToOpen);
                }
            })
    );
});

self.addEventListener('notificationclose', event => {
    console.log('Notification closed:', event.notification.tag);
});
