let currentChatId = null;
let lastMessageDate = null;

function startMessageTracking(chatId) {
    currentChatId = chatId;
    const messages = document.querySelectorAll('.message');
    if (messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        lastMessageDate = lastMessage.dataset.date;
    }
}

function stopMessageTracking() {
    currentChatId = null;
    lastMessageDate = null;
}

function handleNewMessageInCurrentChat(message) {
    if (!message.is_own) {
        sendNotification(message.sender, message.text, message.sender_avatar, 10, 'message');
    }
    
    if (currentChatId && message.chat_id === currentChatId) {
        addNewMessageToChat(message);
    }
}

function addNewMessageToChat(message) {
    const messagesContainer = document.querySelector('.messages');
    if (!messagesContainer) return;
    
    if (message.date && message.date !== lastMessageDate) {
        const dateSeparator = createDateSeparator(message.date);
        messagesContainer.appendChild(dateSeparator);
        lastMessageDate = message.date;
    }
    
    const messageEl = createMessageElement(message);
    if (message.date) {
        messageEl.dataset.date = message.date;
    }
    messagesContainer.appendChild(messageEl);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
