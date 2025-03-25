/**
 * Map initialization and interaction handling
 */
let map;
let allCities = [];
let currentLanguage = 'en';

// Initialize the map when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
    // Initialize the map
    initMap();
    
    // Load city data
    await loadCities();
    
    // Make cities available globally for search
    window.allCities = allCities;
    
    // Setup language change listener
    document.getElementById('lang-toggle').addEventListener('click', function() {
        updateMapForLanguage();
    });
});

/**
 * Initialize the Leaflet map
 */
function initMap() {
    // Create map centered on Morocco
    map = L.map('map').setView([31.7917, -7.0926], 6);
    
    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);
    
    // Add scale control
    L.control.scale().addTo(map);
}

/**
 * Load city data from API
 */
async function loadCities() {
    try {
        const response = await fetch('/api/cities');
        if (!response.ok) {
            throw new Error('Failed to fetch city data');
        }
        
        allCities = await response.json();
        addCitiesToMap();
    } catch (error) {
        console.error('Error loading cities:', error);
        displayErrorMessage('Failed to load city data. Please try again later.');
    }
}

/**
 * Add city markers to the map
 */
function addCitiesToMap() {
    if (!map || !allCities.length) return;
    
    // Create a marker cluster group for better performance with many markers
    const markers = L.markerClusterGroup();
    
    allCities.forEach(city => {
        const cityName = currentLanguage === 'en' ? city.name_en : city.name_ar;
        const regionName = currentLanguage === 'en' ? city.region_en : city.region_ar;
        
        // Create marker
        const marker = L.marker([city.latitude, city.longitude], {
            title: cityName
        });
        
        // Add popup with basic city info
        marker.bindPopup(`
            <div class="map-popup">
                <h3>${cityName}</h3>
                <p>${currentLanguage === 'en' ? 'Region' : 'المنطقة'}: ${regionName}</p>
                <p>${currentLanguage === 'en' ? 'Population' : 'عدد السكان'}: ${city.population ? city.population.toLocaleString() : 'N/A'}</p>
                <a href="/city/${city.id}" class="popup-link">
                    ${currentLanguage === 'en' ? 'More Details' : 'مزيد من التفاصيل'} →
                </a>
            </div>
        `);
        
        // Add to marker cluster
        markers.addLayer(marker);
    });
    
    // Add marker cluster to the map
    map.addLayer(markers);
}

/**
 * Update map markers when language changes
 */
function updateMapForLanguage() {
    // Update current language
    currentLanguage = document.documentElement.lang || 'en';
    
    // Clear existing layers
    map.eachLayer(layer => {
        if (layer instanceof L.MarkerClusterGroup || layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });
    
    // Re-add base tile layer if it was removed
    if (!map.hasLayer(L.tileLayer)) {
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(map);
    }
    
    // Re-add city markers with updated language
    addCitiesToMap();
}

/**
 * Display error message on the map
 */
function displayErrorMessage(message) {
    const mapElement = document.getElementById('map');
    if (mapElement) {
        mapElement.innerHTML = `
            <div class="map-error">
                <i class="fas fa-exclamation-triangle"></i>
                <p>${message}</p>
            </div>
        `;
    }
}

/**
 * Zoom to specific city on the map
 */
function zoomToCity(cityId) {
    console.log("Zooming to city ID:", cityId);
    
    // Parse cityId to ensure it's treated as a number if needed
    const cityIdValue = parseInt(cityId, 10);
    const city = allCities.find(c => c.id === cityIdValue || c.id === cityId);
    
    if (city && map) {
        console.log("Found city:", city.name_en);
        map.setView([city.latitude, city.longitude], 10);
        
        // Update currentLanguage from document
        currentLanguage = document.documentElement.lang || 'en';
        
        // Show popup for the city
        L.popup()
            .setLatLng([city.latitude, city.longitude])
            .setContent(`
                <div class="map-popup">
                    <h3>${currentLanguage === 'en' ? city.name_en : city.name_ar}</h3>
                    <p>${currentLanguage === 'en' ? 'Region' : 'المنطقة'}: ${currentLanguage === 'en' ? city.region_en : city.region_ar}</p>
                    <p>${currentLanguage === 'en' ? 'Population' : 'عدد السكان'}: ${city.population ? city.population.toLocaleString() : 'N/A'}</p>
                    <a href="/city/${city.id}" class="popup-link">
                        ${currentLanguage === 'en' ? 'More Details' : 'مزيد من التفاصيل'} →
                    </a>
                </div>
            `)
            .openOn(map);
    } else {
        console.error("City not found with ID:", cityId);
    }
}

// Export functions for use in other scripts
window.mapFunctions = {
    zoomToCity,
    updateMapForLanguage
};
