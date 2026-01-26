let fullscreen_image_view = document.querySelector('.fullscreen_image_view');
let fullscreen_image = document.querySelector('.fullscreen_image');
let currentImageUrl = '';

function openImage(imageUrl) {
    currentImageUrl = imageUrl;
    let imageHtml = `<img src="${imageUrl}">`
    fullscreen_image.innerHTML = imageHtml;
    fullscreen_image_view.classList.add('active');
}

function closeImage() {
    fullscreen_image_view.classList.remove('active');
}

function downloadImage() {
    const a = document.createElement('a');
    a.href = currentImageUrl;
    a.download = currentImageUrl.split('/').pop() || 'image.jpg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
