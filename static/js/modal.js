let modal = document.querySelector(".modal");
let modal_title = document.querySelector(".title");
let modal_content = document.querySelector(".modal-content");
let modal_up = document.querySelector(".modal_up");
let originalModalTitle = '';

function showModal() {
    modal.classList.add("visible");
}

let profileDataHtml = `
    <div class="modal_data">
        <p>test</p>
    </div>
`;


function showCustomModal(title, modalContent, extra_buttons) {
    modal_content.innerHTML = "";
    modal.classList.add("visible");
    modal_title.innerHTML = title;
    originalModalTitle = title;
    window.originalModalTitle = title;

    let modal_up_new = `
        <button class="small" onclick="closeModal(); off_blur()">
            <svg class="icon" width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
        </button>
        <span class="title font-bold">${title}</span>
        <div class="modal_extra_buttons">
            ${extra_buttons || ''}
        </div>
    `;
    modal_up.innerHTML = modal_up_new;

    const searchTitles = ['Поиск', 'Search', 'Suche', 'Recherche', 'Búsqueda', '搜索', 'Пошук'];
    const settingsTitles = ['Настройки', 'Settings', 'Einstellungen', 'Paramètres', 'Configuración', 'Ajustes', '设置', 'Налаштування'];
    
    if (searchTitles.includes(title) || settingsTitles.includes(title)) {
        modal_content.innerHTML = modalContent + profileDataHtml;
    } else {
        modal_content.innerHTML = modalContent;
    }
    const isBlurOn = getCookie('blur_effect') === 'on';
    if (isBlurOn) {
        modal.querySelectorAll('.small, .bg, .btn, .input').forEach(el => el.classList.add('blured'));
    }
    
    if (typeof initSearchChats === 'function') {
        setTimeout(initSearchChats, 0);
    }
}

function showProfile(user_id, chat_id) {
    const context_menu = document.querySelector(".context_menu");
    context_menu.classList.toggle("active")

    fetch(`/app/profile/${user_id}/`)
        .then(response => response.json())
        .then(data => {
            const avatarHtml = !data.avatar
                ? `<span class="blur_loader"></span>`
                : `
                <span class="blur_loader"></span>
                <img src="${data.avatar}" class="talker">
                `;
            
            let mediaContentHtml = '';
            if (data.media_content && data.media_content.length > 0) {
                for (let i = 0; i < data.media_content.length; i++) {
                    mediaContentHtml += `
                    <div class="media_item" onclick="openImage('${data.media_content[i].url}');">
                        <img src="${data.media_content[i].url}" class="chat_media_item">
                    </div>
                    `;
                }
            }
            
            profileHtml = `
                <div class="profile">
                    <div class="talker_avatar avatar_profile" style="padding: 2px;">
                        <div class="avatar_container_mid">
                            ${avatarHtml}
                        </div>
                    </div>
                    <p class="font-bold" style="color: #fff; font-size: 28px;">${data.username}</p>
                    <p style="color: #fff;">${data.last_login_text}</p>
                    <p style="color: #fff;">${data.date_joined_text}</p>
                    <div class="chat_media_content">
                        ${mediaContentHtml}
                    </div>
                </div>
            `;
            extra_buttonsHtml = `
                <button class="small extra_user" onclick="showContextMenu('more_user_pos_profile', 'more_user_content', ${user_id}, ${chat_id || 'null'});">
                    <svg class="icon" width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
            `;
            showCustomModal(data.profile_title, profileHtml, extra_buttonsHtml);
        })
        .catch(error => {
            console.error('Error loading profile:', error);
        });
}

function showProfileData(user_id) {
    const modal_data = document.querySelector(".modal_data");

    fetch(`/app/profile/${user_id}/`)
    .then(response => response.json())
    .then(data => {
        avatarUrl = data.avatar;
        avatarImg = avatarImg = avatarUrl ? `<img src="${avatarUrl}" class="talker">` : '<img src="/static/images/missing.png" class="talker">';
        const avatarHtml = !data.avatar
            ? `<span class="blur_loader"></span>`
            : `
            <span class="blur_loader"></span>
            <img src="${data.avatar}" class="talker">
            `;
        profileDataHtmlNew = `
            <div class="profile">
                <div class="talker_avatar avatar_profile" style="padding: 2px;">
                    <div class="avatar_container_mid">
                        ${avatarHtml}
                    </div>
                </div>
                <p class="font-bold" style="color: #fff; font-size: 28px;">${data.username}</p>
                <p style="color: #fff;">${data.last_login_text}</p>
                <p style="color: #fff;">${data.date_joined_text}</p>
                <button class="small" onclick="create_chat(${data.user_id})">
                    <svg class="icon" width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 12C21 16.9706 16.9706 21 12 21C10.8029 21 9.6603 20.7663 8.61549 20.3419C8.41552 20.2607 8.31554 20.2201 8.23472 20.202C8.15566 20.1843 8.09715 20.1778 8.01613 20.1778C7.9333 20.1778 7.84309 20.1928 7.66265 20.2229L4.10476 20.8159C3.73218 20.878 3.54589 20.909 3.41118 20.8512C3.29328 20.8007 3.19933 20.7067 3.14876 20.5888C3.09098 20.4541 3.12203 20.2678 3.18413 19.8952L3.77711 16.3374C3.80718 16.1569 3.82222 16.0667 3.82221 15.9839C3.8222 15.9028 3.81572 15.8443 3.798 15.7653C3.77988 15.6845 3.73927 15.5845 3.65806 15.3845C3.23374 14.3397 3 13.1971 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
            </div>
        `
        
        let modal_up_new = `
            <button class="small" onclick="showProfileDataBack();">
                <svg class="icon" width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <span class="title font-bold">${data.profile_title}</span>
        `;
        
        modal_data.innerHTML = profileDataHtmlNew;
        modal_up.innerHTML = modal_up_new;
        const isBlurOn = getCookie('blur_effect') === 'on';
        if (isBlurOn) {
            modal.querySelectorAll('.btn, .small').forEach(el => el.classList.add('blured'));
        }
    })
    .catch(error => {
        console.error('Error loading profile:', error);
    });

    modal_data.classList.add("show_modal_data");
    modal_content.classList.add("show_modal_data");
    modal_up.classList.add("show_modal_data");
}

function showProfileDataBack() {
    const modal_data = document.querySelector(".modal_data");
    const modal_up = document.querySelector(".modal_up");
    
    let modal_up_new = `
        <button class="small" onclick="closeModal(); off_blur()">
            <svg class="icon" width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
        </button>
        <span class="title font-bold">${window.originalModalTitle || originalModalTitle}</span>
    `

    modal_up.innerHTML = modal_up_new;
    modal_data.classList.remove("show_modal_data");
    modal_content.classList.remove("show_modal_data");
    modal_up.classList.remove("show_modal_data");
    const isBlurOn = getCookie('blur_effect') === 'on';
    if (isBlurOn) {
        modal.querySelectorAll('.btn, .small').forEach(el => el.classList.add('blured'));
    }
}

function closeModal() {
    modal.classList.remove("visible");
    modal_content.innerHTML = "";
    modal_title.innerHTML = "";
    const modal_data = document.querySelector(".modal_data");
    if (modal_data && modal_data.classList.contains("show_modal_data")) {
        showProfileDataBack();
    }
}
