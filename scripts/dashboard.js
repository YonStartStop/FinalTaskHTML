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

        // Optimize mobile UX/accessibility: Close menu instantly on Escape key press
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                toggleMenu(false);
            }
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
            const coverImageElement = book.querySelector('.cover-image-real');
            const fallbackElement = book.querySelector('.cover-content-fallback');
            const coverImageUrl = book.getAttribute('data-cover-img');

            if (coverImageElement) {
                coverImageElement.onerror = () => {
                    coverImageElement.style.display = 'none';
                    if (fallbackElement) fallbackElement.style.display = 'flex';
                };

                if (coverImageUrl && coverImageUrl.trim() !== '') {
                    coverImageElement.src = coverImageUrl;
                    coverImageElement.style.display = 'block';
                    if (fallbackElement) fallbackElement.style.display = 'none';
                } else {
                    coverImageElement.style.display = 'none';
                    if (fallbackElement) fallbackElement.style.display = 'flex';
                }
            }
        });

        // Click listeners on bookshelf books
        bookshelfBooks.forEach(book => {
            book.addEventListener('click', () => {
                if (book.classList.contains('active')) return;

                // 1. Toggle active state
                bookshelfBooks.forEach(otherBook => otherBook.classList.remove('active'));
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
                            { element: detailsBtn1, prefix: 'btn1' },
                            { element: detailsBtn2, prefix: 'btn2' },
                            { element: detailsBtn3, prefix: 'btn3' }
                        ];

                        buttons.forEach(buttonInfo => {
                            const buttonElement = buttonInfo.element;
                            if (!buttonElement) return;

                            const buttonUrl = book.getAttribute(`data-${buttonInfo.prefix}-url`);
                            if (buttonUrl && buttonUrl.trim() !== '') {
                                buttonElement.style.display = 'block';
                                buttonElement.href = buttonUrl;

                                const buttonLabel = book.getAttribute(`data-${buttonInfo.prefix}-label`) || '';
                                const buttonPriceValue = book.getAttribute(`data-${buttonInfo.prefix}-price`) || '';
                                const buttonBackgroundClass = book.getAttribute(`data-${buttonInfo.prefix}-class`) || '';

                                const priceElement = buttonElement.querySelector('.buy-button-price');
                                const labelElement = buttonElement.querySelector('.buy-button-label');

                                if (priceElement) {
                                    if (buttonPriceValue && buttonPriceValue.trim() !== '' && buttonPriceValue !== 'אין מחיר' && buttonPriceValue !== 'אין מחיר כרגע') {
                                        priceElement.style.display = 'block';
                                        priceElement.textContent = buttonPriceValue;
                                        if (buttonPriceValue.length > 5) {
                                            priceElement.style.fontSize = '13px';
                                            priceElement.style.top = '4px';
                                        } else {
                                            priceElement.style.fontSize = '';
                                            priceElement.style.top = '';
                                        }
                                        if (labelElement) labelElement.style.top = '24px';
                                    } else {
                                        priceElement.style.display = 'none';
                                        if (labelElement) labelElement.style.top = '15px';
                                    }
                                }

                                if (labelElement) {
                                    labelElement.textContent = buttonLabel;
                                }

                                // Remove any existing bg- classes and add the correct one
                                buttonElement.className.split(' ').forEach(className => {
                                    if (className.startsWith('bg-')) {
                                        buttonElement.classList.remove(className);
                                    }
                                });
                                if (buttonBackgroundClass) {
                                    buttonElement.classList.add(buttonBackgroundClass);
                                }
                            } else {
                                buttonElement.style.display = 'none';
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

            // Keyboard interaction support (Space/Enter)
            book.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    book.click();
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
    // COMMON SMOOTH SCROLL HELPER
    // ==========================================
    const easeInOutSine = (scrollProgress) => -(Math.cos(Math.PI * scrollProgress) - 1) / 2;

    window.smoothScrollTo = (targetPosition, duration = 700, onComplete) => {
        const startPosition = window.scrollY || window.pageYOffset || 0;
        const distance = targetPosition - startPosition;
        let startTimestamp = null;

        document.documentElement.style.scrollBehavior = 'auto';

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const elapsed = timestamp - startTimestamp;
            const currentProgress = Math.min(elapsed / duration, 1);
            const easeProgress = easeInOutSine(currentProgress);

            window.scrollTo(0, startPosition + distance * easeProgress);

            if (currentProgress < 1) {
                window.requestAnimationFrame(step);
            } else {
                document.documentElement.style.scrollBehavior = '';
                if (onComplete) onComplete();
            }
        };
        window.requestAnimationFrame(step);
    };

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
                window.smoothScrollTo(offsetPosition, 700);
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
                    const targetPosition = elementPosition - offset;

                    window.smoothScrollTo(targetPosition, 700, () => {
                        history.pushState(null, null, '#lego-principles');
                        updateActiveNav();
                    });
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
                window.smoothScrollTo(0, 700, () => {
                    if (window.location.hash) {
                        history.replaceState(null, document.title, window.location.pathname + window.location.search);
                    }
                });
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
                const targetPosition = elementPosition - offset;

                window.smoothScrollTo(targetPosition, 700, () => {
                    history.pushState(null, null, targetId);
                    updateActiveNav();
                });
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
            desc: 'כשילד שואל שאלה מפתיעה התגובה הראשונה שלנו היא לעיתים בהלה. עצרו רגע.<br>נשימה עמוקה משדרת לילד שהנושא בטוח לדיון ושאתם רגועים.'
        },
        '2': {
            title: 'שיקוף והבהרה:',
            desc: 'לפני שעונים, חשוב להבין מה עומד מאחורי השאלה. לעיתים הילד ראה משהו בטלוויזיה, שמע משהו בגן/בביה"ס, או סתם חווה פחד פנימי.<br>לדוגמה: "שאלה מעניינת. מה גרם לך לחשוב על זה דווקא עכשיו?"'
        },
        '3': {
            title: 'דיוק התשובה:',
            desc: 'אל תתנו הרצאה. תנו תשובה פשוטה, אמיתית, ומותאמת לגיל<br>(עוד בנושא, עבור לסקשן <a href="layers.html#layers-intro-section" class="lego-text-link">חוק 3 השכבות</a>).'
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
                const selectedBrickData = legoData[brickId];

                if (brick.classList.contains('active')) return;

                // 1. Update brick active classes
                legoBricks.forEach(otherBrick => otherBrick.classList.remove('active'));
                brick.classList.add('active');

                // 2. Update tower and section active states (for spacing and header color transitions)
                for (let brickIndex = 1; brickIndex <= 4; brickIndex++) {
                    legoTower.classList.remove(`active-${brickIndex}`);
                    if (legoSection) legoSection.classList.remove(`active-${brickIndex}`);
                }
                legoTower.classList.add(`active-${brickId}`);
                if (legoSection) legoSection.classList.add(`active-${brickId}`);

                // 3. Fade out text, update contents, and fade in
                legoTextContainer.style.opacity = '0';
                legoTextContainer.style.transform = 'translateY(8px)';

                setTimeout(() => {
                    if (legoTextTitle) legoTextTitle.innerHTML = selectedBrickData.title;
                    if (legoTextDesc) legoTextDesc.innerHTML = selectedBrickData.desc;

                    legoTextContainer.style.opacity = '1';
                    legoTextContainer.style.transform = 'translateY(0)';
                }, 250);
            });
        });
    }

    // ==========================================
    // ABOUT PAGE ACCORDION LOGIC
    // ==========================================
    const accordionHeaders = document.querySelectorAll('.about-accordion .accordion-header');

    if (accordionHeaders.length > 0) {
        accordionHeaders.forEach(accordionHeader => {
            accordionHeader.addEventListener('click', () => {
                const accordionItem = accordionHeader.closest('.accordion-item');
                const accordionContent = accordionItem.querySelector('.accordion-content');
                const isExpanded = accordionHeader.getAttribute('aria-expanded') === 'true';

                // Close other accordion items
                accordionHeaders.forEach(otherAccordionHeader => {
                    if (otherAccordionHeader !== accordionHeader) {
                        const otherAccordionItem = otherAccordionHeader.closest('.accordion-item');
                        const otherAccordionContent = otherAccordionItem.querySelector('.accordion-content');
                        otherAccordionItem.classList.remove('active');
                        otherAccordionHeader.setAttribute('aria-expanded', 'false');
                        otherAccordionContent.style.maxHeight = '0';
                    }
                });

                // Toggle the clicked one
                if (isExpanded) {
                    accordionItem.classList.remove('active');
                    accordionHeader.setAttribute('aria-expanded', 'false');
                    accordionContent.style.maxHeight = '0';
                } else {
                    accordionItem.classList.add('active');
                    accordionHeader.setAttribute('aria-expanded', 'true');
                    accordionContent.style.maxHeight = accordionContent.scrollHeight + 'px';
                }
            });
        });

        // Recalculate max-height on window resize for active items
        window.addEventListener('resize', () => {
            accordionHeaders.forEach(accordionHeader => {
                if (accordionHeader.getAttribute('aria-expanded') === 'true') {
                    const accordionItem = accordionHeader.closest('.accordion-item');
                    const accordionContent = accordionItem.querySelector('.accordion-content');
                    accordionContent.style.maxHeight = accordionContent.scrollHeight + 'px';
                }
            });
        });
    }
});
