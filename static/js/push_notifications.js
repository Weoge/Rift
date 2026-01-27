let VAPID_PUBLIC_KEY = null;
let vapidKeyLoaded = false;

function loadVapidKey() {
    return fetch('/app/get_vapid_public_key/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        VAPID_PUBLIC_KEY = data.vapid_public_key;
        vapidKeyLoaded = true;
        console.log('VAPID key loaded successfully');
    })
    .catch(err => {
        console.error('Failed to get VAPID key:', err);
        vapidKeyLoaded = false;
    });
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

async function requestNotificationPermission() {
    if (!('Notification' in window)) {
        console.log('Notifications not supported');
        return;
    }
    
    if (!vapidKeyLoaded || !VAPID_PUBLIC_KEY) {
        console.log('Waiting for VAPID key...');
        return;
    }
    
    if (Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            subscribeToPush();
        }
    } else if (Notification.permission === 'granted') {
        subscribeToPush();
    }
}

async function subscribeToPush() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.log('Push not supported');
        return;
    }

    if (!vapidKeyLoaded || !VAPID_PUBLIC_KEY) {
        console.log('VAPID key not loaded yet');
        return;
    }

    try {
        const registration = await navigator.serviceWorker.ready;
        let subscription = await registration.pushManager.getSubscription();

        if (!subscription) {
            subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
            });
        }

        const response = await fetch('/app/push/subscribe/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({ subscription: subscription.toJSON() })
        });

        if (response.ok) {
            console.log('Push subscription successful');
        } else {
            console.error('Push subscription failed:', await response.text());
        }
    } catch (error) {
        console.error('Push subscription error:', error);
    }
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(reg => {
            console.log('Service Worker registered');
            return navigator.serviceWorker.ready;
        })
        .then(() => loadVapidKey())
        .then(() => {
            setTimeout(() => {
                requestNotificationPermission();
            }, 5000);
        })
        .catch(err => console.error('Service Worker registration failed:', err));
}

setInterval(async () => {
    if ('serviceWorker' in navigator && 'PushManager' in window && vapidKeyLoaded) {
        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();
            if (subscription) {
                await fetch('/app/push/subscribe/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken')
                    },
                    body: JSON.stringify({ subscription: subscription.toJSON() })
                });
            }
        } catch (e) {
            console.error('Resubscription failed:', e);
        }
    }
}, 24 * 60 * 60 * 1000);
