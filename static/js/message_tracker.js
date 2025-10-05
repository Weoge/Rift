let currentChatId = null;
let lastMessageCount = 0;
let messageCheckInterval = null;

function startMessageTracking(chatId) {
    currentChatId = chatId;
    lastMessageCount = document.querySelectorAll('.message').length;
    
    if (messageCheckInterval) {
        clearInterval(messageCheckInterval);
    }
    
    messageCheckInterval = setInterval(() => {
        checkForNewMessages();
    }, 2000);
}

function stopMessageTracking() {
    if (messageCheckInterval) {
        clearInterval(messageCheckInterval);
        messageCheckInterval = null;
    }
    currentChatId = null;
    lastMessageCount = 0;
}

function checkForNewMessages() {
    if (!currentChatId) return;
    
    fetch(`/app/messages/${currentChatId}/`)
    .then(response => response.json())
    .then(data => {
        if (data.messages && data.messages.length > lastMessageCount) {
            const newMessages = data.messages.slice(lastMessageCount);
            newMessages.forEach(message => {
                if (!message.is_own) {
                    showNotification(message.sender, message.text, {"icon": message.sender_avatar});
                    addNewMessageToChat(message);
                }
            });
            lastMessageCount = data.messages.length;
        }
    })
    .catch(error => console.error('Error checking messages:', error));
}

function addNewMessageToChat(message) {
    const messagesContainer = document.querySelector('.messages');
    if (!messagesContainer) return;
    
    const msgAvatarUrl = message.sender_avatar;
    const msgAvatarImg = msgAvatarUrl ? `<img src="${msgAvatarUrl}" class="talker">` : '<img src="/static/images/missing.png" class="talker">';
    
    const messageHtml = `
        <div class="message received">
            <div class="avatar_container">
                ${msgAvatarImg}
            </div>
            <div class="message_content">
                <p class="message_sender"><b>${message.sender}</b></p>
                <p class="message_text">${message.text}</p>
                <span class="message_time">${message.time}</span>
            </div>
        </div>
    `;
    
    messagesContainer.insertAdjacentHTML('beforeend', messageHtml);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}