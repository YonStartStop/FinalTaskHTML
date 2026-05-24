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
    // INTERACTIVE 3-LAYERS EXPLORER LOGIC
    // ==========================================
    const layerItems = document.querySelectorAll('.layer-item');
    const displayTitle = document.getElementById('layer-display-title');
    const displayIntro = document.getElementById('layer-display-intro');
    const displayGoal = document.getElementById('layer-display-goal');
    const displayRule = document.getElementById('layer-display-rule');
    const displayExample = document.getElementById('layer-display-example');
    const contentPanel = document.getElementById('layer-content-panel');

    const layersData = {
        '1': {
            title: 'שכבה 1: העובדה היבשה (התשובה ל"מה קרה?")',
            intro: 'זו השכבה הבסיסית ביותר – כאן אתם מספקים את המידע המדויק ביותר, ללא פרשנות אישית, ללא דרמה ובשפה פשוטה.',
            goal: 'לענות על הסקרנות האינטלקטואלית הישירה של הילד.',
            rule: 'אם הילד מפסיק לשאול או חוזר לעיסוקיו - עצרתם בזמן! זה אומר שהשכבה הזו סיפקה אותו לחלוטין כרגע.',
            example: '"אמא ואבא החליטו שיהיה לנו יותר נעים וטוב לחיות בשני בתים נפרדים."'
        },
        '2': {
            title: 'שכבה 2: הרגש והנורמליזציה (התשובה ל"איך מרגישים?")',
            intro: 'כאן אתם מעניקים לגיטימציה מלאה לרגשות. אתם לא רק עונים על "מה קרה", אלא מסבירים את התחושות סביב זה ומנרמלים אותן.',
            goal: 'לבנות אינטימיות ולקשר את המידע לחוויה אנושית מקרבת.',
            rule: 'השתמשו תמיד במשפטי "אני" ו"אנחנו" כדי שהילד לא ירגיש לבד במערכה.',
            example: '"זה שינוי גדול, ולפעמים זה מעציב או מבלבל גם אותנו וגם אותך. זה טבעי לגמרי להרגיש ככה."'
        },
        '3': {
            title: 'שכבה 3: העוגן והביטחון (התשובה ל"מה איתי?")',
            intro: 'זו השכבה החשובה ביותר, הנועד להרגיע את החרדה הקיומית של הילד. בכל שאלה קשה, הילד שואל בתת-מודע: "האם אני בטוח ומוגן?". כאן אנו עונים על זה במפורש.',
            goal: 'לספק יציבות אבסולוטית ולהזכיר לילד שהקשר ביניכם לא השתנה ולא ישתנה.',
            rule: 'הבטחה לביטחון וליציבות נוכחית ועתידית בשגרה שלו.',
            example: '"למרות שאנחנו גרים בבתים נפרדים, אנחנו עדיין משפחה אחת גדולה, ושנינו אוהבים אותך באותה מידה ונדאג לכל מה שאתה צריך תמיד."'
        }
    };

    if (layerItems.length > 0 && displayTitle) {
        layerItems.forEach(item => {
            item.addEventListener('click', () => {
                // Active classes toggling
                layerItems.forEach(li => li.classList.remove('active'));
                item.classList.add('active');

                const layerId = item.getAttribute('data-layer');
                const data = layersData[layerId];

                if (data) {
                    // Temporarily remove and trigger reflow for panel animation
                    if (contentPanel) {
                        contentPanel.style.animation = 'none';
                        contentPanel.offsetHeight; // Reflow
                        contentPanel.style.animation = '';
                    }

                    // Update contents
                    displayTitle.textContent = data.title;
                    displayIntro.textContent = data.intro;
                    displayGoal.textContent = data.goal;
                    displayRule.textContent = data.rule;
                    displayExample.textContent = data.example;
                }
            });
        });
    }

    // ==========================================
    // BOOK RECOMMENDATIONS CAROUSEL LOGIC
    // ==========================================
    const carouselViewport = document.getElementById('books-carousel-viewport');
    const carouselPrev = document.getElementById('carousel-prev');
    const carouselNext = document.getElementById('carousel-next');
    const scrollAmount = 470; // Width of card (440px) + gap (30px)

    if (carouselViewport && carouselPrev && carouselNext) {
        // Next button (in RTL, points left, scrolls negative left direction)
        carouselNext.addEventListener('click', () => {
            carouselViewport.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });

        // Prev button (in RTL, points right, scrolls positive right direction)
        carouselPrev.addEventListener('click', () => {
            carouselViewport.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });

        // Update button disabled/enabled states based on current scroll position
        const updateCarouselButtons = () => {
            // Native scrollLeft in RTL is usually negative, take absolute value
            const scrollLeft = Math.abs(carouselViewport.scrollLeft);
            const maxScroll = carouselViewport.scrollWidth - carouselViewport.clientWidth;

            // Simple checks with small tolerance
            carouselPrev.disabled = scrollLeft <= 15;
            carouselNext.disabled = scrollLeft >= maxScroll - 15;
        };

        // Scroll listener for dynamic buttons
        carouselViewport.addEventListener('scroll', updateCarouselButtons);
        window.addEventListener('resize', updateCarouselButtons);
        
        // Initial delay setup to allow fonts/layout to settle
        setTimeout(updateCarouselButtons, 300);
    }

    // ==========================================
    // MULTI-PAGE ACTIVE NAV HIGHLIGHTING LOGIC
    // ==========================================
    const navLinks = document.querySelectorAll('.nav-link');
    const menuLinks = document.querySelectorAll('.menu-link');

    const updateActiveNav = () => {
        const path = window.location.pathname;
        
        let currentPage = 'home';
        
        if (path.includes('layers.html')) {
            currentPage = 'layers';
        } else if (path.includes('tools.html')) {
            currentPage = 'tools';
        } else if (path.includes('about.html')) {
            currentPage = 'about';
        } else if (path.includes('contact.html')) {
            currentPage = 'contact';
        } else {
            currentPage = 'home';
        }

        const applyActive = (links) => {
            links.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-page') === currentPage) {
                    link.classList.add('active');
                }
            });
        };

        applyActive(navLinks);
        applyActive(menuLinks);
    };

    // Update active highlight on hash changes (e.g. clicking on anchor sub-links)
    window.addEventListener('hashchange', updateActiveNav);
    updateActiveNav();
});
