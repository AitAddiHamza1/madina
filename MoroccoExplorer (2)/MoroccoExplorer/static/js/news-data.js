/**
 * News page functionality
 */
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the news page
    const newsContainer = document.getElementById('news-container');
    if (!newsContainer) return;
    
    // Load news data
    loadNewsData();
    
    // Setup language change listener
    document.getElementById('lang-toggle').addEventListener('click', function() {
        const currentLang = document.documentElement.lang || 'en';
        renderNewsItems(window.newsData, currentLang);
    });
});

/**
 * Load news data from API
 */
async function loadNewsData() {
    try {
        const response = await fetch('/api/news');
        if (!response.ok) {
            throw new Error('Failed to fetch news data');
        }
        
        const newsData = await response.json();
        window.newsData = newsData;
        
        // Render news with the current language
        renderNewsItems(newsData, document.documentElement.lang || 'en');
    } catch (error) {
        console.error('Error loading news data:', error);
        displayNewsError('Failed to load news. Please try again later.');
    }
}

/**
 * Render news items in the specified language
 */
function renderNewsItems(newsItems, lang) {
    const newsContainer = document.getElementById('news-container');
    if (!newsContainer || !newsItems || !newsItems.length) {
        displayNoNews(lang);
        return;
    }
    
    // Clear existing content
    newsContainer.innerHTML = '';
    
    // Create news grid
    const newsGrid = document.createElement('div');
    newsGrid.className = 'news-grid';
    
    // Add each news item
    newsItems.forEach(news => {
        const newsCard = createNewsCard(news, lang);
        newsGrid.appendChild(newsCard);
    });
    
    // Add to container
    newsContainer.appendChild(newsGrid);
}

/**
 * Create a single news card element
 */
function createNewsCard(news, lang) {
    const newsCard = document.createElement('div');
    newsCard.className = 'news-card';
    
    // Format date
    const dateObj = new Date(news.date_posted);
    const formattedDate = dateObj.toLocaleDateString(lang === 'en' ? 'en-US' : 'ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Use title and content based on language
    const title = lang === 'en' ? news.title_en : news.title_ar;
    const content = lang === 'en' ? news.content_en : news.content_ar;
    
    // Create truncated content for preview
    const truncatedContent = truncateText(content, 150);
    
    // Set card HTML
    newsCard.innerHTML = `
        <div class="news-card-image" style="background-image: url('${news.image_url || 'https://images.unsplash.com/photo-1517821099606-cef63a9bcda6'}')"></div>
        <div class="news-card-content">
            <span class="news-date">${formattedDate}</span>
            <h3>${title}</h3>
            <p>${truncatedContent}</p>
            <div class="news-author">${lang === 'en' ? 'By' : 'بواسطة'} ${news.author}</div>
        </div>
    `;
    
    return newsCard;
}

/**
 * Truncate text to specified length
 */
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    
    // Cut text and add ellipsis
    return text.substring(0, maxLength).trim() + '...';
}

/**
 * Display error message when news can't be loaded
 */
function displayNewsError(message) {
    const newsContainer = document.getElementById('news-container');
    if (newsContainer) {
        newsContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>${message}</p>
                <button onclick="loadNewsData()" class="btn">Try Again</button>
            </div>
        `;
    }
}

/**
 * Display message when no news are available
 */
function displayNoNews(lang) {
    const newsContainer = document.getElementById('news-container');
    if (newsContainer) {
        newsContainer.innerHTML = `
            <div class="no-news">
                <i class="fas fa-newspaper"></i>
                <p>${lang === 'en' ? 'No news articles available at the moment.' : 'لا توجد أخبار متاحة في الوقت الحالي.'}</p>
            </div>
        `;
    }
}
