let notificationQueue = [];
let notificationIdCounter = 0;
let callSounds = new Map();

function stopCallSound(notificationId) {
    const sound = callSounds.get(notificationId);
    if (sound) {
        sound.pause();
        sound.currentTime = 0;
        callSounds.delete(notificationId);
    }
}

function removeNotification(notificationId) {
    const notification = notificationQueue.find(n => n.id === notificationId);
    if (notification) {
        notification.element.remove();
        notificationQueue = notificationQueue.filter(n => n.id !== notificationId);
        let topOffset = 10;
        notificationQueue.forEach(n => {
            n.element.style.top = `${topOffset}px`;
            topOffset += n.type === 'call' ? 146 : 90;
        });
    }
}

function sendNotification(header, text, img, time, type, chatId=null) {
    if (Notification.permission === 'granted') {
        new Notification(header, {body: text, icon: img, vibrate: [200, 100, 200]});
    }
    
    if ('vibrate' in navigator) {
        navigator.vibrate(type === 'call' ? [500, 200, 500, 200, 500] : [200]);
    }
    
    const template = document.querySelector('.notification');
    const clone = template.cloneNode(true);
    const id = notificationIdCounter++;
    const notification_header = clone.querySelector('.notification_header');
    const notification_text = clone.querySelector('.notification_text');
    const notification_img = clone.querySelector('.notification_img');
    let notificationExtra = clone.querySelector('.notification_extra');
    let sound = null;

    const callButtonsHtml = `
        <div class="flex">
            <button class="small" style="margin: 5px 3px;" onclick="answerCall(${chatId}); stopCallSound(${id}); removeNotification(${id});">
                <svg class="icon" width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.38028 8.85335C9.07627 10.303 10.0251 11.6616 11.2266 12.8632C12.4282 14.0648 13.7869 15.0136 15.2365 15.7096C15.3612 15.7694 15.4235 15.7994 15.5024 15.8224C15.7828 15.9041 16.127 15.8454 16.3644 15.6754C16.4313 15.6275 16.4884 15.5704 16.6027 15.4561C16.9523 15.1064 17.1271 14.9316 17.3029 14.8174C17.9658 14.3864 18.8204 14.3864 19.4833 14.8174C19.6591 14.9316 19.8339 15.1064 20.1835 15.4561L20.3783 15.6509C20.9098 16.1824 21.1755 16.4481 21.3198 16.7335C21.6069 17.301 21.6069 17.9713 21.3198 18.5389C21.1755 18.8242 20.9098 19.09 20.3783 19.6214L20.2207 19.779C19.6911 20.3087 19.4263 20.5735 19.0662 20.7757C18.6667 21.0001 18.0462 21.1615 17.588 21.1601C17.1751 21.1589 16.8928 21.0788 16.3284 20.9186C13.295 20.0576 10.4326 18.4332 8.04466 16.0452C5.65668 13.6572 4.03221 10.7948 3.17124 7.76144C3.01103 7.19699 2.93092 6.91477 2.9297 6.50182C2.92833 6.0436 3.08969 5.42311 3.31411 5.0236C3.51636 4.66357 3.78117 4.39876 4.3108 3.86913L4.46843 3.7115C4.99987 3.18006 5.2656 2.91433 5.55098 2.76999C6.11854 2.48292 6.7888 2.48292 7.35636 2.76999C7.64174 2.91433 7.90747 3.18006 8.43891 3.7115L8.63378 3.90637C8.98338 4.25597 9.15819 4.43078 9.27247 4.60655C9.70347 5.26945 9.70347 6.12403 9.27247 6.78692C9.15819 6.96269 8.98338 7.1375 8.63378 7.4871C8.51947 7.60142 8.46231 7.65857 8.41447 7.72538C8.24446 7.96281 8.18576 8.30707 8.26748 8.58743C8.29048 8.66632 8.32041 8.72866 8.38028 8.85335Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <button class="small" style="margin: 5px 3px;" onclick="deniceCall(); stopCallSound(${id}); removeNotification(${id});">
                <svg class="icon" width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.9996 3L14.9996 9M14.9996 3L20.9996 9M10.2266 13.8631C9.02506 12.6615 8.07627 11.3028 7.38028 9.85323C7.32041 9.72854 7.29048 9.66619 7.26748 9.5873C7.18576 9.30695 7.24446 8.96269 7.41447 8.72526C7.46231 8.65845 7.51947 8.60129 7.63378 8.48698C7.98338 8.13737 8.15819 7.96257 8.27247 7.78679C8.70347 7.1239 8.70347 6.26932 8.27247 5.60643C8.15819 5.43065 7.98338 5.25585 7.63378 4.90624L7.43891 4.71137C6.90747 4.17993 6.64174 3.91421 6.35636 3.76987C5.7888 3.4828 5.11854 3.4828 4.55098 3.76987C4.2656 3.91421 3.99987 4.17993 3.46843 4.71137L3.3108 4.86901C2.78117 5.39863 2.51636 5.66344 2.31411 6.02348C2.08969 6.42298 1.92833 7.04347 1.9297 7.5017C1.93092 7.91464 2.01103 8.19687 2.17124 8.76131C3.03221 11.7947 4.65668 14.6571 7.04466 17.045C9.43264 19.433 12.295 21.0575 15.3284 21.9185C15.8928 22.0787 16.1751 22.1588 16.588 22.16C17.0462 22.1614 17.6667 22 18.0662 21.7756C18.4263 21.5733 18.6911 21.3085 19.2207 20.7789L19.3783 20.6213C19.9098 20.0898 20.1755 19.8241 20.3198 19.5387C20.6069 18.9712 20.6069 18.3009 20.3198 17.7333C20.1755 17.448 19.9098 17.1822 19.3783 16.6508L19.1835 16.4559C18.8339 16.1063 18.6591 15.9315 18.4833 15.8172C17.8204 15.3862 16.9658 15.3862 16.3029 15.8172C16.1271 15.9315 15.9523 16.1063 15.6027 16.4559C15.4884 16.5702 15.4313 16.6274 15.3644 16.6752C15.127 16.8453 14.7828 16.904 14.5024 16.8222C14.4235 16.7992 14.3612 16.7693 14.2365 16.7094C12.7869 16.0134 11.4282 15.0646 10.2266 13.8631Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
        </div>
    `

    notification_header.innerText = header;
    notification_text.innerText = text.length > 50 ? text.substring(0, 50) + '...' : text;
    notification_img.src = img;

    if (type === 'call') {
        notificationExtra.innerHTML = callButtonsHtml;
        
        const playSound = () => {
            sound = new Audio('/static/sounds/call.mp3');
            sound.loop = true;
            sound.play().catch(e => console.log('Sound blocked:', e));
            callSounds.set(id, sound);
        };
        
        if (document.visibilityState === 'visible') {
            playSound();
        } else {
            document.addEventListener('visibilitychange', function onVisible() {
                if (document.visibilityState === 'visible') {
                    playSound();
                    document.removeEventListener('visibilitychange', onVisible);
                }
            });
        }
    } else {
        sound = new Audio('/static/sounds/notification.mp3');
        sound.play().catch(e => console.log('Sound blocked:', e));
    }

    let topOffset = 10;
    notificationQueue.forEach(n => {
        topOffset += n.type === 'call' ? 146 : 90;
    });
    clone.style.top = `${topOffset}px`;
    clone.style.display = 'flex';
    clone.style.align_items = 'center';
    
    const deco = clone.querySelector('.notification_deco');
    deco.style.animation = `notice ${time}s linear`;
    
    document.body.appendChild(clone);
    notificationQueue.push({id, element: clone, type});
    
    setTimeout(() => clone.classList.add('show'), 10);
    
    setTimeout(() => {
        clone.classList.remove('show');
        stopCallSound(id);
        setTimeout(() => {
            clone.remove();
            notificationQueue = notificationQueue.filter(n => n.id !== id);
            let topOffset = 10;
            notificationQueue.forEach(n => {
                n.element.style.top = `${topOffset}px`;
                topOffset += n.type === 'call' ? 146 : 90;
            });
        }, 500);
    }, time * 1000);
}
