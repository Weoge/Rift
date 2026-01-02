let notificationQueue = [];
let notificationIdCounter = 0;

function sendNotification(header, text, img) {
    const template = document.querySelector('.notification');
    const clone = template.cloneNode(true);
    const id = notificationIdCounter++;
    const notification_header = clone.querySelector('.notification_header');
    const notification_text = clone.querySelector('.notification_text');
    const notification_img = clone.querySelector('.notification_img');
    notification_header.innerText = header;
    notification_text.innerText = text;
    notification_img.src = img;
    
    clone.style.top = `${10 + notificationQueue.length * 90}px`;
    clone.style.display = 'flex';
    clone.style.align_items = 'center';
    
    const deco = clone.querySelector('.notification_deco');
    deco.style.animation = 'notice 10s linear';
    
    document.body.appendChild(clone);
    notificationQueue.push({id, element: clone});
    
    setTimeout(() => clone.classList.add('show'), 10);
    
    setTimeout(() => {
        clone.classList.remove('show');
        setTimeout(() => {
            clone.remove();
            notificationQueue = notificationQueue.filter(n => n.id !== id);
            notificationQueue.forEach((n, i) => {
                n.element.style.top = `${10 + i * 90}px`;
            });
        }, 500);
    }, 10000);
}