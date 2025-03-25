/**
 * Featured content loading functionality
 * Handles featured cities and news preview on the homepage
 */
document.addEventListener('DOMContentLoaded', function() {
    // Load featured cities
    loadFeaturedCities();
    
    // Load news preview
    loadNewsPreview();
});

/**
 * Load featured cities
 */
async function loadFeaturedCities() {
    const container = document.getElementById('featured-cities-container');
    if (!container) return;
    
    try {
        // Get cities from API
        const response = await fetch('/api/cities');
        const cities = await response.json();
        
        // Get 3 featured cities (or less if fewer are available)
        const featuredCities = cities.slice(0, 3);
        
        // Check if we have cities to display
        if (featuredCities.length === 0) {
            container.innerHTML = '<p class="text-center">No cities available at the moment.</p>';
            return;
        }
        
        // Create city cards
        const cityImages = [
            'https://images.unsplash.com/photo-1578893780787-6eeb29df8e13', // Marrakech-like image
            'https://images.unsplash.com/photo-1553240779-65bee4a34037', // Casablanca-like image
            'https://images.unsplash.com/photo-1580667309872-1366d6399398'  // Fes-like image
        ];
        
        const cityDescriptions = {
            'Marrakech': 'The cultural heart of Morocco with bustling souks, historic palaces, and vibrant traditions.',
            'Casablanca': 'Morocco\'s largest city and economic center, known for its modern architecture and rich history.',
            'Fez': 'The ancient city with the world\'s oldest university and the famous medieval Medina.',
            'Rabat': 'The capital city of Morocco, known for its Islamic and French-colonial heritage.',
            'Tangier': 'A major city at the strait of Gibraltar, where the Mediterranean meets the Atlantic.',
            'Agadir': 'A modern resort destination with beautiful beaches on Morocco\'s southern Atlantic coast.',
            'Chefchaouen': 'The famous blue city nestled in the mountains of northwest Morocco.',
            'Essaouira': 'A historic port city with beautiful beaches and a UNESCO-listed medina.',
            'Meknes': 'One of Morocco\'s imperial cities with impressive monuments and historical buildings.',
            'Oujda': 'A vibrant city near the Algerian border, known for its cultural diversity.'
        };
        
        // Get current language
        const currentLang = document.documentElement.lang || 'en';
        let html = '';
        
        featuredCities.forEach((city, index) => {
            const cityName = currentLang === 'en' ? city.name_en : city.name_ar;
            const defaultDescription = 'A beautiful Moroccan city with rich culture and history.';
            const description = cityDescriptions[city.name_en] || defaultDescription;
            
            html += `
                <div class="city-card">
                    <div class="city-card-image" style="background-image: url('${cityImages[index % cityImages.length]}')"></div>
                    <div class="city-card-content">
                        <h3>${cityName}</h3>
                        <p>${description}</p>
                        <a href="/city/${city.id}" class="btn">${currentLang === 'en' ? 'Learn More' : 'المزيد'}</a>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        
    } catch (error) {
        console.error('Error loading featured cities:', error);
        container.innerHTML = '<p class="text-center">Error loading cities. Please try again later.</p>';
    }
}

/**
 * Load news preview for homepage
 */
async function loadNewsPreview() {
    const container = document.getElementById('news-preview-container');
    if (!container) return;
    
    try {
        // Get news from API
        const response = await fetch('/api/news');
        const allNews = await response.json();
        
        // Get 2 latest news (or less if fewer are available)
        const previewNews = allNews.slice(0, 2);
        
        // Check if we have news to display
        if (previewNews.length === 0) {
            container.innerHTML = '<p class="text-center">No news available at the moment.</p>';
            return;
        }
        
        // Default news images if none provided
        const defaultNewsImages = [
            'https://images.unsplash.com/photo-1517821099606-cef63a9bcda6',
            'https://images.unsplash.com/photo-1513002749550-c59d786b8e6c'
        ];
        
        // Get current language
        const currentLang = document.documentElement.lang || 'en';
        let html = '';
        
        previewNews.forEach((news, index) => {
            const title = currentLang === 'en' ? news.title_en : news.title_ar;
            const content = currentLang === 'en' ? news.content_en : news.content_ar;
            
            // Format date
            const date = new Date(news.date_posted);
            const formattedDate = date.toLocaleDateString(currentLang === 'en' ? 'en-US' : 'ar-MA', {
                year: 'numeric', 
                month: 'long', 
                day: 'numeric'
            });
            
            // Create summary by truncating content
            const summary = content.length > 120 ? content.substring(0, 120) + '...' : content;
            
            // Use provided image or fall back to default
            const imageUrl = news.image_url || defaultNewsImages[index % defaultNewsImages.length];
            
            html += `
                <div class="news-card">
                    <div class="news-card-image" style="background-image: url('${imageUrl}')"></div>
                    <div class="news-card-content">
                        <span class="news-date">${formattedDate}</span>
                        <h3>${title}</h3>
                        <p>${summary}</p>
                        <a href="/news" class="btn" data-i18n="read_more">${currentLang === 'en' ? 'Read More' : 'اقرأ المزيد'}</a>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        
    } catch (error) {
        console.error('Error loading news preview:', error);
        container.innerHTML = '<p class="text-center">Error loading news. Please try again later.</p>';
    }
}