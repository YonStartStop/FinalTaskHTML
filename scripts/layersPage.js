document.addEventListener('DOMContentLoaded', () => {

    const ringsContainer = document.getElementById('layers-rings-container');
    const rings = document.querySelectorAll('.layer-ring');

    if (ringsContainer && rings.length > 0) {
        rings.forEach(ring => {
            ring.addEventListener('click', () => {
                // Remove active from all rings
                rings.forEach(r => r.classList.remove('active-ring'));
                // Add active to clicked ring
                ring.classList.add('active-ring');

                // Smooth scroll to corresponding detail card
                const layerNum = ring.getAttribute('data-layer');
                const targetCard = document.querySelector(`.card-layer-${layerNum}`);
                if (targetCard) {
                    const header = document.querySelector('.main-header');
                    const offset = header ? header.offsetHeight + 15 : 100; // Dynamically calculate offset based on sticky header height
                    const elementPosition = targetCard.getBoundingClientRect().top + window.scrollY;
                    const offsetPosition = elementPosition - offset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });

            // Keyboard navigation interaction
            ring.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    ring.click();
                }
            });
        });
    }

    // ==========================================================================
    // 2. SUMMARY QUIZ LOGIC
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
