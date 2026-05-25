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
    // BOOK RECOMMENDATIONS BOOKSHELF INTERACTIVITY
    // ==========================================
    const spineWrappers = document.querySelectorAll('.spine-wrapper');
    const showcaseBook = document.getElementById('showcase-book');
    const showcaseFallback = document.getElementById('showcase-fallback');
    const showcaseEmoji = document.getElementById('showcase-emoji');
    const showcaseCoverTitle = document.getElementById('showcase-cover-title');
    const showcaseCoverAuthor = document.getElementById('showcase-cover-author');
    const showcaseImg = document.getElementById('showcase-img');

    const detailsTitle = document.getElementById('details-title');
    const detailsAuthor = document.getElementById('details-author');
    const detailsSummary = document.getElementById('details-summary');
    const detailsWhyText = document.getElementById('details-why-text');
    const detailsWhyContainer = document.getElementById('details-why-container');
    const detailsBuyLink = document.getElementById('details-buy-link');
    const detailsWrapper = document.querySelector('.details-content-wrapper');

    if (spineWrappers.length > 0 && showcaseBook) {
        // Image error fallback
        if (showcaseImg) {
            showcaseImg.onerror = () => {
                showcaseImg.style.display = 'none';
                if (showcaseFallback) showcaseFallback.style.display = 'flex';
            };
        }

        spineWrappers.forEach(spine => {
            spine.addEventListener('click', () => {
                if (spine.classList.contains('active')) return;

                // 1. Toggle active states on spines
                spineWrappers.forEach(sw => sw.classList.remove('active'));
                spine.classList.add('active');

                // 2. Read attributes
                const title = spine.getAttribute('data-title');
                const author = spine.getAttribute('data-author');
                const summary = spine.getAttribute('data-summary');
                const why = spine.getAttribute('data-why');
                const buyUrl = spine.getAttribute('data-buy-url');
                const emoji = spine.getAttribute('data-emoji');
                const coverImg = spine.getAttribute('data-cover-img');
                const themeColor = spine.getAttribute('data-theme-color');
                const accentColor = spine.getAttribute('data-accent-color');

                // 3. Animate book showcase (3D flip effect)
                showcaseBook.style.transform = 'rotateY(90deg) scale(0.9)';

                setTimeout(() => {
                    // Update showcase cover styling & content
                    showcaseBook.style.background = themeColor;
                    if (showcaseEmoji) showcaseEmoji.textContent = emoji;
                    if (showcaseCoverTitle) showcaseCoverTitle.textContent = title;
                    
                    // Simple regex/cleanup to extract author name without "מאת:" for the cover
                    if (showcaseCoverAuthor) {
                        showcaseCoverAuthor.textContent = author.replace('מאת:', '').trim();
                    }

                    if (coverImg && coverImg.trim() !== '') {
                        if (showcaseImg) {
                            showcaseImg.src = coverImg;
                            showcaseImg.style.display = 'block';
                        }
                        if (showcaseFallback) showcaseFallback.style.display = 'none';
                    } else {
                        if (showcaseImg) {
                            showcaseImg.src = '';
                            showcaseImg.style.display = 'none';
                        }
                        if (showcaseFallback) showcaseFallback.style.display = 'flex';
                    }

                    // Rotate showcase back
                    showcaseBook.style.transform = '';
                }, 300);

                // 4. Animate & update book details panel
                if (detailsWrapper) {
                    detailsWrapper.style.opacity = '0';
                    detailsWrapper.style.transform = 'translateY(10px)';
                    detailsWrapper.style.transition = 'opacity 0.25s ease, transform 0.25s ease';

                    setTimeout(() => {
                        if (detailsTitle) detailsTitle.textContent = title;
                        if (detailsAuthor) detailsAuthor.textContent = author;
                        if (detailsSummary) detailsSummary.textContent = summary;
                        if (detailsWhyText) detailsWhyText.textContent = why;
                        if (detailsBuyLink) detailsBuyLink.href = buyUrl;

                        if (detailsWhyContainer) {
                            detailsWhyContainer.style.borderRightColor = accentColor;
                        }

                        detailsWrapper.style.opacity = '1';
                        detailsWrapper.style.transform = 'translateY(0)';
                    }, 250);
                }
            });
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
