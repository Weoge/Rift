let chats = document.querySelector(".chats_menu");
let hide_chats = document.querySelector(".hide_chats");
let user_info_extra = document.querySelector(".user_info_extra");
let chat_content = document.querySelector(".chat_content");
let settings = document.querySelector(".settings");
let search_chats = document.querySelector(".search_chats");

hide_chats.addEventListener("click", () => {
    chats.classList.toggle("hide");
    hide_chats.classList.toggle("hide");
    user_info_extra.classList.toggle("hide");
    chat_content.classList.toggle("hide");
    settings.classList.toggle("hide");
    search_chats.classList.toggle("hide");
});
