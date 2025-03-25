/**
 * City detail page functionality
 */
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on a city page
    const cityDetailMap = document.getElementById('city-detail-map');
    if (!cityDetailMap) return;
    
    // Get city ID from URL
    const cityId = getCityIdFromUrl();
    if (!cityId) return;
    
    // Initialize city map and load data
    initCityMap(cityDetailMap);
    loadCityData(cityId);
    
    // Set up language switching
    document.getElementById('lang-toggle').addEventListener('click', function() {
        const currentLang = document.documentElement.lang || 'en';
        updateCityContent(window.currentCityData, currentLang);
    });
});

/**
 * Extract city ID from the current URL
 */
function getCityIdFromUrl() {
    const pathParts = window.location.pathname.split('/');
    const cityIdIndex = pathParts.indexOf('city') + 1;
    
    if (cityIdIndex > 0 && cityIdIndex < pathParts.length) {
        return parseInt(pathParts[cityIdIndex], 10);
    }
    
    return null;
}

/**
 * Initialize Leaflet map for city detail page
 */
function initCityMap(mapElement) {
    // Create map with default view (will be updated when city data is loaded)
    window.cityMap = L.map(mapElement).setView([31.7917, -7.0926], 6);
    
    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(window.cityMap);
}

/**
 * Load city data from API
 */
async function loadCityData(cityId) {
    try {
        const response = await fetch(`/api/city/${cityId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch city data');
        }
        
        const cityData = await response.json();
        window.currentCityData = cityData;
        
        // Update map and content with the fetched data
        updateCityMap(cityData);
        updateCityContent(cityData, document.documentElement.lang || 'en');
    } catch (error) {
        console.error('Error loading city data:', error);
        displayErrorMessage('Failed to load city information. Please try again later.');
    }
}

/**
 * Update map with city location
 */
function updateCityMap(cityData) {
    if (!window.cityMap) return;
    
    // Center map on city location
    window.cityMap.setView([cityData.latitude, cityData.longitude], 12);
    
    // Add marker for the city
    const marker = L.marker([cityData.latitude, cityData.longitude]).addTo(window.cityMap);
    
    // Add circle showing approximate city area
    L.circle([cityData.latitude, cityData.longitude], {
        color: '#c8102e',
        fillColor: '#c8102e',
        fillOpacity: 0.2,
        radius: 5000 // 5km radius as an estimate
    }).addTo(window.cityMap);
}

/**
 * Update page content with city information in the current language
 */
function updateCityContent(cityData, lang) {
    // Update page title
    const cityName = lang === 'en' ? cityData.name_en : cityData.name_ar;
    document.title = `${cityName} - Madina Morocco`;
    
    // Update heading
    const cityHeader = document.querySelector('.city-header h2');
    if (cityHeader) {
        cityHeader.textContent = cityName;
    }
    
    // Update region information
    const regionText = document.getElementById('city-region');
    if (regionText) {
        const regionName = lang === 'en' ? cityData.region_en : cityData.region_ar;
        regionText.textContent = lang === 'en' ? `Region: ${regionName}` : `المنطقة: ${regionName}`;
    }
    
    // Update population information
    const populationText = document.getElementById('city-population');
    if (populationText) {
        populationText.textContent = lang === 'en' 
            ? `Population: ${cityData.population ? cityData.population.toLocaleString() : 'N/A'}`
            : `عدد السكان: ${cityData.population ? cityData.population.toLocaleString() : 'غير متوفر'}`;
    }
    
    // Update description
    const descriptionContent = document.getElementById('description-content');
    if (descriptionContent) {
        descriptionContent.textContent = lang === 'en' ? cityData.description_en : cityData.description_ar;
    }
    
    // Update culture information
    const cultureContent = document.getElementById('culture-content');
    if (cultureContent) {
        cultureContent.textContent = lang === 'en' ? cityData.culture_en : cityData.culture_ar;
    }
    
    // Update landmarks information
    const landmarksContent = document.getElementById('landmarks-content');
    if (landmarksContent) {
        landmarksContent.textContent = lang === 'en' ? cityData.landmarks_en : cityData.landmarks_ar;
    }
    
    // Update section headings
    const sectionTitles = {
        'about-heading': { en: 'About the City', ar: 'حول المدينة' },
        'culture-heading': { en: 'Culture & Traditions', ar: 'الثقافة والتقاليد' },
        'landmarks-heading': { en: 'Historical Landmarks', ar: 'المعالم التاريخية' }
    };
    
    for (const [id, translations] of Object.entries(sectionTitles)) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = translations[lang];
        }
    }
}

/**
 * Display error message on the page
 */
function displayErrorMessage(message) {
    const cityContentElement = document.querySelector('.city-info');
    if (cityContentElement) {
        cityContentElement.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>${message}</p>
                <a href="/" class="btn">Return to Homepage</a>
            </div>
        `;
    }
}
