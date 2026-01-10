function change_language(language) {
    localStorage.setItem('language', language);
    document.cookie = `language=${language}; path=/; max-age=31536000`;
    
    fetch('/lang/set_language/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({language: language})
    }).then(() => {
        location.reload();
    });
}

// Обновляем флаг при загрузке
document.addEventListener('DOMContentLoaded', function() {
    const savedLanguage = localStorage.getItem('language') || 'ru';
    document.cookie = `language=${savedLanguage}; path=/; max-age=31536000`;
    
    fetch('/lang/set_language/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({language: savedLanguage})
    });
    
    updateLanguageFlag(savedLanguage);
});

function updateLanguageFlag(lang) {
    const lang_flag = document.querySelector(".lang-flag img");
    const lang_name = document.querySelector(".lang-name");
    
    if (lang_flag) {
        lang_flag.src = `/static/images/languages/${lang}.png`;
    }
    if (lang_name) {
        lang_name.innerText = lang.toUpperCase();
    }
}
