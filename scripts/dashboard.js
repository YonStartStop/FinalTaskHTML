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
    // BOOK RECOMMENDATIONS BOOKSHELF INTERACTIVITY (FLYING BOOKS)
    // ==========================================
    const bookshelfBooks = document.querySelectorAll('.bookshelf-book');
    const showcaseSpot = document.getElementById('showcase-spot');

    const detailsTitle = document.getElementById('details-title');
    const detailsAuthor = document.getElementById('details-author');
    const detailsSummary = document.getElementById('details-summary');
    const detailsWhyText = document.getElementById('details-why-text');
    const detailsWhyContainer = document.getElementById('details-why-container');
    const detailsAmazonLink = document.getElementById('details-amazon-link');
    const detailsSteimatzkyLink = document.getElementById('details-steimatzky-link');
    const detailsTzometLink = document.getElementById('details-tzomet-link');
    const detailsTextBox = document.getElementById('details-text-box');
    const detailsWrapper = document.querySelector('.details-content-wrapper');

    // Function to calculate and apply translate transform to center the active book
    const positionActiveBook = (immediate = false) => {
        const activeBook = document.querySelector('.bookshelf-book.active');
        if (!activeBook || !showcaseSpot) return;

        bookshelfBooks.forEach(book => {
            if (book !== activeBook) {
                book.style.transform = '';
            }
        });

        if (immediate) {
            activeBook.style.transition = 'none';
        }

        // 1. Temporarily clear transform to get clean slot position
        activeBook.style.transform = '';

        // 2. Measure bounding rects
        const bookRect = activeBook.getBoundingClientRect();
        const spotRect = showcaseSpot.getBoundingClientRect();

        // 3. Center alignment math
        const bookCenterX = bookRect.left + bookRect.width / 2;
        const bookCenterY = bookRect.top + bookRect.height / 2;
        const spotCenterX = spotRect.left + spotRect.width / 2;
        const spotCenterY = spotRect.top + spotRect.height / 2;

        const deltaX = spotCenterX - bookCenterX;
        const deltaY = spotCenterY - bookCenterY;

        // 4. Apply translate & scale (selected book is scaled by 1.15)
        activeBook.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.15)`;

        if (immediate) {
            // Restore transitions after paint
            activeBook.offsetHeight; // force reflow
            activeBook.style.transition = '';
        }
    };

    if (bookshelfBooks.length > 0 && showcaseSpot) {
        // Setup image fallbacks and initial cover image sources for each book
        bookshelfBooks.forEach(book => {
            const img = book.querySelector('.cover-image-real');
            const fallback = book.querySelector('.cover-content-fallback');
            const coverImgUrl = book.getAttribute('data-cover-img');

            if (img) {
                img.onerror = () => {
                    img.style.display = 'none';
                    if (fallback) fallback.style.display = 'flex';
                };

                if (coverImgUrl && coverImgUrl.trim() !== '') {
                    img.src = coverImgUrl;
                    img.style.display = 'block';
                    if (fallback) fallback.style.display = 'none';
                } else {
                    img.style.display = 'none';
                    if (fallback) fallback.style.display = 'flex';
                }
            }
        });

        // Click listeners on bookshelf books
        bookshelfBooks.forEach(book => {
            book.addEventListener('click', () => {
                if (book.classList.contains('active')) return;

                // 1. Toggle active state
                bookshelfBooks.forEach(b => b.classList.remove('active'));
                book.classList.add('active');

                // 2. Calculate and trigger flying translate
                positionActiveBook();

                // 3. Read attributes and update details panel
                const title = book.getAttribute('data-title');
                const author = book.getAttribute('data-author');
                const summary = book.getAttribute('data-summary');
                const why = book.getAttribute('data-why');
                const amazonUrl = book.getAttribute('data-amazon-url');
                const steimatzkyUrl = book.getAttribute('data-steimatzky-url');
                const tzometUrl = book.getAttribute('data-tzomet-url');
                const price = book.getAttribute('data-price') || '59.90₪';
                const accentColor = book.getAttribute('data-accent-color');

                if (detailsWrapper) {
                    detailsWrapper.style.opacity = '0';
                    detailsWrapper.style.transform = 'translateY(10px)';
                    detailsWrapper.style.transition = 'opacity 0.25s ease, transform 0.25s ease';

                    setTimeout(() => {
                        if (detailsTitle) detailsTitle.textContent = title;
                        if (detailsAuthor) detailsAuthor.textContent = author;
                        if (detailsSummary) detailsSummary.textContent = summary;
                        if (detailsWhyText) detailsWhyText.textContent = why;
                        
                        if (detailsAmazonLink) detailsAmazonLink.href = amazonUrl;
                        if (detailsSteimatzkyLink) detailsSteimatzkyLink.href = steimatzkyUrl;
                        if (detailsTzometLink) detailsTzometLink.href = tzometUrl;

                        // Update price text inside buy buttons
                        const amazonPriceEl = detailsAmazonLink ? detailsAmazonLink.querySelector('.buy-button-price') : null;
                        const steimatzkyPriceEl = detailsSteimatzkyLink ? detailsSteimatzkyLink.querySelector('.buy-button-price') : null;
                        const tzometPriceEl = detailsTzometLink ? detailsTzometLink.querySelector('.buy-button-price') : null;

                        if (amazonPriceEl) amazonPriceEl.textContent = price;
                        if (steimatzkyPriceEl) steimatzkyPriceEl.textContent = price;
                        if (tzometPriceEl) tzometPriceEl.textContent = price;

                        if (detailsTextBox) {
                            detailsTextBox.style.borderRightColor = accentColor;
                        }
                        if (detailsWhyContainer) {
                            detailsWhyContainer.style.borderRightColor = accentColor;
                        }

                        detailsWrapper.style.opacity = '1';
                        detailsWrapper.style.transform = 'translateY(0)';
                    }, 250);
                }
            });
        });

        // Initial setup on load (Book 1 is already marked active, make it fly to center)
        setTimeout(() => {
            positionActiveBook(true);
        }, 150);

        // Keep active book centered on resize
        window.addEventListener('resize', () => {
            positionActiveBook(true);
        });
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
