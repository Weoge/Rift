document.addEventListener("DOMContentLoaded", function() {
    let blur_elements = document.querySelectorAll('.small, .smaller, .bg, .btn');
    if (getCookie('blur_effect') == 'on') {
        blur_elements.forEach(element => {
            element.classList.add('blured');
        });
    } else {
        blur_elements.forEach(element => {
            element.classList.remove('blured');
        });
    }
    if (getCookie('bg_anim') == 'on') {
        document.querySelector('body').classList.add('bg_anim');
    }
});

function logout() {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({type: 'CLEAR_CACHE'});
    }
    
    fetch('/auth/logout/', {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken'),
        },
    })
    .then(response => {
        if (response.ok) {
            document.cookie.split(";").forEach(c => {
                document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
            });
            window.location.replace('/');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
};

function setupAvatarUpload() {
    const avatarInput = document.getElementById('avatar-input');
    if (avatarInput) {
        avatarInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById('avatar-img').src = e.target.result;
                };
                reader.readAsDataURL(file);
                
                const formData = new FormData();
                formData.append('avatar_image', file);
                const userId = avatarInput.getAttribute('data-user-id');
                
                fetch(`/properties/update_avatar/${userId}`, {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': getCookie('csrftoken')
                    },
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        location.reload();
                    } else {
                        console.error('Error:', data.error);
                    }
                })
                .catch(error => console.error('Error:', error));
            }
        });
    }
}

function openSettings(category) {
    const modal_data = document.querySelector(".modal_data");
    let modal_up = document.querySelector(".modal_up");
    const modal_content = document.querySelector(".modal-content");
    let modal = document.querySelector(".modal");
    
    const currentTitle = document.querySelector(".title");
    if (currentTitle) {
        window.originalModalTitle = currentTitle.textContent;
    }
    
    fetch('/app/settings/')
        .then(response => response.json())
        .then(data => {
            if (category === 'account') {
                let modal_up_new = `
                    <button class="small" onclick="showProfileDataBack();">
                        <svg class="icon" width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </button>
                    <span class="title font-bold">${data['account_title']}</span>
                `;
                modal_data.innerHTML = data['account'];
                modal_up.innerHTML = modal_up_new;
                modal_data.classList.add("show_modal_data");
                modal_content.classList.add("show_modal_data");
                setupAvatarUpload();
            } else if (category === 'security') {
                let modal_up_new = `
                    <button class="small" onclick="showProfileDataBack();">
                        <svg class="icon" width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </button>
                    <span class="title font-bold">${data['security_title']}</span>
                `;
                modal_data.innerHTML = data['security'];
                modal_up.innerHTML = modal_up_new;
                modal_data.classList.add("show_modal_data");
                modal_content.classList.add("show_modal_data");
            } else if (category === 'style') {
                let modal_up_new = `
                    <button class="small" onclick="showProfileDataBack();">
                        <svg class="icon" width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </button>
                    <span class="title font-bold">${data['style_title']}</span>
                `;
                modal_data.innerHTML = data['style'];
                modal_up.innerHTML = modal_up_new;
                modal_data.classList.add("show_modal_data");
                modal_content.classList.add("show_modal_data");
            }
            const isBlurOn = getCookie('blur_effect') === 'on';
            if (isBlurOn) {
                modal.querySelectorAll('.btn, .small, .bg, .btn_red, .smaller').forEach(el => el.classList.add('blured'));
            }
        })
        .catch(error => console.error('Error fetching settings data:', error));
}

function changeUsername(event, userId) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    fetch(`/properties/change_username/${userId}`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            hideContextMenu();
            location.reload();
        }
    });
}

function updateAvatar(event, userId) {
    event.preventDefault();
    const form = event.target;
    const form_data = new FormData(form);

    fetch(`/properties/update_avatar/${userId}`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: form_data
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            hideContextMenu();
            location.reload();
        }
    });
}

function toggleBlurEffect(checked) {
    addCookie('blur_effect', checked ? 'on' : 'off', 365);
    document.querySelectorAll('.small, .smaller, .bg, .btn, .btn_red').forEach(el => {
        el.classList.toggle('blured', checked);
    });
}

function toggleBgAnim(checked) {
    addCookie('bg_anim', checked ? 'on' : 'off', 365);
    document.querySelector('body').classList.toggle('bg_anim', checked);
}
