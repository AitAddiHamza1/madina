/**
 * Theme toggle functionality for light/dark mode
 */
document.addEventListener('DOMContentLoaded', function() {
    // Get theme toggle button
    const themeToggle = document.getElementById('theme-toggle');
    
    if (!themeToggle) return;
    
    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme');
    
    // Apply saved theme or default to light
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        updateThemeIcon(true);
    } else {
        document.body.classList.remove('dark-mode');
        updateThemeIcon(false);
    }
    
    // Add click event to toggle theme
    themeToggle.addEventListener('click', toggleTheme);
});

/**
 * Toggle between light and dark themes
 */
function toggleTheme() {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    
    // Save preference to localStorage
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    
    // Update theme icon
    updateThemeIcon(isDarkMode);
    
    // Update map tiles if map exists (for better dark mode appearance)
    if (window.map) {
        updateMapTheme(isDarkMode);
    }
}

/**
 * Update theme toggle icon based on current mode
 */
function updateThemeIcon(isDarkMode) {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    
    // Clear any existing icon classes
    themeToggle.innerHTML = '';
    
    // Add appropriate icon
    if (isDarkMode) {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        themeToggle.setAttribute('aria-label', 'Switch to light mode');
        themeToggle.setAttribute('title', 'Switch to light mode');
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggle.setAttribute('aria-label', 'Switch to dark mode');
        themeToggle.setAttribute('title', 'Switch to dark mode');
    }
}

/**
 * Update map tiles for better appearance in dark mode
 */
function updateMapTheme(isDarkMode) {
    // If the map exists, update its tile layer
    if (window.map) {
        // Remove existing tile layers
        window.map.eachLayer(function(layer) {
            if (layer instanceof L.TileLayer) {
                window.map.removeLayer(layer);
            }
        });
        
        // Add appropriate tile layer
        if (isDarkMode) {
            // Dark mode map tiles
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                maxZoom: 19
            }).addTo(window.map);
        } else {
            // Light mode map tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19
            }).addTo(window.map);
        }
    }
}
