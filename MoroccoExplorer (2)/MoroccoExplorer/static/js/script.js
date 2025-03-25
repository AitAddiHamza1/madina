document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initTheme();
    
    // Initialize language
    initLanguage();
    
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('mobile-active');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (nav && nav.classList.contains('mobile-active') && 
            !nav.contains(event.target) && 
            !mobileMenuBtn.contains(event.target)) {
            nav.classList.remove('mobile-active');
        }
    });
    
    // Search functionality
    const searchInput = document.getElementById('city-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchValue = this.value.toLowerCase();
            filterCities(searchValue);
        });
    }
});

// Theme functions
function initTheme() {
    const themeToggle = document.querySelector('.theme-toggle');
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Check local storage for saved theme or use system preference
    const savedTheme = localStorage.getItem('theme') || (prefersDarkMode ? 'dark' : 'light');
    
    // Apply theme
    setTheme(savedTheme);
    
    // Toggle theme on button click
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
        });
    }
}

function setTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        updateThemeToggleIcon('light');
    } else {
        document.body.classList.remove('dark-mode');
        updateThemeToggleIcon('dark');
    }
    
    // Save theme to local storage
    localStorage.setItem('theme', theme);
}

function updateThemeToggleIcon(nextTheme) {
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            if (nextTheme === 'dark') {
                icon.className = 'fas fa-moon';
            } else {
                icon.className = 'fas fa-sun';
            }
        }
    }
}

// Search functions
function filterCities(searchValue) {
    // This will be implemented in map.js to filter markers on the map
    if (window.filterMapCities) {
        window.filterMapCities(searchValue);
    }
}
