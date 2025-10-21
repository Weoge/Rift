document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
        const activeElement = document.activeElement;
        const modal = document.querySelector(".modal.visible");
        const blur = document.querySelector(".blur.visible");
        const chat = document.querySelector(".chat.active");
        const chat_content = document.querySelector(".chat_content.active");
        if (activeElement && activeElement !== document.body) {
            activeElement.blur();
        } else if (modal) {
            modal.classList.remove("visible");
            blur.classList.remove("visible");
        } else if (chat_content) {
            chat.classList.remove("active");
            chat_content.classList.remove("active");
        }
    }
});