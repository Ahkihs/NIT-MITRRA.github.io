/**
 * NIT-MITRRA - Hostel & Mess Filter, Sort & Google Form Submission Controller
 */

document.addEventListener('DOMContentLoaded', () => {
    const cardsContainer = document.querySelector('.hostel .row');
    if (!cardsContainer) return;

    const originalCards = Array.from(cardsContainer.querySelectorAll('.card'));
    const searchInput = document.getElementById('searchHostel');
    const searchClearBtn = document.getElementById('searchClear');
    const priceFilter = document.getElementById('filterPrice');
    const ratingFilter = document.getElementById('filterRating');
    const distanceFilter = document.getElementById('filterDistance');
    const sharingFilter = document.getElementById('filterSharing');
    const sortSelect = document.getElementById('sortHostel');
    const resetBtn = document.getElementById('resetFilters');
    const resetBtnEmpty = document.getElementById('resetFiltersEmpty');
    const countBadge = document.getElementById('visibleCount');
    const totalBadge = document.getElementById('totalCount');
    const noResultsBox = document.getElementById('noResultsBox');

    // Modal elements
    const openModalBtn = document.getElementById('openAddHostelModal');
    const modalBackdrop = document.getElementById('addHostelModal');
    const closeModalBtn = document.getElementById('closeAddHostelModal');

    // Set initial total count
    if (totalBadge) totalBadge.textContent = originalCards.length;
    if (countBadge) countBadge.textContent = originalCards.length;

    // Attach original index for default sorting
    originalCards.forEach((card, index) => {
        card.dataset.originalIndex = index;
    });

    /**
     * Parse numeric values safely
     */
    function parseCardData(card) {
        const name = (card.dataset.name || card.querySelector('h4')?.textContent || '').toLowerCase().trim();
        const location = (card.dataset.location || '').toLowerCase().trim();
        const price = parseFloat(card.dataset.price) || 0;
        const rating = parseFloat(card.dataset.rating) || 0;
        const distance = parseFloat(card.dataset.distance) || 999;
        const sharing = (card.dataset.sharing || '').toLowerCase().trim();
        const allText = card.textContent.toLowerCase();

        return { card, name, location, price, rating, distance, sharing, allText, originalIndex: parseInt(card.dataset.originalIndex, 10) };
    }

    /**
     * Apply all active filters and sort
     */
    function applyFilterAndSort() {
        const query = (searchInput?.value || '').toLowerCase().trim();
        const priceVal = priceFilter?.value || 'all';
        const ratingVal = ratingFilter?.value || 'all';
        const distanceVal = distanceFilter?.value || 'all';
        const sharingVal = sharingFilter?.value || 'all';
        const sortVal = sortSelect?.value || 'default';

        // Toggle clear search button
        if (searchClearBtn) {
            searchClearBtn.style.display = query ? 'block' : 'none';
        }

        let parsedList = originalCards.map(parseCardData);

        // 1. FILTERING
        let filtered = parsedList.filter(item => {
            // Text Search
            if (query && !item.allText.includes(query) && !item.name.includes(query) && !item.location.includes(query)) {
                return false;
            }

            // Price filter
            if (priceVal !== 'all') {
                if (priceVal === 'under-3000' && (item.price > 3000 || item.price === 0)) return false;
                if (priceVal === '3000-5000' && (item.price < 3000 || item.price > 5000)) return false;
                if (priceVal === 'above-5000' && item.price < 5000) return false;
            }

            // Rating filter
            if (ratingVal !== 'all') {
                const minRating = parseFloat(ratingVal);
                if (item.rating < minRating) return false;
            }

            // Distance filter (Hostels)
            if (distanceVal !== 'all' && item.distance !== 999) {
                if (distanceVal === 'under-500m' && item.distance > 0.5) return false;
                if (distanceVal === 'under-1km' && item.distance > 1.0) return false;
                if (distanceVal === 'under-2km' && item.distance > 2.0) return false;
                if (distanceVal === 'above-2km' && item.distance <= 2.0) return false;
            }

            // Sharing filter (Hostels)
            if (sharingVal !== 'all' && item.sharing) {
                if (!item.sharing.includes(sharingVal)) return false;
            }

            return true;
        });

        // 2. SORTING
        filtered.sort((a, b) => {
            switch (sortVal) {
                case 'rating-desc':
                    return b.rating - a.rating;
                case 'price-asc':
                    return (a.price || 99999) - (b.price || 99999);
                case 'price-desc':
                    return b.price - a.price;
                case 'distance-asc':
                    return a.distance - b.distance;
                case 'name-asc':
                    return a.name.localeCompare(b.name);
                default:
                    return a.originalIndex - b.originalIndex;
            }
        });

        // 3. RENDER / REORDER DOM
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

        // Update Counter & Container States
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
     * Reset all filters
     */
    function resetAllFilters() {
        if (searchInput) searchInput.value = '';
        if (priceFilter) priceFilter.value = 'all';
        if (ratingFilter) ratingFilter.value = 'all';
        if (distanceFilter) distanceFilter.value = 'all';
        if (sharingFilter) sharingFilter.value = 'all';
        if (sortSelect) sortSelect.value = 'default';
        applyFilterAndSort();
    }

    // Attach listeners to filter inputs
    searchInput?.addEventListener('input', applyFilterAndSort);
    searchClearBtn?.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        applyFilterAndSort();
    });
    priceFilter?.addEventListener('change', applyFilterAndSort);
    ratingFilter?.addEventListener('change', applyFilterAndSort);
    distanceFilter?.addEventListener('change', applyFilterAndSort);
    sharingFilter?.addEventListener('change', applyFilterAndSort);
    sortSelect?.addEventListener('change', applyFilterAndSort);
    resetBtn?.addEventListener('click', resetAllFilters);
    resetBtnEmpty?.addEventListener('click', resetAllFilters);

    // GOOGLE FORM MODAL CONTROLS

    function openModal() {
        if (modalBackdrop) {
            modalBackdrop.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal() {
        if (modalBackdrop) {
            modalBackdrop.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    openModalBtn?.addEventListener('click', openModal);
    closeModalBtn?.addEventListener('click', closeModal);

    modalBackdrop?.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalBackdrop?.classList.contains('active')) {
            closeModal();
        }
    });

    // Run initial filter/sort pass
    applyFilterAndSort();
});

