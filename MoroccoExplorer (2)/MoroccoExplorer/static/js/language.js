/**
 * Language switching functionality
 */
document.addEventListener('DOMContentLoaded', function() {
    // Get language toggle button
    const langToggle = document.getElementById('lang-toggle');
    
    if (!langToggle) return;
    
    // Load saved language preference
    const savedLang = localStorage.getItem('language') || 'en';
    
    // Apply saved language
    setLanguage(savedLang);
    
    // Add click event to toggle language
    langToggle.addEventListener('click', toggleLanguage);
});

/**
 * Toggle between English and Arabic
 */
function toggleLanguage() {
    const currentLang = document.documentElement.lang || 'en';
    const newLang = currentLang === 'en' ? 'ar' : 'en';
    
    setLanguage(newLang);
    
    // Save preference to localStorage
    localStorage.setItem('language', newLang);
    
    // Update search results if present
    const searchInput = document.getElementById('search-input');
    if (searchInput && searchInput.value.trim().length > 1) {
        const searchEvent = new Event('input');
        searchInput.dispatchEvent(searchEvent);
    }
    
    // Update map if it exists
    if (window.mapFunctions && window.mapFunctions.updateMapForLanguage) {
        window.mapFunctions.updateMapForLanguage();
    }
}

/**
 * Set the website language
 */
function setLanguage(lang) {
    // Set HTML lang attribute
    document.documentElement.lang = lang;
    
    // Add RTL direction for Arabic
    if (lang === 'ar') {
        document.body.classList.add('rtl');
        updateLangIcon('ar');
    } else {
        document.body.classList.remove('rtl');
        updateLangIcon('en');
    }
    
    // Update all translatable elements
    updatePageTranslations(lang);
}

/**
 * Update language toggle icon
 */
function updateLangIcon(lang) {
    const langToggle = document.getElementById('lang-toggle');
    if (!langToggle) return;
    
    if (lang === 'ar') {
        langToggle.innerHTML = 'EN';
        langToggle.setAttribute('aria-label', 'Switch to English');
        langToggle.setAttribute('title', 'Switch to English');
    } else {
        langToggle.innerHTML = 'عربي';
        langToggle.setAttribute('aria-label', 'التبديل إلى اللغة العربية');
        langToggle.setAttribute('title', 'التبديل إلى اللغة العربية');
    }
}

/**
 * Update all translatable elements on the page
 */
function updatePageTranslations(lang) {
    // Get all elements with data-i18n attribute
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        
        // Get translation from translations object
        if (window.translations && window.translations[key]) {
            const translation = window.translations[key][lang];
            
            // Apply translation if it exists
            if (translation) {
                element.textContent = translation;
            }
        }
    });
    
    // Update placeholder attributes on inputs
    const inputElements = document.querySelectorAll('[data-i18n-placeholder]');
    
    inputElements.forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        
        if (window.translations && window.translations[key]) {
            const translation = window.translations[key][lang];
            
            if (translation) {
                element.setAttribute('placeholder', translation);
            }
        }
    });
}

/**
 * Get current language
 */
function getCurrentLanguage() {
    return document.documentElement.lang || 'en';
}

// Export language functions for use in other scripts
window.languageFunctions = {
    getCurrentLanguage,
    setLanguage,
    toggleLanguage,
    updatePageTranslations
};
