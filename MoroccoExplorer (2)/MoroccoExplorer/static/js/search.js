/**
 * City search functionality
 */
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    
    if (!searchInput || !searchResults) return;
    
    console.log("Search functionality initialized");
    
    // Wait for city data to be loaded
    const checkForCities = setInterval(function() {
        if (window.allCities && window.allCities.length > 0) {
            clearInterval(checkForCities);
            console.log("Cities loaded for search:", window.allCities.length);
            
            // Add event listeners once cities are available
            searchInput.addEventListener('input', debounce(handleSearch, 300));
            searchInput.addEventListener('focus', function() {
                if (searchInput.value.trim().length > 1 && searchResults.children.length > 0) {
                    searchResults.style.display = 'block';
                }
            });
            
            // Close search results when clicking outside
            document.addEventListener('click', function(event) {
                if (!searchInput.contains(event.target) && !searchResults.contains(event.target)) {
                    searchResults.style.display = 'none';
                }
            });
        }
    }, 200); // Check every 200ms
});

/**
 * Handle search input changes
 */
function handleSearch() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const query = searchInput.value.trim().toLowerCase();
    
    console.log("Searching for:", query);
    
    // Clear results if query is empty
    if (query.length < 2) {
        searchResults.innerHTML = '';
        searchResults.style.display = 'none';
        return;
    }
    
    // Get all cities from the global variable set in map.js
    const cities = window.allCities || [];
    
    console.log("Cities available for search:", cities.length);
    
    // Filter cities based on search query
    const filteredCities = cities.filter(city => {
        const nameEn = (city.name_en || '').toLowerCase();
        const nameAr = (city.name_ar || '').toLowerCase();
        const regionEn = (city.region_en || '').toLowerCase();
        const regionAr = (city.region_ar || '').toLowerCase();
        
        return nameEn.includes(query) || 
               nameAr.includes(query) || 
               regionEn.includes(query) || 
               regionAr.includes(query);
    });
    
    console.log("Search results:", filteredCities.length);
    
    // Display search results
    displaySearchResults(filteredCities);
}

/**
 * Display filtered cities in search results
 */
function displaySearchResults(cities) {
    const searchResults = document.getElementById('search-results');
    const currentLang = document.documentElement.lang || 'en';
    
    // Clear previous results
    searchResults.innerHTML = '';
    
    if (cities.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'search-result-item';
        noResults.textContent = currentLang === 'en' ? 'No cities found' : 'لم يتم العثور على مدن';
        searchResults.appendChild(noResults);
    } else {
        // Add each city to results
        cities.forEach(city => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            resultItem.textContent = currentLang === 'en' ? 
                `${city.name_en} (${city.region_en || ''})` : 
                `${city.name_ar} (${city.region_ar || ''})`;
            
            // Add click event to zoom to city on map
            resultItem.addEventListener('click', function() {
                window.mapFunctions.zoomToCity(city.id);
                searchResults.style.display = 'none';
            });
            
            searchResults.appendChild(resultItem);
        });
    }
    
    // Show results container
    searchResults.style.display = 'block';
}

/**
 * Debounce function to limit how often a function is called
 */
function debounce(func, delay) {
    let timeoutId;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(context, args);
        }, delay);
    };
}
