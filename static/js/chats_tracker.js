let chatSocket = null;
let chatsCache = new Map();
let updateThrottle = null;

function startChatsTracking() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    chatSocket = new WebSocket(`${protocol}//${window.location.host}/ws/chat/`);
    
    chatSocket.onopen = () => {
        console.log('WebSocket подключен');
        requestAnimationFrame(() => loadInitialChats());
    };
    
    chatSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.type === 'chat_update') {
            throttleUpdate(() => updateChatsList(data.data.chats));
        } else if (data.type === 'new_message') {
            handleNewMessage(data.message);
        } else if (data.type === 'incoming_call') {
            handleIncomingCall(data.caller, data.chat_id);
        }
    };
    
    chatSocket.onclose = () => {
        console.log('WebSocket отключен, переподключение через 3 сек...');
        setTimeout(startChatsTracking, 3000);
    };
    
    chatSocket.onerror = (error) => {
        console.error('WebSocket ошибка:', error);
    };
}

function throttleUpdate(fn) {
    if (updateThrottle) return;
    updateThrottle = setTimeout(() => {
        fn();
        updateThrottle = null;
    }, 100);
}

function loadInitialChats() {
    fetch('/app/list/')
        .then(response => response.json())
        .then(data => {
            updateChatsList(data.chats);
        })
        .catch(error => console.error('Error loading chats:', error));
}

function handleNewMessage(message) {
    updateSingleChat(message.chat_id);
    
    if (typeof handleNewMessageInCurrentChat === 'function') {
        handleNewMessageInCurrentChat(message);
    }
}

function updateSingleChat(chatId) {
    fetch('/app/list/')
        .then(response => response.json())
        .then(data => {
            const updatedChat = data.chats.find(c => c.chat_id === chatId);
            if (updatedChat) {
                updateChatElement(updatedChat);
            }
        })
        .catch(error => console.error('Error updating chat:', error));
}

function updateChatElement(chat) {
    const chatElement = document.querySelector(`[data-chat-id="${chat.chat_id}"]`);
    if (!chatElement) return;
    
    const lastMessageEl = chatElement.querySelector('.last_messege');
    if (lastMessageEl) {
        lastMessageEl.textContent = `${chat.last_message_sender} ${chat.last_message_text}`;
    }
    
    chatsCache.set(chat.chat_id, chat);
}

function handleIncomingCall(caller, chatId) {
    if (Notification.permission === 'granted') {
        const avatarUrl = caller.avatar?.url || '/static/images/default-avatar.png';
        sendNotification(caller.username || caller, 'Звонит вам', avatarUrl, 30, 'call', chatId);
        return;
    }
    
    if (confirm(`Входящий звонок от ${caller.username || caller}. Ответить?`)) {
        answerCall(chatId);
    }
}

function updateChatsList(chats) {
    const chatsList = document.querySelector('.chats');
    if (!chatsList) return;
    
    if (chats.length === 0) {
        chatsList.innerHTML = '<p class="no_chats">Чатов пока нет ;(</p>';
        chatsCache.clear();
        return;
    }
    
    const newChatsMap = new Map(chats.map(c => [c.chat_id, c]));
    const fragment = document.createDocumentFragment();
    let hasChanges = false;
    
    chats.forEach(chat => {
        const cached = chatsCache.get(chat.chat_id);
        if (!cached || cached.last_message_text !== chat.last_message_text) {
            const existingChat = chatsList.querySelector(`[data-chat-id="${chat.chat_id}"]`);
            if (existingChat) {
                updateChatElement(chat);
            } else {
                const chatEl = createChatElement(chat);
                fragment.appendChild(chatEl);
                hasChanges = true;
            }
            chatsCache.set(chat.chat_id, chat);
        }
    });
    
    if (hasChanges) {
        requestAnimationFrame(() => {
            chatsList.appendChild(fragment);
        });
    }
    
    chatsCache.forEach((_, chatId) => {
        if (!newChatsMap.has(chatId)) {
            const chatEl = chatsList.querySelector(`[data-chat-id="${chatId}"]`);
            if (chatEl) chatEl.remove();
            chatsCache.delete(chatId);
        }
    });
}

function createChatElement(chat) {
    const chatEl = document.createElement('div');
    chatEl.className = 'chat bg no-animation';
    chatEl.setAttribute('data-chat-id', chat.chat_id);
    chatEl.onclick = () => loadChat(chat.chat_id, chat.talker_username, chat.talker_id);
    
    const avatarHtml = chat.talker_avatar 
        ? `<img src="${chat.talker_avatar}" class="talker" loading="lazy">`
        : '';
    
    chatEl.innerHTML = `
        <div class="avatar_container">
            ${avatarHtml}
        </div>
        <div class="chat_info">
            <p class="talker_name"><b>${chat.talker_username}</b></p>
            <p class="last_messege">${chat.last_message_sender} ${chat.last_message_text}</p>
        </div>
    `;
    
    return chatEl;
}

if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
}
