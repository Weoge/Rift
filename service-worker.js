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
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});

self.addEventListener('push', event => {
    const data = event.data.json();
    const options = {
        body: data.body,
        icon: data.icon || '/static/images/icon-192x192.png',
        badge: '/static/images/icon-192x192.png',
        vibrate: [200, 100, 200],
        data: {
            chatId: data.chatId,
            type: data.type
        },
        requireInteraction: data.type === 'call'
    };
    
    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    event.waitUntil(
        clients.openWindow('/app')
    );
});
