const context_menu = document.querySelector(".context_menu")

{/* <div class="btn">
    <svg class="icon" width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 2.26946V6.4C14 6.96005 14 7.24008 14.109 7.45399C14.2049 7.64215 14.3578 7.79513 14.546 7.89101C14.7599 8 15.0399 8 15.6 8H19.7305M20 9.98822V17.2C20 18.8802 20 19.7202 19.673 20.362C19.3854 20.9265 18.9265 21.3854 18.362 21.673C17.7202 22 16.8802 22 15.2 22H8.8C7.11984 22 6.27976 22 5.63803 21.673C5.07354 21.3854 4.6146 20.9265 4.32698 20.362C4 19.7202 4 18.8802 4 17.2V6.8C4 5.11984 4 4.27976 4.32698 3.63803C4.6146 3.07354 5.07354 2.6146 5.63803 2.32698C6.27976 2 7.11984 2 8.8 2H12.0118C12.7455 2 13.1124 2 13.4577 2.08289C13.7638 2.15638 14.0564 2.27759 14.3249 2.44208C14.6276 2.6276 14.887 2.88703 15.4059 3.40589L18.5941 6.59411C19.113 7.11297 19.3724 7.3724 19.5579 7.67515C19.7224 7.94356 19.8436 8.2362 19.9171 8.5423C20 8.88757 20 9.25445 20 9.98822Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    Файл
</div>
<div class="btn">
    <svg class="icon" width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.0006 12.1171C22.0006 6.5296 17.471 2 11.8835 2C7.34846 2 3.51036 4.98385 2.22531 9.0954C2.143 9.35878 2.10184 9.49047 2.10572 9.65514C2.10888 9.78904 2.14958 9.95446 2.20891 10.0745C2.28188 10.2222 2.39454 10.3349 2.61986 10.5602L13.4409 21.3807C13.6662 21.606 13.7788 21.7187 13.9265 21.7916C14.0466 21.8509 14.212 21.8916 14.3459 21.8948C14.5106 21.8987 14.6423 21.8575 14.9057 21.7752C19.017 20.49 22.0006 16.652 22.0006 12.1171Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M3.4468 9.7341C3.6873 9.71699 3.93013 9.70829 4.17499 9.70829C9.76253 9.70829 14.2921 14.2379 14.2921 19.8254C14.2921 20.0703 14.2834 20.3131 14.2663 20.5536C14.2364 20.9738 14.2215 21.1839 14.099 21.3137C13.9995 21.4191 13.8298 21.4824 13.6856 21.468C13.508 21.4502 13.3466 21.2887 13.0236 20.9658L3.03464 10.9768C2.71171 10.6539 2.55024 10.4924 2.53246 10.3148C2.51801 10.1706 2.58136 10.0009 2.68675 9.9014C2.81651 9.77892 3.02661 9.76398 3.4468 9.7341Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    Стикер
</div> */}

{/* <div class="btn">
    <svg class="icon" width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.2 21H6.93137C6.32555 21 6.02265 21 5.88238 20.8802C5.76068 20.7763 5.69609 20.6203 5.70865 20.4608C5.72312 20.2769 5.93731 20.0627 6.36569 19.6343L14.8686 11.1314C15.2646 10.7354 15.4627 10.5373 15.691 10.4632C15.8918 10.3979 16.1082 10.3979 16.309 10.4632C16.5373 10.5373 16.7354 10.7354 17.1314 11.1314L21 15V16.2M16.2 21C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2M16.2 21H7.8C6.11984 21 5.27976 21 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3 18.7202 3 17.8802 3 16.2V7.8C3 6.11984 3 5.27976 3.32698 4.63803C3.6146 4.07354 4.07354 3.6146 4.63803 3.32698C5.27976 3 6.11984 3 7.8 3H16.2C17.8802 3 18.7202 3 19.362 3.32698C19.9265 3.6146 20.3854 4.07354 20.673 4.63803C21 5.27976 21 6.11984 21 7.8V16.2M10.5 8.5C10.5 9.60457 9.60457 10.5 8.5 10.5C7.39543 10.5 6.5 9.60457 6.5 8.5C6.5 7.39543 7.39543 6.5 8.5 6.5C9.60457 6.5 10.5 7.39543 10.5 8.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
    Фото
</div> */}

function hideContextMenu() {
    context_menu.classList.remove("active");
}

