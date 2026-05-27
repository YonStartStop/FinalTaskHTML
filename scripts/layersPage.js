document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // 1. SLIDER LOGIC
    // ==========================================================================
    const sliderWrapper = document.querySelector('.slider-wrapper');
    const slides = document.querySelectorAll('.slider-slide');
    const arrowLeft = document.querySelector('.slider-arrow.arrow-left');
    const arrowRight = document.querySelector('.slider-arrow.arrow-right');
    const introCircles = document.querySelectorAll('.layers-circles-container .concentric-circle');
    const floatingCircles = document.querySelectorAll('.floating-concentric-nav .concentric-circle');
    const floatingNav = document.querySelector('.floating-concentric-nav');

    // Preview card elements
    const introPreviewCard = document.getElementById('intro-preview-card');
    const previewCardTitle = document.getElementById('preview-card-title');
    const previewCardText = document.getElementById('preview-card-text');
    const previewCardScrollBtn = document.getElementById('preview-card-scroll-btn');

    // Previews data
    const previewsData = [
        {
            title: "שכבה 1: העובדה היבשה – מענה לשאלה ״מה קרה״",
            text: "מתמקדת במתן מידע מדויק, אובייקטיבי ונקי מדרמה רגשית, המותאם לרמת ההבנה של הילד. הכלל המוביל: אם הילד קיבל את התשובה והמשיך לעיסוקיו – עצרתם בזמן ואין צורך להמשיך לשכבות הבאות.",
            bg: "var(--layer-1-color)",
            color: "var(--layer-1-text)",
            borderColor: "var(--layer-1-text)"
        },
        {
            title: "שכבה 2: הרגש והנורמליזציה – מענה לשאלה ״איך מרגישים״",
            text: "מעניקה לגיטימציה מלאה לרגשות של הילד ומספקת נורמליזציה (הבנה שזה טבעי להרגיש כך). השתמשו בה כאשר הילד נראה מוטרד, לחוץ או ממשיך לשאול שאלות המשקפות רגש.",
            bg: "var(--layer-2-color)",
            color: "var(--layer-2-text)",
            borderColor: "var(--layer-2-text)"
        },
        {
            title: "שכבה 3: העוגן והביטחון – מענה לשאלה ״מה איתי״",
            text: "שכבה קריטית להרגעת החרדה הקיומית של הילד לגבי המתרחש סביבו. היא מציעה נוכחות פיזית יציבה (״אנחנו כאן איתך״), שמירה על שגרה והבטחה לביטחון נוכחי ועתידי.",
            bg: "var(--layer-3-color)",
            color: "var(--layer-3-text)",
            borderColor: "var(--layer-3-text)"
        }
    ];

    let activeIndex = 0;
    const maxIndex = slides.length - 1;

    const updateSlider = (index) => {
        activeIndex = Math.max(0, Math.min(index, maxIndex));

        // Translate the flex wrapper (RTL logic)
        // Slide 0: 0, Slide 1: 100vw, Slide 2: 200vw
        sliderWrapper.style.transform = `translateX(${activeIndex * 100}vw)`;

        // Update aria-hidden and active class for animations
        slides.forEach((slide, idx) => {
            if (idx === activeIndex) {
                slide.removeAttribute('aria-hidden');
                slide.classList.add('active-slide');
            } else {
                slide.setAttribute('aria-hidden', 'true');
                slide.classList.remove('active-slide');
            }
        });

        // Update active class classes on floating concentric navigation
        if (floatingNav) {
            floatingNav.className = 'floating-concentric-nav'; // reset classes
            if (document.body.classList.contains('sticky-active')) {
                floatingNav.classList.add('active');
            }
            floatingNav.classList.add(`active-slide-${activeIndex}`);
        }

        // Enable/Disable navigation arrows
        if (arrowLeft) arrowLeft.disabled = (activeIndex === 0);
        if (arrowRight) arrowRight.disabled = (activeIndex === maxIndex);
        
        // Update opacity/appearance of arrows for visual feedback
        if (arrowLeft) arrowLeft.style.opacity = (activeIndex === 0) ? '0.3' : '1';
        if (arrowRight) arrowRight.style.opacity = (activeIndex === maxIndex) ? '0.3' : '1';
    };

    // Arrow controls
    if (arrowLeft) {
        arrowLeft.addEventListener('click', () => {
            if (activeIndex > 0) {
                updateSlider(activeIndex - 1);
            }
        });
    }

    if (arrowRight) {
        arrowRight.addEventListener('click', () => {
            if (activeIndex < maxIndex) {
                updateSlider(activeIndex + 1);
            }
        });
    }

    // Scroll button inside preview card
    if (previewCardScrollBtn) {
        previewCardScrollBtn.addEventListener('click', () => {
            const sliderContainer = document.getElementById('layers-slider-container');
            if (sliderContainer) {
                sliderContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }

    // Circles click controls
    const handleCircleClick = (circle, idx) => {
        // Move slider to clicked layer index (so slider matches when parent scrolls down)
        updateSlider(idx);
        
        // Show preliminary explanation in the preview card
        if (introPreviewCard && previewCardTitle && previewCardText) {
            const data = previewsData[idx];
            previewCardTitle.textContent = data.title;
            previewCardText.textContent = data.text;
            
            // Set dynamic themed styles matching the circle's layer color
            introPreviewCard.style.backgroundColor = data.bg;
            introPreviewCard.style.color = data.color;
            introPreviewCard.style.borderColor = data.borderColor;
            
            // Show card with fade-in animation
            introPreviewCard.style.display = 'block';
            introPreviewCard.classList.remove('animate');
            void introPreviewCard.offsetWidth; // trigger reflow
            introPreviewCard.classList.add('animate');
        }
    };

    introCircles.forEach((circle, idx) => {
        circle.addEventListener('click', () => {
            // Index matches: Layer 1 is 0, Layer 2 is 1, Layer 3 is 2
            handleCircleClick(circle, idx);
        });
    });

    floatingCircles.forEach((circle, idx) => {
        circle.addEventListener('click', () => {
            // Index matches: Layer 1 is 0, Layer 2 is 1, Layer 3 is 2
            updateSlider(idx);
        });
    });

    // Initialize slider state
    updateSlider(0);

    // ==========================================================================
    // 2. CONCENTRIC CIRCLES FLOATING SCROLL ANIMATION
    // ==========================================================================
    const sliderContainer = document.getElementById('layers-slider-container');
    const introCirclesWrapper = document.querySelector('.layers-circles-container .concentric-circles-wrapper');

    if (sliderContainer && introCirclesWrapper && floatingNav) {
        const observerOptions = {
            root: null,
            threshold: 0.15 // trigger when 15% of the slider is visible
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Slider is visible: trigger sticky floating circles
                    document.body.classList.add('sticky-active');
                    floatingNav.classList.add('active');
                    floatingNav.classList.add(`active-slide-${activeIndex}`);
                    introCirclesWrapper.classList.add('hidden');
                } else {
                    // Slider is NOT visible (user scrolled back up to intro or down to footer/quiz)
                    // Let's check if scroll position is above the slider to restore circles in intro
                    const rect = sliderContainer.getBoundingClientRect();
                    if (rect.top > window.innerHeight / 2) {
                        document.body.classList.remove('sticky-active');
                        floatingNav.classList.remove('active');
                        introCirclesWrapper.classList.remove('hidden');
                    } else {
                        // User scrolled down to quiz section, hide the sticky nav too
                        floatingNav.classList.remove('active');
                    }
                }
            });
        }, observerOptions);

        observer.observe(sliderContainer);
    }

    // ==========================================================================
    // 3. SUMMARY QUIZ LOGIC
    // ==========================================================================
    const quizData = [
        {
            step: 'שאלה 1 מתוך 3',
            question: 'הילד בא אליכם ושאל: ״למה סבתא בבית החולים?״',
            scenario: 'אתם רוצים להשיב לו ברוח שכבה 1 (העובדה היבשה). איזה מהמשפטים הבאים היא התגובה הנכונה?',
            options: [
                '״סבתא חולה מאוד והיא מרגישה ממש רע, אנחנו מאוד דואגים לה ומקווים שהיא תצא מזה מהר, זה ממש מלחיץ...״',
                '״סבתא לא הרגישה טוב והלכה לבית החולים כדי שהרופאים יתנו לה תרופה ויעזרו לה להבריא.״',
                '״אין לך מה לדאוג, הכל מצוין! סבתא הלכה לשם רק לעשות כמה בדיקות קטנות ושגרתיות והיא כבר חוזרת.״'
            ],
            correctIndex: 1,
            feedbackCorrect: 'תשובה מצוינת! הסברתם את המציאות בצורה פשוטה, ברורה, ללא דרמה רגשית מיותרת של מבוגרים, ומבלי לטשטש או להסתיר את המציאות העובדתית.',
            feedbackIncorrect: 'לא מדויק. תשובה א׳ עמוסה בדרמה ובחרדה אישית שלכם. תשובה ג׳ היא הכחשה וטשטוש האמת (סבתא אכן מאושפזת). התשובה הנכונה היא ב׳ המציגה את העובדה היבשה בלבד.'
        },
        {
            step: 'שאלה 2 מתוך 3',
            question: 'הילד נראה מוטרד וממשיך לשאול: ״האם סבתא תמות?״',
            scenario: 'כאן אתם מזהים שהילד זקוק למענה בשכבה 2 (הרגש והנורמליזציה). מהי התגובה הנכונה?',
            options: [
                '״אסור לדבר על מוות! סבתא תהיה בריאה ותחזור מהר הביתה, תפסיק לחשוב על דברים רעים כאלו.״',
                '״אני לא יודע אם היא תמות, כולנו נמות מתישהו, זה חוק הטבע ואין מה לעשות עם זה.״',
                '״זה באמת יכול להדאיג ואפילו קצת להפחיד כשמישהו שאנחנו אוהבים נמצא בבית חולים. לפעמים גם אנחנו מרגישים ככה.״'
            ],
            correctIndex: 2,
            feedbackCorrect: 'כל הכבוד! נתתם לגיטימציה מלאה לפחד/דאגה של הילד, ונרמלתם את החוויה בעזרת משפטי ״אני״ ו-״אנחנו״ (״גם אנחנו מרגישים ככה״).',
            feedbackIncorrect: 'לא מדויק. תשובה א׳ מבטלת וכועסת על הרגש של הילד. תשובה ב׳ היא עובדה יבשה קרה שאינה מעניקה תמיכה רגשית או שותפות. התשובה הנכונה היא ג׳.'
        },
        {
            step: 'שאלה 3 מתוך 3',
            question: 'הילד שואל בדאגה: ״ומי ישמור עלי אם סבתא לא תהיה?״',
            scenario: 'השאלה מעידה על חרדה קיומית (״מה איתי?״) ומצריכה תגובה בשכבה 3 (העוגן והביטחון). מהי התגובה הנכונה?',
            options: [
                '״אמא ואבא כאן איתך ושומרים עליך. מחר נלך לגן בדיוק כרגיל, ולא משנה מה ישתנה, אנחנו תמיד נדאג לך ונהיה איתך.״',
                '״סבא והדודים ישמרו עליך, יהיה בסדר. תפסיק לדאוג מהעתיד ותתרכז במשחקים שלך.״',
                '״סבתא תשמור עליך מלמעלה מהשמיים כמו מלאך, ואתה תהיה בסדר גמור.״'
            ],
            correctIndex: 0,
            feedbackCorrect: 'בדיוק! תשובה זו משלבת באופן מושלם את שלושת העוגנים: נוכחות פיזית כאן ועכשיו (אמא ואבא כאן), רציפות שגרה (מחר נלך לגן כרגיל) והבטחה מוצקה לעתיד.',
            feedbackIncorrect: 'לא מדויק. תשובה ב׳ מתנערת מהדאגה ואומרת לילד להפסיק לדאוג. תשובה ג׳ מציגה מושג מופשט שאינו מעניק עוגן יציב וממשי בחיים האמיתיים שלו. התשובה הנכונה היא א׳.'
        }
    ];

    let currentQuestionIdx = 0;
    let quizScore = 0;
    let hasSelected = false;

    const quizBodyContainer = document.getElementById('quiz-body-container');
    const quizResultContainer = document.getElementById('quiz-result-container');
    const quizStepEl = document.getElementById('quiz-step');
    const quizTitleEl = document.getElementById('quiz-title');
    const quizScenarioEl = document.getElementById('quiz-scenario');
    const quizOptionsContainer = document.getElementById('quiz-options-container');
    const quizSubmitBtn = document.getElementById('quiz-submit-btn');
    const quizFeedbackEl = document.getElementById('quiz-feedback');
    const quizResultIcon = document.getElementById('quiz-result-icon');
    const quizResultScoreCount = document.getElementById('quiz-result-score-count');
    const quizResultBadge = document.getElementById('quiz-result-badge');
    const quizRestartBtn = document.getElementById('quiz-restart-btn');

    const loadQuestion = (idx) => {
        if (!quizBodyContainer) return;
        
        hasSelected = false;
        if (quizFeedbackEl) {
            quizFeedbackEl.style.display = 'none';
            quizFeedbackEl.className = 'quiz-feedback-box';
        }

        const data = quizData[idx];

        if (quizStepEl) quizStepEl.textContent = data.step;
        if (quizTitleEl) quizTitleEl.textContent = data.question;
        if (quizScenarioEl) quizScenarioEl.textContent = data.scenario;

        if (quizOptionsContainer) {
            quizOptionsContainer.innerHTML = '';
            data.options.forEach((optText, optionIdx) => {
                const btn = document.createElement('button');
                btn.className = 'quiz-option-btn';
                btn.innerHTML = optText;
                btn.setAttribute('data-index', optionIdx);

                btn.addEventListener('click', () => {
                    if (hasSelected) return; // disable selection after verify

                    // Toggle selected styling
                    const siblings = quizOptionsContainer.querySelectorAll('.quiz-option-btn');
                    siblings.forEach(s => s.classList.remove('selected'));
                    btn.classList.add('selected');

                    if (quizSubmitBtn) {
                        quizSubmitBtn.disabled = false;
                    }
                });

                quizOptionsContainer.appendChild(btn);
            });
        }

        if (quizSubmitBtn) {
            quizSubmitBtn.textContent = 'בדוק תשובה';
            quizSubmitBtn.disabled = true;
        }
    };

    if (quizSubmitBtn) {
        quizSubmitBtn.addEventListener('click', () => {
            const data = quizData[currentQuestionIdx];

            if (!hasSelected) {
                // Verification state
                const selectedBtn = quizOptionsContainer.querySelector('.quiz-option-btn.selected');
                if (!selectedBtn) return;

                const selectedIdx = parseInt(selectedBtn.getAttribute('data-index'));
                hasSelected = true;

                // Highlight correct/incorrect options
                const allButtons = quizOptionsContainer.querySelectorAll('.quiz-option-btn');
                allButtons.forEach((btn, idx) => {
                    btn.classList.remove('selected');
                    if (idx === data.correctIndex) {
                        btn.classList.add('correct-choice');
                    } else if (idx === selectedIdx) {
                        btn.classList.add('incorrect-choice');
                    }
                });

                // Display feedback details
                if (quizFeedbackEl) {
                    quizFeedbackEl.style.display = 'block';
                    if (selectedIdx === data.correctIndex) {
                        quizScore++;
                        quizFeedbackEl.classList.add('correct');
                        quizFeedbackEl.innerHTML = `<strong>תשובה נכונה! 🎉</strong><br>${data.feedbackCorrect}`;
                    } else {
                        quizFeedbackEl.classList.add('incorrect');
                        quizFeedbackEl.innerHTML = `<strong>תשובה לא נכונה.</strong><br>${data.feedbackIncorrect}`;
                    }
                }

                // Change submit button to next question or show results
                if (currentQuestionIdx === quizData.length - 1) {
                    quizSubmitBtn.textContent = 'הצג תוצאות';
                } else {
                    quizSubmitBtn.textContent = 'לשאלה הבאה';
                }
            } else {
                // Next question state
                if (currentQuestionIdx < quizData.length - 1) {
                    currentQuestionIdx++;
                    loadQuestion(currentQuestionIdx);
                } else {
                    // Final results screen
                    showResults();
                }
            }
        });
    }

    const showResults = () => {
        if (!quizBodyContainer || !quizResultContainer) return;

        let badge = 'הורה לומד';
        let emoji = '📚';
        if (quizScore === 3) {
            badge = 'הורה קשוב ומדויק! ⚓';
            emoji = '🏆';
        } else if (quizScore === 2) {
            badge = 'הורה רגיש ומבין!';
            emoji = '🥈';
        }

        if (quizResultIcon) quizResultIcon.textContent = emoji;
        if (quizResultScoreCount) quizResultScoreCount.textContent = quizScore;
        if (quizResultBadge) quizResultBadge.textContent = badge;

        // Hide questions, show results
        quizBodyContainer.style.display = 'none';
        quizResultContainer.style.display = 'flex';
    };

    if (quizRestartBtn) {
        quizRestartBtn.addEventListener('click', () => {
            currentQuestionIdx = 0;
            quizScore = 0;

            // Hide results, show questions
            quizResultContainer.style.display = 'none';
            quizBodyContainer.style.display = 'block';

            loadQuestion(0);
        });
    }

    // Load first question on page load
    loadQuestion(0);
});
