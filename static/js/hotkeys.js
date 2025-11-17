document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
        const activeElement = document.activeElement;
        const modal = document.querySelector(".modal.visible");
        const blur = document.querySelector(".blur.visible");
        const chat = document.querySelector(".chat.active");
        const chat_content = document.querySelector(".chat_content.active");
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

        if (activeElement && activeElement !== document.body) {
            activeElement.blur();
        } else if (modal) {
            const hasProfileData = modal.querySelector(".profile_data.show_profile_data");
            if (hasProfileData) {
                modal_up.innerHTML = modal_up_new;
                profile_data.classList.remove("show_profile_data");
                search_element.classList.remove("show_profile_data");
                founded_elements.classList.remove("show_profile_data");
            } else {
                modal.classList.remove("visible");
                blur.classList.remove("visible");
            }
        } else if (chat_content) {
            chat.classList.remove("active");
            chat_content.classList.remove("active");
        }
    }
});