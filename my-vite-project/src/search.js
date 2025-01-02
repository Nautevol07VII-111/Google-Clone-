document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('input');
    const searchButton = document.querySelector('.searchButtonsContainer button:first-child');
    const luckyButton = document.querySelector('.searchButtonsContainer button:last-child');

    // Loads API credentials from env variables
    const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
    const SEARCH_ENGINE_ID = import.meta.env.VITE_SEARCH_ENGINE_ID;

    // Adds validation for API credentials
    if (!API_KEY || !SEARCH_ENGINE_ID) {
        console.error('Missing API credentials');
        alert('Missing API credentials. Please check your configuration.');
        return;
    }

    async function performSearch(searchTerm, isLucky = false) {
        try {
            if (!searchTerm || typeof searchTerm !== 'string') {
                throw new Error('Invalid search term');
            }

            const url = new URL('https://www.googleapis.com/customsearch/v1');
            url.searchParams.append('key', API_KEY);
            url.searchParams.append('cx', SEARCH_ENGINE_ID);
            url.searchParams.append('q', searchTerm);

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (isLucky && data.items?.[0]?.link) {
                window.location.href = data.items[0].link;
            } else {
                window.location.href = `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`;
            }
        } catch (error) {
            console.error('Search failed:', error);
            alert('Sorry, something went wrong with the search. Please try again.');
        }
    }

    let searchTimeout;
    const handleSearch = (searchTerm, isLucky) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performSearch(searchTerm, isLucky);
        }, 300);
    };

    searchButton?.addEventListener('click', () => {
        const searchTerm = searchInput?.value?.trim();
        if (searchTerm) {
            handleSearch(searchTerm, false);
        }
    });

    luckyButton?.addEventListener('click', () => {
        const searchTerm = searchInput?.value?.trim();
        if (searchTerm) {
            handleSearch(searchTerm, true);
        }
    });

    searchInput?.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            const searchTerm = event.target.value.trim();
            if (searchTerm) {
                handleSearch(searchTerm, false);
            }
        }
    });
});
