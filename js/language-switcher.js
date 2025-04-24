// Language switcher functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize language from localStorage
    var currentLang = localStorage.getItem('blog-language') || 'zh';
    updateLanguageUI(currentLang);
    
    // Update page content based on language
    updatePageContent(currentLang);
});

function toggleLanguage() {
    var currentLang = localStorage.getItem('blog-language') || 'zh';
    var newLang = currentLang === 'zh' ? 'en' : 'zh';
    
    // Save the language preference
    localStorage.setItem('blog-language', newLang);
    
    // Update UI
    updateLanguageUI(newLang);
    
    // Update page content
    updatePageContent(newLang);
    
    // If on about page, update the content display
    if (window.location.pathname.includes('about')) {
        if (newLang === 'en') {
            window.location.hash = "#en";
        } else {
            window.location.hash = "#zh";
        }
        if (typeof _render === 'function') {
            _render();
        }
    }
}

function updateLanguageUI(lang) {
    // Update language toggle text
    var toggleElement = document.getElementById('current-lang');
    if (toggleElement) {
        toggleElement.textContent = lang === 'zh' ? '中文' : 'English';
    }
    
    // Update all navigation items
    var langItems = document.querySelectorAll('.lang-item');
    langItems.forEach(function(item) {
        if (lang === 'en') {
            var enText = item.getAttribute('data-lang-en');
            if (enText) item.textContent = enText;
        } else {
            var zhText = item.getAttribute('data-lang-zh');
            if (zhText) item.textContent = zhText;
        }
    });
}

function updatePageContent(lang) {
    // Update page title and description if available
    var pageTitle = document.querySelector('header .site-heading h1');
    var pageSubheading = document.querySelector('header .site-heading .subheading');
    
    if (pageTitle) {
        var titleZh = pageTitle.getAttribute('data-title-zh');
        var titleEn = pageTitle.getAttribute('data-title-en');
        
        if (titleZh && titleEn) {
            pageTitle.textContent = lang === 'zh' ? titleZh : titleEn;
        }
    }
    
    if (pageSubheading) {
        var descZh = pageSubheading.getAttribute('data-desc-zh');
        var descEn = pageSubheading.getAttribute('data-desc-en');
        
        if (descZh && descEn) {
            pageSubheading.textContent = lang === 'zh' ? descZh : descEn;
        }
    }
}
