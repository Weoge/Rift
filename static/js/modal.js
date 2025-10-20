let modal = document.querySelector(".modal");

defaultHTML = `
        <button class="small" onclick="closeModal(); off_blur()">
            <svg class="icon" width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
        </button>
`
loginHTML = `<p>Working!!!</p>`

function showModal(modalContent) {
    modal.classList.add("visible");
    modal.innerHTML = defaultHTML;
    if (modalContent == "login") {
        modal.innerHTML += loginHTML;
    };
}

function closeModal() {
    modal.classList.remove("visible");
    modal.innerHTML = defaultHTML;
}
