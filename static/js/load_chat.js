function loadChat(chatId, talker_username, talker_id) {
    const isBlurOn = getCookie('blur_effect') === 'on';
    document.querySelectorAll('.chat').forEach(chat => {
        chat.classList.remove('active');
        chat.classList.remove('selected');
    });
    
    const selectedChat = document.querySelector(`[data-chat-id="${chatId}"]`);
    const chatsMenu = document.querySelector('.chats_menu');
    selectedChat.classList.add('active');
    selectedChat.classList.add('selected');
    if (screen.width < 828) {
        chatsMenu.classList.add('none');
    }
    document.querySelector('.chat_content').classList.add('active');
    
    const chatContent = document.querySelector('.chat_content');
    let avatarHtml = '<span class="blur_loader"></span>';
    let senderName = talker_username;
    let senderId = talker_id;
    
    const chatElement = document.querySelector(`[data-chat-id="${chatId}"]`);
    if (chatElement) {
        const avatarImg = chatElement.querySelector('.avatar_container img');
        if (avatarImg && avatarImg.src) {
            avatarHtml = `<img src="${avatarImg.src}" class="talker" loading="lazy">`;
        }
    }
        
    const upper_chatHtml = `
        <div class="upper_chat bg">
            <div class="left">
                <button class="btn close_chat"  onclick="close_chat()">
                    <svg class="icon" width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
                <div class="talker_avatar" style="padding: 2px;">
                    <div class="avatar_container">
                        ${avatarHtml}
                    </div>
                </div>
                <div class="chat_name" style="margin-left: 10px;">
                    <p><b>${senderName}</b></p>
                </div>
            </div>
            <div class="right">
                <button onclick="showProfile(${senderId}); on_blur();" class="small" style="margin-right: 8px;">
                    <svg class="icon" width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 21C20 19.6044 20 18.9067 19.8278 18.3389C19.44 17.0605 18.4395 16.06 17.1611 15.6722C16.5933 15.5 15.8956 15.5 14.5 15.5H9.5C8.10444 15.5 7.40665 15.5 6.83886 15.6722C5.56045 16.06 4.56004 17.0605 4.17224 18.3389C4 18.9067 4 19.6044 4 21M16.5 7.5C16.5 9.98528 14.4853 12 12 12C9.51472 12 7.5 9.98528 7.5 7.5C7.5 5.01472 9.51472 3 12 3C14.4853 3 16.5 5.01472 16.5 7.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
                <button class="start small" style="margin-right: 3px;" onclick="event.stopPropagation();">
                    <svg class="icon" width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.38028 8.85335C9.07627 10.303 10.0251 11.6616 11.2266 12.8632C12.4282 14.0648 13.7869 15.0136 15.2365 15.7096C15.3612 15.7694 15.4235 15.7994 15.5024 15.8224C15.7828 15.9041 16.127 15.8454 16.3644 15.6754C16.4313 15.6275 16.4884 15.5704 16.6027 15.4561C16.9523 15.1064 17.1271 14.9316 17.3029 14.8174C17.9658 14.3864 18.8204 14.3864 19.4833 14.8174C19.6591 14.9316 19.8339 15.1064 20.1835 15.4561L20.3783 15.6509C20.9098 16.1824 21.1755 16.4481 21.3198 16.7335C21.6069 17.301 21.6069 17.9713 21.3198 18.5389C21.1755 18.8242 20.9098 19.09 20.3783 19.6214L20.2207 19.779C19.6911 20.3087 19.4263 20.5735 19.0662 20.7757C18.6667 21.0001 18.0462 21.1615 17.588 21.1601C17.1751 21.1589 16.8928 21.0788 16.3284 20.9186C13.295 20.0576 10.4326 18.4332 8.04466 16.0452C5.65668 13.6572 4.03221 10.7948 3.17124 7.76144C3.01103 7.19699 2.93092 6.91477 2.9297 6.50182C2.92833 6.0436 3.08969 5.42311 3.31411 5.0236C3.51636 4.66357 3.78117 4.39876 4.3108 3.86913L4.46843 3.7115C4.99987 3.18006 5.2656 2.91433 5.55098 2.76999C6.11854 2.48292 6.7888 2.48292 7.35636 2.76999C7.64174 2.91433 7.90747 3.18006 8.43891 3.7115L8.63378 3.90637C8.98338 4.25597 9.15819 4.43078 9.27247 4.60655C9.70347 5.26945 9.70347 6.12403 9.27247 6.78692C9.15819 6.96269 8.98338 7.1375 8.63378 7.4871C8.51947 7.60142 8.46231 7.65857 8.41447 7.72538C8.24446 7.96281 8.18576 8.30707 8.26748 8.58743C8.29048 8.66632 8.32041 8.72866 8.38028 8.85335Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
                <button class="end small" style="margin-right: 10px;" onclick="event.stopPropagation(); startVideoCall()">
                    <svg class="icon" width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 8.93137C22 8.32555 22 8.02265 21.8802 7.88238C21.7763 7.76068 21.6203 7.69609 21.4608 7.70865C21.2769 7.72312 21.0627 7.93731 20.6343 8.36569L17 12L20.6343 15.6343C21.0627 16.0627 21.2769 16.2769 21.4608 16.2914C21.6203 16.3039 21.7763 16.2393 21.8802 16.1176C22 15.9774 22 15.6744 22 15.0686V8.93137Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 9.8C2 8.11984 2 7.27976 2.32698 6.63803C2.6146 6.07354 3.07354 5.6146 3.63803 5.32698C4.27976 5 5.11984 5 6.8 5H12.2C13.8802 5 14.7202 5 15.362 5.32698C15.9265 5.6146 16.3854 6.07354 16.673 6.63803C17 7.27976 17 8.11984 17 9.8V14.2C17 15.8802 17 16.7202 16.673 17.362C16.3854 17.9265 15.9265 18.3854 15.362 18.673C14.7202 19 13.8802 19 12.2 19H6.8C5.11984 19 4.27976 19 3.63803 18.673C3.07354 18.3854 2.6146 17.9265 2.32698 17.362C2 16.7202 2 15.8802 2 14.2V9.8Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
                <button type="button" class="small more" onclick="showContextMenu('more', 'more_content', ${senderId});">
                    <svg class="icon" width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
            </div>
        </div>
    `;
    fetch(`/properties/check_blocked/${talker_id}`)
    .then(response => response.json())
    .then(data => {
        const send_message_fieldHtml = data.is_blocked
        ? `<div class="send_message_field bg">
            <div class="btn" style="margin: 10px 5px; position: absolute; left: 50%; transform: translate(-50%);" onclick="unblockUser(${talker_id});">
                <svg class="icon" width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.93 4.93L19.07 19.07M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                Разблокировать
            </div>
        </div>`
        : `<div class="send_message_field bg">
            <div class="images_preview flex"></div>
            <form class="message-form" data-chat-id="${chatId}">
                <button type="button" class="btn pin" style="margin-right: 10px;" onclick="showContextMenu('pin', 'pin_content');">
                    <svg class="icon" width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.5 5.25581V16.5C17.5 19.5376 15.0376 22 12 22C8.96243 22 6.5 19.5376 6.5 16.5V5.66667C6.5 3.64162 8.14162 2 10.1667 2C12.1917 2 13.8333 3.64162 13.8333 5.66667V16.4457C13.8333 17.4583 13.0125 18.2791 12 18.2791C10.9875 18.2791 10.1667 17.4583 10.1667 16.4457V6.65116" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
                <input autocomplete="off" class="send_message_input" type="text" name="message" placeholder="${gettext('Введите сообщение...')}">
                <input type="file" id="imageInputDynamic" name="images" accept="image/*" multiple style="display: none;" onchange="showImagePreview(this)">
                <label for="imageInputDynamic" class="btn start" style="margin-right: 3px; cursor: pointer;">
                    <svg class="icon" width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.2 21H6.93137C6.32555 21 6.02265 21 5.88238 20.8802C5.76068 20.7763 5.69609 20.6203 5.70865 20.4608C5.72312 20.2769 5.93731 20.0627 6.36569 19.6343L14.8686 11.1314C15.2646 10.7354 15.4627 10.5373 15.691 10.4632C15.8918 10.3979 16.1082 10.3979 16.309 10.4632C16.5373 10.5373 16.7354 10.7354 17.1314 11.1314L21 15V16.2M16.2 21C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2M16.2 21H7.8C6.11984 21 5.27976 21 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3 18.7202 3 17.8802 3 16.2V7.8C3 6.11984 3 5.27976 3.32698 4.63803C3.6146 4.07354 4.07354 3.6146 4.63803 3.32698C5.27976 3 6.11984 3 7.8 3H16.2C17.8802 3 18.7202 3 19.362 3.32698C19.9265 3.6146 20.3854 4.07354 20.673 4.63803C21 5.27976 21 6.11984 21 7.8V16.2M10.5 8.5C10.5 9.60457 9.60457 10.5 8.5 10.5C7.39543 10.5 6.5 9.60457 6.5 8.5C6.5 7.39543 7.39543 6.5 8.5 6.5C9.60457 6.5 10.5 7.39543 10.5 8.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </label>
                <button class="btn end" type="submit">
                    <svg class="icon" width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.4995 13.5001L20.9995 3.00005M10.6271 13.8281L13.2552 20.5861C13.4867 21.1815 13.6025 21.4791 13.7693 21.566C13.9139 21.6414 14.0862 21.6415 14.2308 21.5663C14.3977 21.4796 14.5139 21.1821 14.7461 20.587L21.3364 3.69925C21.5461 3.16207 21.6509 2.89348 21.5935 2.72185C21.5437 2.5728 21.4268 2.45583 21.2777 2.40604C21.1061 2.34871 20.8375 2.45352 20.3003 2.66315L3.41258 9.25349C2.8175 9.48572 2.51997 9.60183 2.43326 9.76873C2.35809 9.91342 2.35819 10.0857 2.43353 10.2303C2.52043 10.3971 2.81811 10.5128 3.41345 10.7444L10.1715 13.3725C10.2923 13.4195 10.3527 13.443 10.4036 13.4793C10.4487 13.5114 10.4881 13.5509 10.5203 13.596C10.5566 13.6468 10.5801 13.7073 10.6271 13.8281Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
            </form>
        </div>`;
        chatContent.innerHTML = upper_chatHtml + '<div class="messages"></div>' + send_message_fieldHtml;
        if (isBlurOn) {
            chatContent.querySelectorAll('.small, .smaller, .bg, .btn').forEach(el => el.classList.add('blured'));
        }
        
        setupMessageForm(chatId, talker_username);
        startMessageTracking(chatId);
    })

    fetch(`/app/messages/${chatId}/`)
    .then(response => response.json())
    .then(data => {
        const messagesContainer = document.querySelector('.messages');
        if (data.messages && data.messages.length > 0) {
            const fragment = document.createDocumentFragment();
            let lastDate = null;
            
            data.messages.forEach(message => {
                const messageDate = message.date;
                
                if (messageDate !== lastDate) {
                    const dateSeparator = createDateSeparator(messageDate);
                    fragment.appendChild(dateSeparator);
                    lastDate = messageDate;
                }
                
                const messageEl = createMessageElement(message);
                fragment.appendChild(messageEl);
            });
            messagesContainer.appendChild(fragment);
            if (isBlurOn) {
                chatContent.querySelectorAll('.message').forEach(el => el.classList.add('blured'));
            }
        } else {
            messagesContainer.innerHTML = `<p class="no_messages">${gettext("Сообщений пока нет")}</p>`;
        }
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
    })
    .catch(error => console.error('Error loading messages:', error));
}

