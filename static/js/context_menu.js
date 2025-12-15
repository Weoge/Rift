const context_menu = document.querySelector(".context_menu")
const pin = document.querySelector(".pin")

function showContextMenuPin() {
    context_menu.classList.toggle("active")
    context_menu.style.bottom = `80px`
    context_menu.style.left = `10px`
    // context_menu.innerHTML = ``
}
