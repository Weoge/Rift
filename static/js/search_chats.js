function initSearchChats() {
    const searchInput = document.querySelector('input[name="search"]');
    const chatsContainer = document.querySelector('.founded_elements');
    
    if (!searchInput || !chatsContainer) return;
    
    searchInput.addEventListener('input', async (e) => {
        const query = e.target.value;
        
        if (!query) {
            chatsContainer.innerHTML = '';
            return;
        }
        
        const response = await fetch(`/app/search/?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        
        chatsContainer.innerHTML = '';
        
        data.results.forEach(chat => {
            const chatElement = `
                <div class="founded_element btn">
                    <div class="avatar_container">
                        ${chat.avatar ? 
                            `<img src="${chat.avatar}" class="talker">` : 
                            `<img src="/static/images/missing.png" class="talker">`
                        }
                    </div>
                    <div class="chat_info">
                        <p class="talker_name"><b>${chat.username}</b></p>
                    </div>
                </div>
            `;
            chatsContainer.insertAdjacentHTML('beforeend', chatElement);
        });
    });
}

// Вызываем при загрузке страницы и при открытии модального окна
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearchChats);
} else {
    initSearchChats();
}
