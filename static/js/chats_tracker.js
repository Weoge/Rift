let currentChats = [];

function startChatsTracking() {
    setInterval(() => {
        fetch('/app/list/')
            .then(response => response.json())
            .then(data => {
                updateChatsList(data.chats);
            })
            .catch(error => console.error('Error updating chats:', error));
    }, 2000);
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
