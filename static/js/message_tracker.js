let currentChatId = null;

function startMessageTracking(chatId) {
    currentChatId = chatId;
}

function stopMessageTracking() {
    currentChatId = null;
}

function handleNewMessageInCurrentChat(message) {
    if (!message.is_own) {
        sendNotification(message.sender, message.text, message.sender_avatar);
    }
    
    if (currentChatId && message.chat_id === currentChatId) {
        addNewMessageToChat(message);
    }
}

function addNewMessageToChat(message) {
    const messagesContainer = document.querySelector('.messages');
    if (!messagesContainer) return;
    
    const messageEl = createMessageElement(message);
    messagesContainer.appendChild(messageEl);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
