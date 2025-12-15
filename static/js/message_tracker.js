let currentChatId = null;
let lastMessageCount = 0;

function startMessageTracking(chatId) {
    currentChatId = chatId;
    lastMessageCount = document.querySelectorAll('.message').length;
    
    // Теперь сообщения приходят через WebSocket автоматически
    // Не нужен setInterval!
}

function stopMessageTracking() {
    currentChatId = null;
    lastMessageCount = 0;
}

// Эта функция вызывается из chats_tracker.js когда приходит новое сообщение
function handleNewMessageInCurrentChat(message) {
    if (!currentChatId || message.chat_id !== currentChatId) return;
    
    if (!message.is_own) {
        showNotification(message.sender, message.text, {"icon": message.sender_avatar});
        addNewMessageToChat(message);
    }
    lastMessageCount++;
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
