document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // MOBILE NAVIGATION DRAWER
    // ==========================================
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const menuOverlays = document.querySelectorAll('.mobile-menu-overlay, .menu-link');

    if (hamburgerBtn && mobileMenu) {
        const toggleMenu = (open) => {
            if (open) {
                mobileMenu.classList.add('active');
                document.body.style.overflow = 'hidden';
            } else {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        };

        hamburgerBtn.addEventListener('click', () => toggleMenu(true));
        if (closeMenuBtn) {
            closeMenuBtn.addEventListener('click', () => toggleMenu(false));
        }

        menuOverlays.forEach(overlay => {
            overlay.addEventListener('click', () => toggleMenu(false));
        });
    }

    // ==========================================
    // DASHBOARD SEARCH & FILTER LOGIC
    // ==========================================
    const searchInput = document.getElementById('search-input');
    const categoryPills = document.querySelectorAll('.filter-pill');
    const cards = document.querySelectorAll('.dashboard-card');

    if (cards.length > 0) {
        let activeCategory = 'all';
        let searchQuery = '';

        const filterCards = () => {
            cards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                const cardText = card.textContent.toLowerCase();
                
                const matchesCategory = (activeCategory === 'all' || cardCategory === activeCategory);
                const matchesSearch = cardText.includes(searchQuery.toLowerCase());

                if (matchesCategory && matchesSearch) {
                    card.style.display = 'block';
                    // Trigger tiny delay for fade-in transition
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                    }, 20);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px) scale(0.95)';
                    // Hide completely after transition finishes (300ms)
                    setTimeout(() => {
                        if (card.style.opacity === '0') {
                            card.style.display = 'none';
                        }
                    }, 300);
                }
            });
        };

        // Search Input Listener
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                searchQuery = e.target.value;
                filterCards();
            });
        }

        // Category Pills Listener
        categoryPills.forEach(pill => {
            pill.addEventListener('click', () => {
                categoryPills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                activeCategory = pill.getAttribute('data-filter');
                filterCards();
            });
        });

        // Initialize cards with opacity & transitions
        cards.forEach(card => {
            card.style.transition = 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
        });
    }
});