function createDateSeparator(date) {
    const separator = document.createElement('div');
    separator.className = 'date-separator';
    separator.innerHTML = `<span>${date}</span>`;
    return separator;
}

function createMessageElement(message) {
    const messageEl = document.createElement('div');
    messageEl.className = `message ${message.is_own ? 'sent' : 'received'}`;
    
    const msgAvatarUrl = message.is_own ? message.user_avatar : message.sender_avatar;
    const msgSenderName = message.is_own ? `${gettext("Вы")}` : message.sender;
    
    let imagesHtml = '';
    if (message.images && message.images.length > 0) {
        message.images.forEach(img => {
            imagesHtml += `<div class="message_image_container"><img src="${img}" loading="lazy" onclick="on_blur(); openImage('${img}');"></div>`;
        });
    }
    
    messageEl.innerHTML = `
        <div class="avatar_container">
            ${msgAvatarUrl ? `<img src="${msgAvatarUrl}" class="talker" loading="lazy">` : ''}
        </div>
        <div class="message_content">
            <p class="message_sender"><b>${msgSenderName}</b></p>
            <div class="message_images">${imagesHtml}</div>
            <p class="message_text">${message.text}</p>
            <span class="message_time">${message.time}</span>
        </div>
    `;
    return messageEl;
}

function close_chat() {
    stopMessageTracking();
    document.querySelectorAll('.chat').forEach(chat => {
        chat.classList.remove('active');
    });
    document.querySelector('.chat_content').classList.remove('active');
    document.querySelector('.chats_menu').classList.remove('none');
}
