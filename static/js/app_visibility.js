let isAppActive = true;

document.addEventListener('visibilitychange', () => {
    isAppActive = !document.hidden;
    
    if (typeof chatSocket !== 'undefined' && chatSocket && chatSocket.readyState === WebSocket.OPEN) {
        chatSocket.send(JSON.stringify({
            type: 'set_active',
            active: isAppActive
        }));
    }
});

window.addEventListener('focus', () => {
    isAppActive = true;
    if (typeof chatSocket !== 'undefined' && chatSocket && chatSocket.readyState === WebSocket.OPEN) {
        chatSocket.send(JSON.stringify({
            type: 'set_active',
            active: true
        }));
    }
});

window.addEventListener('blur', () => {
    isAppActive = false;
    if (typeof chatSocket !== 'undefined' && chatSocket && chatSocket.readyState === WebSocket.OPEN) {
        chatSocket.send(JSON.stringify({
            type: 'set_active',
            active: false
        }));
    }
});
