document.addEventListener('DOMContentLoaded', () => {

    const ringsContainer = document.getElementById('layers-rings-container');
    const rings = document.querySelectorAll('.layer-ring');

    if (ringsContainer && rings.length > 0) {
        rings.forEach(ring => {
            ring.addEventListener('click', () => {
                // Remove active from all rings
                rings.forEach(otherRing => otherRing.classList.remove('active-ring'));
                // Add active to clicked ring
                ring.classList.add('active-ring');

                // Smooth scroll to corresponding detail card
                const layerNum = ring.getAttribute('data-layer');
                const targetCard = document.querySelector(`.card-layer-${layerNum}`);
                if (targetCard) {
                    const mainHeader = document.querySelector('.main-header');
                    const offset = mainHeader ? mainHeader.offsetHeight + 15 : 100; // Dynamically calculate offset based on sticky header height
                    const elementPosition = targetCard.getBoundingClientRect().top + window.scrollY;
                    const offsetPosition = elementPosition - offset;

                    window.smoothScrollTo(offsetPosition, 700);
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

    let currentQuestionIndex = 0;
    let quizScore = 0;
    let hasSelected = false;

    const quizBodyContainer = document.getElementById('quiz-body-container');
    const quizResultContainer = document.getElementById('quiz-result-container');
    const quizStepElement = document.getElementById('quiz-step');
    const quizTitleElement = document.getElementById('quiz-title');
    const quizScenarioElement = document.getElementById('quiz-scenario');
    const quizOptionsContainer = document.getElementById('quiz-options-container');
    const quizSubmitButton = document.getElementById('quiz-submit-btn');
    const quizFeedbackElement = document.getElementById('quiz-feedback');
    const quizResultIcon = document.getElementById('quiz-result-icon');
    const quizResultScoreCount = document.getElementById('quiz-result-score-count');
    const quizResultBadge = document.getElementById('quiz-result-badge');
    const quizRestartButton = document.getElementById('quiz-restart-btn');

    const loadQuestion = (questionIndex) => {
        if (!quizBodyContainer) return;

        hasSelected = false;
        if (quizFeedbackElement) {
            quizFeedbackElement.style.display = 'none';
            quizFeedbackElement.className = 'quiz-feedback-box';
        }

        const currentQuestionData = quizData[questionIndex];

        if (quizStepElement) quizStepElement.textContent = currentQuestionData.step;
        if (quizTitleElement) quizTitleElement.textContent = currentQuestionData.question;
        if (quizScenarioElement) quizScenarioElement.textContent = currentQuestionData.scenario;

        if (quizOptionsContainer) {
            quizOptionsContainer.innerHTML = '';
            currentQuestionData.options.forEach((optionText, optionIndex) => {
                const optionButton = document.createElement('button');
                optionButton.className = 'quiz-option-btn';
                optionButton.innerHTML = optionText;
                optionButton.setAttribute('data-index', optionIndex);

                optionButton.addEventListener('click', () => {
                    if (hasSelected) return; // disable selection after verify

                    // Toggle selected styling
                    const siblingButtons = quizOptionsContainer.querySelectorAll('.quiz-option-btn');
                    siblingButtons.forEach(siblingButton => siblingButton.classList.remove('selected'));
                    optionButton.classList.add('selected');

                    if (quizSubmitButton) {
                        quizSubmitButton.disabled = false;
                    }
                });

                quizOptionsContainer.appendChild(optionButton);
            });
        }

        if (quizSubmitButton) {
            quizSubmitButton.textContent = 'בדוק תשובה';
            quizSubmitButton.disabled = true;
        }
    };

    if (quizSubmitButton) {
        quizSubmitButton.addEventListener('click', () => {
            const currentQuestionData = quizData[currentQuestionIndex];

            if (!hasSelected) {
                // Verification state
                const selectedButton = quizOptionsContainer.querySelector('.quiz-option-btn.selected');
                if (!selectedButton) return;

                const selectedIndex = parseInt(selectedButton.getAttribute('data-index'));
                hasSelected = true;

                // Highlight correct/incorrect options
                const allButtons = quizOptionsContainer.querySelectorAll('.quiz-option-btn');
                allButtons.forEach((optionButton, buttonIndex) => {
                    optionButton.classList.remove('selected');
                    if (buttonIndex === currentQuestionData.correctIndex) {
                        optionButton.classList.add('correct-choice');
                    } else if (buttonIndex === selectedIndex) {
                        optionButton.classList.add('incorrect-choice');
                    }
                });

                // Display feedback details
                if (quizFeedbackElement) {
                    quizFeedbackElement.style.display = 'block';
                    if (selectedIndex === currentQuestionData.correctIndex) {
                        quizScore++;
                        quizFeedbackElement.classList.add('correct');
                        quizFeedbackElement.innerHTML = `<strong>תשובה נכונה! 🎉</strong><br>${currentQuestionData.feedbackCorrect}`;
                    } else {
                        quizFeedbackElement.classList.add('incorrect');
                        quizFeedbackElement.innerHTML = `<strong>תשובה לא נכונה.</strong><br>${currentQuestionData.feedbackIncorrect}`;
                    }
                }

                // Change submit button to next question or show results
                if (currentQuestionIndex === quizData.length - 1) {
                    quizSubmitButton.textContent = 'הצג תוצאות';
                } else {
                    quizSubmitButton.textContent = 'לשאלה הבאה';
                }
            } else {
                // Next question state
                if (currentQuestionIndex < quizData.length - 1) {
                    currentQuestionIndex++;
                    loadQuestion(currentQuestionIndex);
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

    if (quizRestartButton) {
        quizRestartButton.addEventListener('click', () => {
            currentQuestionIndex = 0;
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
