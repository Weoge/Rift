var settingsPanel = document.querySelector(".settingsPanel");
var settingsButton = document.querySelector("#settingsButton");

function openSettings() {
    settingsPanel.classList.add("open");
    settingsButton.classList.add("open");
}

function closeSettings() {
    settingsPanel.classList.remove("open");
    settingsButton.classList.remove("open");
}
