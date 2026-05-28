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
    const detailsBtn1 = document.getElementById('details-btn-1');
    const detailsBtn2 = document.getElementById('details-btn-2');
    const detailsBtn3 = document.getElementById('details-btn-3');
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
                        
                        const buttons = [
                            { el: detailsBtn1, prefix: 'btn1' },
                            { el: detailsBtn2, prefix: 'btn2' },
                            { el: detailsBtn3, prefix: 'btn3' }
                        ];

                        buttons.forEach(btnInfo => {
                            const btn = btnInfo.el;
                            if (!btn) return;

                            const url = book.getAttribute(`data-${btnInfo.prefix}-url`);
                            if (url && url.trim() !== '') {
                                btn.style.display = 'block';
                                btn.href = url;

                                const label = book.getAttribute(`data-${btnInfo.prefix}-label`) || '';
                                const priceVal = book.getAttribute(`data-${btnInfo.prefix}-price`) || '';
                                const bgClass = book.getAttribute(`data-${btnInfo.prefix}-class`) || '';

                                const priceEl = btn.querySelector('.buy-button-price');
                                const labelEl = btn.querySelector('.buy-button-label');

                                if (priceEl) {
                                    if (priceVal && priceVal.trim() !== '' && priceVal !== 'אין מחיר' && priceVal !== 'אין מחיר כרגע') {
                                        priceEl.style.display = 'block';
                                        priceEl.textContent = priceVal;
                                        if (priceVal.length > 5) {
                                            priceEl.style.fontSize = '13px';
                                            priceEl.style.top = '4px';
                                        } else {
                                            priceEl.style.fontSize = '';
                                            priceEl.style.top = '';
                                        }
                                        if (labelEl) labelEl.style.top = '24px';
                                    } else {
                                        priceEl.style.display = 'none';
                                        if (labelEl) labelEl.style.top = '15px';
                                    }
                                }

                                if (labelEl) {
                                    labelEl.textContent = label;
                                }

                                // Remove any existing bg- classes and add the correct one
                                btn.className.split(' ').forEach(className => {
                                    if (className.startsWith('bg-')) {
                                        btn.classList.remove(className);
                                    }
                                });
                                if (bgClass) {
                                    btn.classList.add(bgClass);
                                }
                            } else {
                                btn.style.display = 'none';
                            }
                        });

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

    // ==========================================
    // RELOAD & HASH SCROLL MANAGEMENT
    // ==========================================
    const isReload = (performance.getEntriesByType && performance.getEntriesByType('navigation')[0] && performance.getEntriesByType('navigation')[0].type === 'reload') || (performance.navigation && performance.navigation.type === 1);
    
    if (isReload) {
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
        window.scrollTo(0, 0);
        if (window.location.hash) {
            history.replaceState(null, document.title, window.location.pathname + window.location.search);
        }
    } else if (window.location.hash === '#lego-principles') {
        const targetElement = document.getElementById('lego-principles');
        if (targetElement) {
            // Smoothly scroll to the principles section after a short delay to allow page layout to settle
            setTimeout(() => {
                const offset = 130; // accounts for the sticky header
                const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = elementPosition - offset;
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }, 100);
        }
    }

    // ==========================================
    // GOLDEN PRINCIPLES NAV CLICK HANDLING (SMOOTH SCROLL TO TOP ON HOMEPAGE)
    // ==========================================
    const goldenPrinciplesLinks = document.querySelectorAll('.nav-link[data-page="home"], .menu-link[data-page="home"]');
    goldenPrinciplesLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const isHomePage = !!document.getElementById('lego-principles');
            if (isHomePage) {
                e.preventDefault();
                
                // Close mobile navigation drawer if active
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }

                const targetElement = document.getElementById('lego-principles');
                if (targetElement) {
                    const offset = 130; // accounts for the sticky header
                    const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                    const offsetPosition = elementPosition - offset;
                    
                    const startPosition = window.scrollY;
                    const distance = offsetPosition - startPosition;
                    const duration = 700; // 0.7s maximum duration
                    let startTimestamp = null;
                    
                    document.documentElement.style.scrollBehavior = 'auto';
                    
                    const easeInOutSine = (t) => {
                        return -(Math.cos(Math.PI * t) - 1) / 2;
                    };
                    
                    const step = (timestamp) => {
                        if (!startTimestamp) startTimestamp = timestamp;
                        const elapsed = timestamp - startTimestamp;
                        const progress = Math.min(elapsed / duration, 1);
                        const easeProgress = easeInOutSine(progress);
                        
                        window.scrollTo(0, startPosition + distance * easeProgress);
                        
                        if (progress < 1) {
                            window.requestAnimationFrame(step);
                        } else {
                            document.documentElement.style.scrollBehavior = '';
                            history.pushState(null, null, '#lego-principles');
                            updateActiveNav();
                        }
                    };
                    window.requestAnimationFrame(step);
                }
            }
        });
    });

    // ==========================================
    // LOGO CLICK SMOOTH SCROLL TO TOP ON HOMEPAGE
    // ==========================================
    const logoLink = document.querySelector('.logo-area');
    if (logoLink) {
        logoLink.addEventListener('click', (e) => {
            const isHomePage = !!document.getElementById('lego-principles');
            if (isHomePage) {
                e.preventDefault();
                
                const startPosition = window.scrollY;
                const distance = -startPosition;
                const duration = 700; // 0.7s maximum duration
                let startTimestamp = null;
                
                document.documentElement.style.scrollBehavior = 'auto';
                
                const easeInOutSine = (t) => {
                    return -(Math.cos(Math.PI * t) - 1) / 2;
                };
                
                const step = (timestamp) => {
                    if (!startTimestamp) startTimestamp = timestamp;
                    const elapsed = timestamp - startTimestamp;
                    const progress = Math.min(elapsed / duration, 1);
                    const easeProgress = easeInOutSine(progress);
                    
                    window.scrollTo(0, startPosition + distance * easeProgress);
                    
                    if (progress < 1) {
                        window.requestAnimationFrame(step);
                    } else {
                        document.documentElement.style.scrollBehavior = '';
                        if (window.location.hash) {
                            history.replaceState(null, document.title, window.location.pathname + window.location.search);
                        }
                    }
                };
                window.requestAnimationFrame(step);
            }
        });
    }



    // ==========================================
    // CUSTOM GENTLE SMOOTH SCROLL FOR CTA BUTTON
    // ==========================================
    const heroCtaBtn = document.querySelector('.hero-cta-btn');
    if (heroCtaBtn) {
        heroCtaBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = heroCtaBtn.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offset = 40; // Reduced from 130 to scroll further down
                const elementPosition = targetElement.getBoundingClientRect().top + (window.scrollY || window.pageYOffset);
                const offsetPosition = elementPosition - offset;
                
                const startPosition = window.scrollY || window.pageYOffset;
                const distance = offsetPosition - startPosition;
                const duration = 700; // exactly 0.7 seconds maximum duration
                let startTimestamp = null;
                
                // Temporarily disable global CSS smooth scroll to prevent rendering conflicts and stutter
                document.documentElement.style.scrollBehavior = 'auto';
                
                // Sinusoidal ease-in-out for an extremely organic, calm acceleration and deceleration (no abrupt braking)
                const easeInOutSine = (t) => {
                    return -(Math.cos(Math.PI * t) - 1) / 2;
                };
                
                const step = (timestamp) => {
                    if (!startTimestamp) startTimestamp = timestamp;
                    const elapsed = timestamp - startTimestamp;
                    const progress = Math.min(elapsed / duration, 1);
                    const easeProgress = easeInOutSine(progress);
                    
                    window.scrollTo(0, startPosition + distance * easeProgress);
                    
                    if (progress < 1) {
                        window.requestAnimationFrame(step);
                    } else {
                        // Restore original CSS scroll behavior
                        document.documentElement.style.scrollBehavior = '';
                        
                        // After scroll completes, update location hash without triggering jump scroll
                        history.pushState(null, null, targetId);
                        updateActiveNav();
                    }
                };
                
                window.requestAnimationFrame(step);
            }
        });
    }

    // ==========================================
    // INTERACTIVE LEGO TOWER LOGIC
    // ==========================================
    const legoBricks = document.querySelectorAll('.lego-brick');
    const legoTower = document.getElementById('lego-tower');
    const legoSection = document.getElementById('lego-principles');
    const legoTextContainer = document.getElementById('lego-text-container');
    const legoTextTitle = document.getElementById('lego-text-title');
    const legoTextDesc = document.getElementById('lego-text-desc');

    const legoData = {
        '1': {
            title: 'עצירה ונשימה:',
            desc: 'כשילד שואל שאלה מפתיעה התגובה הראשונה שלנו היא לעיתים בהלה. עצרו רגע. נשימה עמוקה משדרת לילד שהנושא בטוח לדיון ושאתם רגועים.'
        },
        '2': {
            title: 'שיקוף והבהרה:',
            desc: 'לפני שעונים, חשוב להבין מה עומד מאחורי השאלה. לעיתים הילד ראה משהו בטלוויזיה, שמע משהו בגן/בביה"ס, או סתם חווה פחד פנימי. לדוגמה: "שאלה מעניינת. מה גרם לך לחשוב על זה דווקא עכשיו?"'
        },
        '3': {
            title: 'דיוק התשובה:',
            desc: 'אל תתנו הרצאה. תנו תשובה פשוטה, אמיתית, ומותאמת לגיל (עוד בנושא, עבור לסקשן <a href="layers.html#layers-intro-section" class="lego-text-link">חוק 3 השכבות</a>).'
        },
        '4': {
            title: 'בדיקת תחושת הילד:',
            desc: 'סיימו את התשובה בשאלה רגשית: "איך זה גורם לך להרגיש?" או "זה נשמע לך הגיוני?".'
        }
    };

    if (legoBricks.length > 0 && legoTower && legoTextContainer) {
        legoBricks.forEach(brick => {
            brick.addEventListener('click', () => {
                const brickId = brick.getAttribute('data-brick');
                const data = legoData[brickId];

                if (brick.classList.contains('active')) return;

                // 1. Update brick active classes
                legoBricks.forEach(b => b.classList.remove('active'));
                brick.classList.add('active');

                // 2. Update tower and section active states (for spacing and header color transitions)
                for (let i = 1; i <= 4; i++) {
                    legoTower.classList.remove(`active-${i}`);
                    if (legoSection) legoSection.classList.remove(`active-${i}`);
                }
                legoTower.classList.add(`active-${brickId}`);
                if (legoSection) legoSection.classList.add(`active-${brickId}`);

                // 3. Fade out text, update contents, and fade in
                legoTextContainer.style.opacity = '0';
                legoTextContainer.style.transform = 'translateY(8px)';

                setTimeout(() => {
                    if (legoTextTitle) legoTextTitle.innerHTML = data.title;
                    if (legoTextDesc) legoTextDesc.innerHTML = data.desc;

                    legoTextContainer.style.opacity = '1';
                    legoTextContainer.style.transform = 'translateY(0)';
                }, 250);
            });
        });
    }
});
