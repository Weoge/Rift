function setupMessageForm(chatId, talker_username) {
    const messageForm = document.querySelector('.message-form');
    if (messageForm) {
        messageForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const messageInput = this.querySelector('input[name="message"]');
            const messageText = messageInput.value.trim();
            const imageInput = this.querySelector('input[name="images"]');
            const formData = new FormData();
            
            if (messageText) {
                formData.append('message', messageText);
            }
            
            if (imageInput && imageInput.files.length > 0) {
                for (let i = 0; i < imageInput.files.length; i++) {
                    formData.append('images', imageInput.files[i]);
                }
            }
            
            if (messageText || (imageInput && imageInput.files.length > 0)) {
                fetch(`/app/messages/${chatId}/send/`, {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': getCookie('csrftoken')
                    },
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        if (data.message && typeof addNewMessageToChat === 'function') {
                            addNewMessageToChat(data.message);
                        }
                        messageInput.value = '';
                        if (imageInput) imageInput.value = '';
                    } else {
                        console.error('Error:', data.error);
                    }
                })
                .catch(error => console.error('Error:', error));
            }
        });
    }
}