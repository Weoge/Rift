function deleteChat (chatId) {
    if (!chatId || chatId === 'null') {
        console.error('Invalid chat ID');
        return;
    }
    
    fetch(`/app/delete_chat/${chatId}/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken'),
        },
    })
    .then(response => {
        if (response.ok) {
            const chatElement = document.querySelector(`.chat[data-chat-id="${chatId}"]`);
            if (chatElement) chatElement.remove();
            close_chat();
            closeModal();
            off_blur();
            hideContextMenu();
        } else {
            console.error('Error deleting chat');
        }
    })
    .catch(error => console.error('Error:', error));
}