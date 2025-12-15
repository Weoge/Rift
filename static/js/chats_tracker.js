let currentChats = [];
let chatSocket = null;

function startChatsTracking() {
    // Подключаемся к WebSocket
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    chatSocket = new WebSocket(`${protocol}//${window.location.host}/ws/chat/`);
    
    chatSocket.onopen = () => {
        console.log('WebSocket подключен');
        // Загружаем начальный список чатов
        loadInitialChats();
    };
    
    chatSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.type === 'chat_update') {
            updateChatsList(data.data.chats);
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
    
    // Heartbeat для поддержания соединения
    setInterval(() => {
        if (chatSocket.readyState === WebSocket.OPEN) {
            chatSocket.send(JSON.stringify({ type: 'ping' }));
        }
    }, 30000);
}

function loadInitialChats() {
    // Загружаем чаты один раз при подключении
    fetch('/app/list/')
        .then(response => response.json())
        .then(data => {
            updateChatsList(data.chats);
        })
        .catch(error => console.error('Error loading chats:', error));
}

function handleNewMessage(message) {
    loadInitialChats();
    if (typeof handleNewMessageInCurrentChat === 'function') {
        handleNewMessageInCurrentChat(message);
    }
}

function handleIncomingCall(caller, chatId) {
    if (Notification.permission === 'granted') {
        const notification = new Notification(`Входящий звонок от ${caller}`, {
            body: 'Нажмите, чтобы ответить',
            icon: '/static/images/icon.png',
            requireInteraction: true
        });
        
        notification.onclick = () => {
            window.focus();
            answerCall(chatId);
            notification.close();
        };
    }
    
    if (confirm(`Входящий звонок от ${caller}. Ответить?`)) {
        answerCall(chatId);
    }
}

function updateChatsList(chats) {
    const chatsList = document.querySelector('.chats');
    if (!chatsList) return;
    
    if (chats.length === 0) {
        chatsList.innerHTML = '<p class="no_chats">Чатов пока нет ;(</p>';
        currentChats = [];
        return;
    }
    
    if (JSON.stringify(currentChats) === JSON.stringify(chats)) {
        return;
    }
    
    currentChats = chats;
    
    chatsList.innerHTML = chats.map(chat => {
        const avatarHtml = !chat.talker_avatar 
            ? `<span class="blur_loader"></span>`
            : `
            <span class="blur_loader"></span>
            <img src="${chat.talker_avatar}" class="talker">
            `;
        
        return `
            <div class="chat bg no-animation" onclick="loadChat(${chat.chat_id}, '${chat.talker_username}', ${chat.talker_id})" data-chat-id="${chat.chat_id}">
                <div class="avatar_container">
                    ${avatarHtml}
                </div>
                <div class="chat_info">
                    <p class="talker_name"><b>${chat.talker_username}</b></p>
                    <p class="last_messege">${chat.last_message_sender} ${chat.last_message_text}</p>
                </div>
            </div>
        `;
    }).join('');
}

// Запросить разрешение на уведомления при загрузке
if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
}
