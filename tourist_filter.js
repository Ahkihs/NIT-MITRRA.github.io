/**
 * NIT-MITRRA - Explore Raipur Tourist Attractions & Places Filter & Sort Controller
 */

document.addEventListener('DOMContentLoaded', () => {
    const cardsContainer = document.getElementById('placesGrid');
    if (!cardsContainer) return;

    const originalCards = Array.from(cardsContainer.querySelectorAll('.place-card'));
    const categoryTabs = Array.from(document.querySelectorAll('.cat-tab-btn'));
    const searchInput = document.getElementById('searchPlace');
    const searchClearBtn = document.getElementById('searchClearPlace');
    const distanceFilter = document.getElementById('filterPlaceDistance');
    const typeFilter = document.getElementById('filterPlaceType');
    const sortSelect = document.getElementById('sortPlace');
    const resetBtn = document.getElementById('resetPlaceFilters');
    const resetBtnEmpty = document.getElementById('resetPlaceFiltersEmpty');
    const countBadge = document.getElementById('visiblePlaceCount');
    const totalBadge = document.getElementById('totalPlaceCount');
    const noResultsBox = document.getElementById('noResultsPlaceBox');

    let activeCategory = 'all';

    // Set initial total count
    if (totalBadge) totalBadge.textContent = originalCards.length;
    if (countBadge) countBadge.textContent = originalCards.length;

    // Attach original index for default sorting
    originalCards.forEach((card, index) => {
        card.dataset.originalIndex = index;
    });

    /**
     * Parse card attributes safely
     */
    function parsePlaceData(card) {
        const name = (card.dataset.name || card.querySelector('h3')?.textContent || '').toLowerCase().trim();
        const category = (card.dataset.category || '').toLowerCase().trim();
        const location = (card.dataset.location || '').toLowerCase().trim();
        const distance = parseFloat(card.dataset.distance) || 999;
        const rating = parseFloat(card.dataset.rating) || 0;
        const priceType = (card.dataset.priceType || 'all').toLowerCase().trim();
        const allText = card.textContent.toLowerCase();

        return {
            card,
            name,
            category,
            location,
            distance,
            rating,
            priceType,
            allText,
            originalIndex: parseInt(card.dataset.originalIndex, 10)
        };
    }

    /**
     * Filter and sort logic
     */
    function applyFilterAndSort() {
        const query = (searchInput?.value || '').toLowerCase().trim();
        const distanceVal = distanceFilter?.value || 'all';
        const typeVal = typeFilter?.value || 'all';
        const sortVal = sortSelect?.value || 'default';

        // Toggle clear search button
        if (searchClearBtn) {
            searchClearBtn.style.display = query ? 'block' : 'none';
        }

        let parsedList = originalCards.map(parsePlaceData);

        // 1. FILTERING
        let filtered = parsedList.filter(item => {
            // Category Tab Filter
            if (activeCategory !== 'all' && item.category !== activeCategory) {
                return false;
            }

            // Keyword Search
            if (query && !item.allText.includes(query) && !item.name.includes(query) && !item.location.includes(query)) {
                return false;
            }

            // Distance Filter (from NIT Raipur)
            if (distanceVal !== 'all') {
                if (distanceVal === 'under-5km' && item.distance > 5.0) return false;
                if (distanceVal === '5-15km' && (item.distance < 5.0 || item.distance > 15.0)) return false;
                if (distanceVal === 'above-15km' && item.distance <= 15.0) return false;
            }

            // Entry / Budget Filter
            if (typeVal !== 'all') {
                if (typeVal === 'free' && item.priceType !== 'free') return false;
                if (typeVal === 'paid' && item.priceType !== 'paid') return false;
            }

            return true;
        });

        // 2. SORTING
        filtered.sort((a, b) => {
            switch (sortVal) {
                case 'distance-asc':
                    return a.distance - b.distance;
                case 'distance-desc':
                    return b.distance - a.distance;
                case 'rating-desc':
                    return b.rating - a.rating;
                case 'name-asc':
                    return a.name.localeCompare(b.name);
                default:
                    return a.originalIndex - b.originalIndex;
            }
        });

        // 3. RENDER / DOM UPDATES
        const visibleCardsSet = new Set(filtered.map(f => f.card));

        originalCards.forEach(card => {
            if (visibleCardsSet.has(card)) {
                card.classList.remove('hidden-card');
            } else {
                card.classList.add('hidden-card');
            }
        });

        // Re-append sorted cards in order
        filtered.forEach(f => {
            cardsContainer.appendChild(f.card);
        });

        // Update Count Badges and Container States for 2-card desktop balance
        if (countBadge) countBadge.textContent = filtered.length;
        cardsContainer.dataset.visibleCount = filtered.length;
        cardsContainer.classList.toggle('has-two-cards', filtered.length === 2);
        cardsContainer.classList.toggle('has-one-card', filtered.length === 1);

        // Toggle No Results View
        if (noResultsBox) {
            if (filtered.length === 0) {
                noResultsBox.style.display = 'flex';
            } else {
                noResultsBox.style.display = 'none';
            }
        }
    }

    /**
     * Category Tab Switching
     */
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            categoryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            activeCategory = tab.dataset.category || 'all';
            applyFilterAndSort();
        });
    });

    /**
     * Reset all filters
     */
    function resetAllFilters() {
        if (searchInput) searchInput.value = '';
        if (distanceFilter) distanceFilter.value = 'all';
        if (typeFilter) typeFilter.value = 'all';
        if (sortSelect) sortSelect.value = 'default';
        activeCategory = 'all';
        categoryTabs.forEach(t => {
            if (t.dataset.category === 'all') {
                t.classList.add('active');
            } else {
                t.classList.remove('active');
            }
        });
        applyFilterAndSort();
    }

    // Attach listeners
    searchInput?.addEventListener('input', applyFilterAndSort);
    searchClearBtn?.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        applyFilterAndSort();
    });
    distanceFilter?.addEventListener('change', applyFilterAndSort);
    typeFilter?.addEventListener('change', applyFilterAndSort);
    sortSelect?.addEventListener('change', applyFilterAndSort);
    resetBtn?.addEventListener('click', resetAllFilters);
    resetBtnEmpty?.addEventListener('click', resetAllFilters);

    // Initial pass
    applyFilterAndSort();
});
