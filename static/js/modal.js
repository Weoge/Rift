let modal = document.querySelector(".modal");
let modal_title = document.querySelector(".title");
let modal_content = document.querySelector(".modal-content");

function showModal() {
    modal.classList.add("visible");
}

let profileDataHtml = `
    <div class="profile_data">
        <p>test</p>
    </div>
`;

function showCustomModal(title, modalContent) {
    modal_content.innerHTML = "";
    modal.classList.add("visible");
    modal_title.innerHTML = title;

    modal_content.innerHTML = modalContent + profileDataHtml;
    
    if (typeof initSearchChats === 'function') {
        setTimeout(initSearchChats, 0);
    }
}

function showProfile(user_id) {
    fetch(`/app/profile/${user_id}/`)
        .then(response => response.json())
        .then(data => {
            avatarUrl = data.avatar;
            avatarImg = avatarImg = avatarUrl ? `<img src="${avatarUrl}" class="talker">` : '<img src="/static/images/missing.png" class="talker">';
            profileHtml = `
                <div class="profile">
                    <div class="talker_avatar avatar_profile" style="padding: 2px;">
                        <div class="avatar_container">
                            ${avatarImg}
                        </div>
                    </div>
                    <p class="font-bold" style="color: #fff; font-size: 28px;">${data.username}</p>
                    <p style="color: #fff;">Был(а) ${data.last_login}</p>
                    <p style="color: #fff;">Дата регистрации: ${data.date_joined}</p>
                    <button class="small">
                        <svg class="icon" width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 12C21 16.9706 16.9706 21 12 21C10.8029 21 9.6603 20.7663 8.61549 20.3419C8.41552 20.2607 8.31554 20.2201 8.23472 20.202C8.15566 20.1843 8.09715 20.1778 8.01613 20.1778C7.9333 20.1778 7.84309 20.1928 7.66265 20.2229L4.10476 20.8159C3.73218 20.878 3.54589 20.909 3.41118 20.8512C3.29328 20.8007 3.19933 20.7067 3.14876 20.5888C3.09098 20.4541 3.12203 20.2678 3.18413 19.8952L3.77711 16.3374C3.80718 16.1569 3.82222 16.0667 3.82221 15.9839C3.8222 15.9028 3.81572 15.8443 3.798 15.7653C3.77988 15.6845 3.73927 15.5845 3.65806 15.3845C3.23374 14.3397 3 13.1971 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </button>
                </div>
            `;
            showCustomModal("Профиль", profileHtml);
        })
        .catch(error => {
            console.error('Error loading profile:', error);
        });
}

function showProfileData(user_id) {
    const profile_data = document.querySelector(".profile_data");
    const search_element = document.querySelector(".element");
    const founded_elements = document.querySelector(".founded_elements");
    const modal_up = document.querySelector(".modal_up");
    let modal_up_new = `
        <button class="small" onclick="showProfileDataBack();">
            <svg class="icon" width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <span class="title font-bold">Профиль</span>
    `;

    fetch(`/app/profile/${user_id}/`)
    .then(response => response.json())
    .then(data => {
        avatarUrl = data.avatar;
        avatarImg = avatarImg = avatarUrl ? `<img src="${avatarUrl}" class="talker">` : '<img src="/static/images/missing.png" class="talker">';
        profileDataHtmlNew = `
            <div class="profile">
                <div class="talker_avatar avatar_profile" style="padding: 2px;">
                    <div class="avatar_container">
                        ${avatarImg}
                    </div>
                </div>
                <p class="font-bold" style="color: #fff; font-size: 28px;">${data.username}</p>
                <p style="color: #fff;">Был(а) ${data.last_login}</p>
                <p style="color: #fff;">Дата регистрации: ${data.date_joined}</p>
                <button class="small">
                    <svg class="icon" width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 12C21 16.9706 16.9706 21 12 21C10.8029 21 9.6603 20.7663 8.61549 20.3419C8.41552 20.2607 8.31554 20.2201 8.23472 20.202C8.15566 20.1843 8.09715 20.1778 8.01613 20.1778C7.9333 20.1778 7.84309 20.1928 7.66265 20.2229L4.10476 20.8159C3.73218 20.878 3.54589 20.909 3.41118 20.8512C3.29328 20.8007 3.19933 20.7067 3.14876 20.5888C3.09098 20.4541 3.12203 20.2678 3.18413 19.8952L3.77711 16.3374C3.80718 16.1569 3.82222 16.0667 3.82221 15.9839C3.8222 15.9028 3.81572 15.8443 3.798 15.7653C3.77988 15.6845 3.73927 15.5845 3.65806 15.3845C3.23374 14.3397 3 13.1971 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
            </div>
        `
        profile_data.innerHTML = profileDataHtmlNew;
    })
    .catch(error => {
        console.error('Error loading profile:', error);
    });

    modal_up.innerHTML = modal_up_new;
    profile_data.classList.add("show_profile_data");
    search_element.classList.add("show_profile_data");
    founded_elements.classList.add("show_profile_data");
    modal_up.classList.add("show_profile_data");
}

function showProfileDataBack() {
    const profile_data = document.querySelector(".profile_data");
    const search_element = document.querySelector(".element");
    const founded_elements = document.querySelector(".founded_elements");
    const modal_up = document.querySelector(".modal_up");
    let modal_up_new = `
        <button class="small" onclick="closeModal(); off_blur()">
            <svg class="icon" width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
        </button>
        <span class="title font-bold">Поиск</span>
    `

    modal_up.innerHTML = modal_up_new;
    profile_data.classList.remove("show_profile_data");
    search_element.classList.remove("show_profile_data");
    founded_elements.classList.remove("show_profile_data");
    modal_up.classList.remove("show_profile_data");
}

function closeModal() {
    modal.classList.remove("visible");
    modal_content.innerHTML = "";
}
