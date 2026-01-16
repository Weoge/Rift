let VAPID_PUBLIC_KEY = null;
let keyLoaded = false;

fetch('/app/get_vapid_public_key/')
    .then(response => response.json())
    .then(data => {
        VAPID_PUBLIC_KEY = data.vapid_public_key;
        keyLoaded = true;
        console.log('VAPID key loaded');
    })
    .catch(error => console.error('Error fetching VAPID public key:', error));

async function requestNotificationPermission() {
    if (!('Notification' in window)) {
        console.log('Notifications not supported');
        return false;
    }
    
    if (Notification.permission === 'granted') {
        return true;
    }
    
    if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }
    
    return false;
}

async function subscribeToPush() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.log('Push не поддерживается');
        return;
    }
    
    let attempts = 0;
    while (!keyLoaded && attempts < 50) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
    }
    
    if (!VAPID_PUBLIC_KEY) {
        console.error('VAPID_PUBLIC_KEY not loaded');
        return;
    }
    
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) {
        console.log('Permission denied');
        return;
    }

    try {
        const registration = await navigator.serviceWorker.ready;
        
        let subscription = await registration.pushManager.getSubscription();
        if (subscription) {
            console.log('Already subscribed');
            return;
        }
        
        subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
        });
        
        console.log('Push subscription:', subscription);

        const response = await fetch('/app/push/subscribe/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify(subscription)
        });
        
        if (response.ok) {
            console.log('Subscription saved');
        } else {
            console.error('Failed to save subscription:', await response.text());
        }
    } catch (error) {
        console.error('Ошибка подписки на push:', error);
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

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js').then(reg => {
        console.log('SW registered:', reg);
        if (document.readyState === 'complete') {
            setTimeout(() => subscribeToPush(), 1000);
            console.log('Document ready, subscribing to push');
        } else {
            window.addEventListener('load', () => {
                setTimeout(() => subscribeToPush(), 1000);
                console.log('Document ready, subscribing to push');
            });
        }
    }).catch(err => console.error('SW registration failed:', err));
}
