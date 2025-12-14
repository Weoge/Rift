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
                <div class="founded_element btn" onclick="showProfileData(${chat.user_id})">
                    <div class="avatar_container">
                        ${chat.avatar ? 
                            `
                            <span class="blur_loader"></span>
                            <img src="${chat.avatar}" class="talker">
                            ` : 
                            `<span class="blur_loader"></span>`
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

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearchChats);
} else {
    initSearchChats();
}
