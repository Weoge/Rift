let currentChatId = null;

function startMessageTracking(chatId) {
    currentChatId = chatId;
}

function stopMessageTracking() {
    currentChatId = null;
}

function handleNewMessageInCurrentChat(message) {
    if (!currentChatId || message.chat_id !== currentChatId) return;
    
    if (!message.is_own) {
        showNotification(message.sender, message.text, {"icon": message.sender_avatar});
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
