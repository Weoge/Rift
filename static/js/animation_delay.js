document.addEventListener('DOMContentLoaded', function () {
    const chats = document.querySelectorAll('.chat');
    if (chats.length === 0) return;
    
    requestAnimationFrame(() => {
        chats.forEach((chat, i) => {
            chat.style.animationDelay = (i * 0.05) + 's';
        });
    });
});