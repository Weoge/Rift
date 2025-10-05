document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
        const activeElement = document.activeElement;
        if (activeElement && activeElement.classList.contains("send_message_input")) {
            activeElement.blur();
        }
    }
});