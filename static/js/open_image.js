let fullscreen_image_view = document.querySelector('.fullscreen_image_view');

function openImage(imageUrl) {
    let imageHtml = `<img src="${imageUrl}">`
    fullscreen_image_view.innerHTML = imageHtml;
    fullscreen_image_view.classList.add('active');
}

function closeImage() {
    fullscreen_image_view.classList.remove('active');
}