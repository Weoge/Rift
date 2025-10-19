document.addEventListener('DOMContentLoaded', function () {
    let chat = document.querySelectorAll('.chat');

    let delay = 0.1

    for (let i = 0; i < chat.length; i++) {
        chat[i].style = `animation-delay: ${delay}s`;
        delay += 0.1
    }
});