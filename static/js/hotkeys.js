document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
        const activeElement = document.activeElement;
        const modal = document.querySelector(".modal.visible");
        const blur = document.querySelector(".blur.visible");
        const chat = document.querySelector(".chat.active");
        const chat_content = document.querySelector(".chat_content.active");
        const modal_data = document.querySelector(".modal_data");

        if (activeElement && activeElement !== document.body) {
            activeElement.blur();
        } else if (modal) {
            const hasProfileData = modal.querySelector(".modal_data.show_modal_data");
            if (hasProfileData) {
                showProfileDataBack();
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