function showContextMenu(pos, content, user_id, chat_id) {
    const pin_content = `
        <label onclick="hideContextMenu();" for="imageInputDynamic" class="btn" style="margin-right: 3px; cursor: pointer;">
            <svg class="icon" width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.2 21H6.93137C6.32555 21 6.02265 21 5.88238 20.8802C5.76068 20.7763 5.69609 20.6203 5.70865 20.4608C5.72312 20.2769 5.93731 20.0627 6.36569 19.6343L14.8686 11.1314C15.2646 10.7354 15.4627 10.5373 15.691 10.4632C15.8918 10.3979 16.1082 10.3979 16.309 10.4632C16.5373 10.5373 16.7354 10.7354 17.1314 11.1314L21 15V16.2M16.2 21C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2M16.2 21H7.8C6.11984 21 5.27976 21 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3 18.7202 3 17.8802 3 16.2V7.8C3 6.11984 3 5.27976 3.32698 4.63803C3.6146 4.07354 4.07354 3.6146 4.63803 3.32698C5.27976 3 6.11984 3 7.8 3H16.2C17.8802 3 18.7202 3 19.362 3.32698C19.9265 3.6146 20.3854 4.07354 20.673 4.63803C21 5.27976 21 6.11984 21 7.8V16.2M10.5 8.5C10.5 9.60457 9.60457 10.5 8.5 10.5C7.39543 10.5 6.5 9.60457 6.5 8.5C6.5 7.39543 7.39543 6.5 8.5 6.5C9.60457 6.5 10.5 7.39543 10.5 8.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
            ${gettext("Фото")}
        </label>
    `
    const more_content = `
        <div class="btn" onclick="on_blur(); showProfile(${user_id}, ${chat_id || 'null'});">
            <svg class="icon" width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 21C20 19.6044 20 18.9067 19.8278 18.3389C19.44 17.0605 18.4395 16.06 17.1611 15.6722C16.5933 15.5 15.8956 15.5 14.5 15.5H9.5C8.10444 15.5 7.40665 15.5 6.83886 15.6722C5.56045 16.06 4.56004 17.0605 4.17224 18.3389C4 18.9067 4 19.6044 4 21M16.5 7.5C16.5 9.98528 14.4853 12 12 12C9.51472 12 7.5 9.98528 7.5 7.5C7.5 5.01472 9.51472 3 12 3C14.4853 3 16.5 5.01472 16.5 7.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
            ${gettext("Профиль")}
        </div>
        <div class="btn">
            <svg class="icon" width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.38028 8.85335C9.07627 10.303 10.0251 11.6616 11.2266 12.8632C12.4282 14.0648 13.7869 15.0136 15.2365 15.7096C15.3612 15.7694 15.4235 15.7994 15.5024 15.8224C15.7828 15.9041 16.127 15.8454 16.3644 15.6754C16.4313 15.6275 16.4884 15.5704 16.6027 15.4561C16.9523 15.1064 17.1271 14.9316 17.3029 14.8174C17.9658 14.3864 18.8204 14.3864 19.4833 14.8174C19.6591 14.9316 19.8339 15.1064 20.1835 15.4561L20.3783 15.6509C20.9098 16.1824 21.1755 16.4481 21.3198 16.7335C21.6069 17.301 21.6069 17.9713 21.3198 18.5389C21.1755 18.8242 20.9098 19.09 20.3783 19.6214L20.2207 19.779C19.6911 20.3087 19.4263 20.5735 19.0662 20.7757C18.6667 21.0001 18.0462 21.1615 17.588 21.1601C17.1751 21.1589 16.8928 21.0788 16.3284 20.9186C13.295 20.0576 10.4326 18.4332 8.04466 16.0452C5.65668 13.6572 4.03221 10.7948 3.17124 7.76144C3.01103 7.19699 2.93092 6.91477 2.9297 6.50182C2.92833 6.0436 3.08969 5.42311 3.31411 5.0236C3.51636 4.66357 3.78117 4.39876 4.3108 3.86913L4.46843 3.7115C4.99987 3.18006 5.2656 2.91433 5.55098 2.76999C6.11854 2.48292 6.7888 2.48292 7.35636 2.76999C7.64174 2.91433 7.90747 3.18006 8.43891 3.7115L8.63378 3.90637C8.98338 4.25597 9.15819 4.43078 9.27247 4.60655C9.70347 5.26945 9.70347 6.12403 9.27247 6.78692C9.15819 6.96269 8.98338 7.1375 8.63378 7.4871C8.51947 7.60142 8.46231 7.65857 8.41447 7.72538C8.24446 7.96281 8.18576 8.30707 8.26748 8.58743C8.29048 8.66632 8.32041 8.72866 8.38028 8.85335Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
            ${gettext("Аудиозвонок")}
        </div>
        <div class="btn" onclick="startVideoCall()">
            <svg class="icon" width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 8.93137C22 8.32555 22 8.02265 21.8802 7.88238C21.7763 7.76068 21.6203 7.69609 21.4608 7.70865C21.2769 7.72312 21.0627 7.93731 20.6343 8.36569L17 12L20.6343 15.6343C21.0627 16.0627 21.2769 16.2769 21.4608 16.2914C21.6203 16.3039 21.7763 16.2393 21.8802 16.1176C22 15.9774 22 15.6744 22 15.0686V8.93137Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M2 9.8C2 8.11984 2 7.27976 2.32698 6.63803C2.6146 6.07354 3.07354 5.6146 3.63803 5.32698C4.27976 5 5.11984 5 6.8 5H12.2C13.8802 5 14.7202 5 15.362 5.32698C15.9265 5.6146 16.3854 6.07354 16.673 6.63803C17 7.27976 17 8.11984 17 9.8V14.2C17 15.8802 17 16.7202 16.673 17.362C16.3854 17.9265 15.9265 18.3854 15.362 18.673C14.7202 19 13.8802 19 12.2 19H6.8C5.11984 19 4.27976 19 3.63803 18.673C3.07354 18.3854 2.6146 17.9265 2.32698 17.362C2 16.7202 2 15.8802 2 14.2V9.8Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
            ${gettext("Видеозвонок")}
        </div>
    `
    const lang_content = `
        <div class="btn" style="margin: 10px 5px;" onclick="change_language('ru')">
            <div class="avatar_container_small">
                <img src="/static/images/languages/ru.png" class="talker">
            </div>
            <p class="font-bold" style="margin-left: 5px;">Русский</p>
        </div>
        <div class="btn" style="margin: 10px 5px;" onclick="change_language('en')">
            <div class="avatar_container_small">
                <img src="/static/images/languages/en.png" class="talker">
            </div>
            <p class="font-bold" style="margin-left: 5px;">English</p>
        </div>
        <div class="btn" style="margin: 10px 5px;" onclick="change_language('es')">
            <div class="avatar_container_small">
                <img src="/static/images/languages/es.png" class="talker">
            </div>
            <p class="font-bold" style="margin-left: 5px;">Español</p>
        </div>
        <div class="btn" style="margin: 10px 5px;" onclick="change_language('fr')">
            <div class="avatar_container_small">
                <img src="/static/images/languages/fr.png" class="talker">
            </div>
            <p class="font-bold" style="margin-left: 5px;">Français</p>
        </div>
        <div class="btn" style="margin: 10px 5px;" onclick="change_language('de')">
            <div class="avatar_container_small">
                <img src="/static/images/languages/de.png" class="talker">
            </div>
            <p class="font-bold" style="margin-left: 5px;">Deutsch</p>
        </div>
        <div class="btn" style="margin: 10px 5px;" onclick="change_language('zh')">
            <div class="avatar_container_small">
                <img src="/static/images/languages/zh.png" class="talker">
            </div>
            <p class="font-bold" style="margin-left: 5px;">中國人</p>
        </div>
        <div class="btn" style="margin: 10px 5px;" onclick="change_language('uk')">
            <div class="avatar_container_small">
                <img src="/static/images/languages/uk.png" class="talker">
            </div>
            <p class="font-bold" style="margin-left: 5px;">Українська</p>
        </div>
    `
    const change_username_content = `
        <form method="post" class="change_username_form" onsubmit="changeUsername(event, ${user_id}); return false;">
            <div class="flex">
                <input minlength="3" maxlength="15" autocomplete="off" pattern="[A-Za-z0-9_]*" type="text" name="username" class="input" placeholder="${gettext("Введите новое имя пользователя")}" required>
                <button type="submit" style="margin-right: 10px;" class="small">
                    <svg class="icon" width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
            </div>
            <p style="color: #fff;">${gettext("- От 3 до 15 символов.")}</p>
            <p style="color: #fff;">${gettext("- Латинские буквы, цифры и '_'.")}</p>
        </form>
    `

    context_menu.innerHTML = ``
    context_menu.classList.toggle("active")
    if (content == 'pin_content') {
        context_menu.innerHTML = pin_content
    } else if (content == 'more_content') {
        context_menu.innerHTML = more_content
    } else if (content == 'lang_content') {
        context_menu.innerHTML = lang_content
    } else if (content == 'change_username_content') {
        context_menu.innerHTML = change_username_content
    } else if (content == 'more_user_content') {
        fetch(`/properties/check_blocked/${user_id}/`)
        .then(response => response.json())
        .then(data => {
            const blockButton = data.is_blocked 
                ? `<div class="btn" style="margin: 10px 5px;" onclick="unblockUser(${user_id || 'null'});">
                    <svg class="icon" width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.93 4.93L19.07 19.07M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    Разблокировать
                </div>`
                : `<div class="btn" style="margin: 10px 5px;" onclick="blockUser(${user_id || 'null'});">
                    <svg class="icon" width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.93 4.93L19.07 19.07M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    Заблокировать
                </div>`;
            
            const more_user_content = `
                ${blockButton}
                <div class="btn" style="margin: 10px 5px;" onclick="deleteChat(${chat_id || 'null'});">
                    <svg class="icon" width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 6V5.2C16 4.0799 16 3.51984 15.782 3.09202C15.5903 2.71569 15.2843 2.40973 14.908 2.21799C14.4802 2 13.9201 2 12.8 2H11.2C10.0799 2 9.51984 2 9.09202 2.21799C8.71569 2.40973 8.40973 2.71569 8.21799 3.09202C8 3.51984 8 4.0799 8 5.2V6M10 11.5V16.5M14 11.5V16.5M3 6H21M19 6V17.2C19 18.8802 19 19.7202 18.673 20.362C18.3854 20.9265 17.9265 21.3854 17.362 21.673C16.7202 22 15.8802 22 14.2 22H9.8C8.11984 22 7.27976 22 6.63803 21.673C6.07354 21.3854 5.6146 20.9265 5.32698 20.362C5 19.7202 5 18.8802 5 17.2V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    Удалить переписку
                </div>
            `;
            context_menu.innerHTML = more_user_content;
            
            if (pos == 'more_user_pos') {
                context_menu.style.top = `calc(100% - ${context_menu.offsetHeight}px - 80px)`
                context_menu.style.left = `calc(100% - ${context_menu.offsetWidth}px - 10px)`
                context_menu.style.animation = `showTop 0.2s ease`
            } else if (pos == 'more_user_pos_profile') {
                const rect = document.querySelector('.extra_user').getBoundingClientRect()
                context_menu.style.top = `${rect.bottom + 15}px`
                context_menu.style.bottom = 'auto'
                context_menu.style.left = `${rect.left + (rect.width - context_menu.offsetWidth)}px`
                context_menu.style.animation = `showTop 0.2s ease`
            }
        });
        return;
    }
    
    context_menu.style.top = 'auto'
    context_menu.style.bottom = 'auto'
    context_menu.style.left = 'auto'
    
    if (pos == 'pin') {
        context_menu.style.bottom = `80px`
        context_menu.style.left = `10px`
        context_menu.style.animation = `showBottom 0.2s ease`
    } else if (pos == 'more') {
        const viewportHeight = window.innerHeight;
        const menuHeight = context_menu.offsetHeight;
        const bottomPos = Math.min(menuHeight + 80, viewportHeight - 20);
        context_menu.style.bottom = `calc(100% - ${bottomPos}px)`
        context_menu.style.left = `calc(100% - ${context_menu.offsetWidth}px - 10px)`
        context_menu.style.animation = `showTop 0.2s ease`
    } else if (pos == 'lang') {
        context_menu.dataset.pos = 'lang'
        const rect = document.querySelector('.header-extra').getBoundingClientRect()
        context_menu.style.top = `${rect.bottom + 15}px`
        context_menu.style.left = `${rect.left + (rect.width - context_menu.offsetWidth) / 2}px`
        context_menu.style.animation = `showTop 0.2s ease`
    } else if (pos == 'change_username') {
        const rect = document.querySelector('.change_username').getBoundingClientRect()
        context_menu.style.top = `${rect.bottom - 5}px`
        context_menu.style.left = `${rect.left + (rect.width - context_menu.offsetWidth) / 2}px`
        context_menu.style.animation = `showTop 0.2s ease`
    } else if (pos == 'lang_settings') {
        const rect = document.querySelector('.change_lang_btn').getBoundingClientRect()
        context_menu.style.top = `${rect.bottom + 15}px`
        context_menu.style.left = `${rect.left + (rect.width - context_menu.offsetWidth) / 2}px`
        context_menu.style.animation = `showTop 0.2s ease`
    }
}

document.addEventListener('click', function(e) {
    if (!e.target.closest('.context_menu') && !e.target.closest('.more') && !e.target.closest('.pin') && !e.target.closest('.select-lang-btn') && !e.target.closest('.change_username') && !e.target.closest('.change_lang_btn') && !e.target.closest('.extra_user')) {
        hideContextMenu();
    }
});

function updateLangMenuPosition() {
    if (context_menu.classList.contains('active') && context_menu.dataset.pos === 'lang') {
        const headerExtra = document.querySelector('.header-extra')
        const rect = headerExtra.getBoundingClientRect()
        context_menu.style.top = `${rect.bottom + 5}px`
        context_menu.style.left = `${rect.left + (rect.width - context_menu.offsetWidth) / 2}px`
    }
}

window.addEventListener('resize', updateLangMenuPosition);
