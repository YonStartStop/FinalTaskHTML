document.addEventListener('DOMContentLoaded', () => {
    const field = document.getElementById('bubble-field');
    const cluster = document.getElementById('bubble-cluster');
    const bubbleElements = document.querySelectorAll('.interactive-bubble');

    if (!field || !cluster || bubbleElements.length === 0) return;

    // ==========================================
    // TWEAKABLE PARAMETERS
    // Change these values to adjust the feel and look of the bubbles
    // ==========================================

    // Size Parameters
    const maxScale = 1.3;     // The size of the bubble right under the cursor
    const minScale = 0.5;    // The size of bubbles far away from the cursor

    // Interaction Parameters
    const radius = 250;       // Distance (in pixels) the mouse affects the bubbles
    const curvePower = 4;     // Higher = steeper curve (bubbles not directly under cursor grow much less)
    // 1 = linear, 2 = gentle curve, 3-4 = sharp peak at cursor

    // Organic Layout Parameters
    const pushStrength = 30;  // How strongly to push bubbles outward to form a ball/circle shape
    const randomVariance = 35; // Amount of random X/Y offset to break the rigid grid look

    // Interactive Globe Effect Parameters
    const hoverPushStrength = 30; // How strongly the mouse pushes surrounding bubbles away to create a 3D sphere effect

    // ==========================================

    let isMouseInField = false;
    let mouseX = -1000;
    let mouseY = -1000;
    let clusterCenterX = 0;
    let clusterCenterY = 0;

    const bubbles = Array.from(bubbleElements).map(el => {
        return {
            el,
            scale: minScale,
            baseOffsetX: 0,
            baseOffsetY: 0,
            offsetX: 0,
            offsetY: 0,
            baseCenterX: 0,
            baseCenterY: 0,
            baseLeft: 0,
            baseRight: 0,
            baseTop: 0,
            baseBottom: 0,
            initialized: false
        };
    });

    function calculateOffsets() {
        const clusterRect = cluster.getBoundingClientRect();
        clusterCenterX = clusterRect.left + clusterRect.width / 2;
        clusterCenterY = clusterRect.top + clusterRect.height / 2;

        // Temporarily clear transforms to read true layout grid positions
        bubbles.forEach(b => { b.el.style.transform = 'none'; });

        bubbles.forEach(b => {
            const rect = b.el.getBoundingClientRect();
            const elCenterX = rect.left + rect.width / 2;
            const elCenterY = rect.top + rect.height / 2;

            // Calculate vector outward from the center of the grid
            const dx = elCenterX - clusterCenterX;
            const dy = elCenterY - clusterCenterY;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;

            // Push bubbles outward to make the grid more spherical
            b.baseOffsetX = (dx / dist) * pushStrength;
            b.baseOffsetY = (dy / dist) * pushStrength;

            // Add a touch of chaos so it doesn't look like masonry
            b.baseOffsetX += (Math.random() - 0.5) * randomVariance * 2;
            b.baseOffsetY += (Math.random() - 0.5) * randomVariance * 2;

            // Initialize the smoothed offsets on first run
            if (!b.initialized) {
                b.offsetX = b.baseOffsetX;
                b.offsetY = b.baseOffsetY;
                b.initialized = true;
            }

            // Store base center and rect boundaries for precise box-distance calculations
            b.baseCenterX = elCenterX;
            b.baseCenterY = elCenterY;
            b.baseLeft = rect.left;
            b.baseRight = rect.right;
            b.baseTop = rect.top;
            b.baseBottom = rect.bottom;
        });
    }

    // Wait slightly for fonts to load and layout to settle before calculating offsets
    setTimeout(calculateOffsets, 100);

    // Recalculate on window resize
    window.addEventListener('resize', () => {
        clearTimeout(window.resizeTimer);
        window.resizeTimer = setTimeout(calculateOffsets, 200);
    });

    field.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        isMouseInField = true;
    });

    field.addEventListener('mouseleave', () => {
        isMouseInField = false;
    });

    function render() {
        if (window.innerWidth < 768) {
            bubbles.forEach(b => {
                b.el.style.transform = '';
                b.el.style.zIndex = '';
            });
            requestAnimationFrame(render);
            return;
        }

        bubbles.forEach(b => {
            let targetScale = minScale;
            let currentMouseX = mouseX;
            let currentMouseY = mouseY;

            // If the mouse is off-screen, simulate mouse at the center of the cluster
            if (!isMouseInField) {
                currentMouseX = clusterCenterX;
                currentMouseY = clusterCenterY;
            }

            // Vector from mouse to center for directional pushing
            const dxCenter = currentMouseX - b.baseCenterX;
            const dyCenter = currentMouseY - b.baseCenterY;
            const distanceToCenter = Math.sqrt(dxCenter * dxCenter + dyCenter * dyCenter) || 1;

            // Distance to the bounding box for precise hovering scale
            const dxBox = Math.max(b.baseLeft - currentMouseX, 0, currentMouseX - b.baseRight);
            const dyBox = Math.max(b.baseTop - currentMouseY, 0, currentMouseY - b.baseBottom);
            const distanceToBox = Math.sqrt(dxBox * dxBox + dyBox * dyBox);

            let targetOffsetX = b.baseOffsetX;
            let targetOffsetY = b.baseOffsetY;

            if (distanceToBox < radius) {
                // Scale uses distanceToBox so it maxes out across the entire bubble area
                const factor = 1 - (distanceToBox / radius);
                const easeFactor = Math.pow(factor, curvePower);
                targetScale = minScale + (maxScale - minScale) * easeFactor;

                // Push uses distanceToBox for magnitude (so actively hovered bubbles stay still)
                const pushFactor = Math.sin((distanceToBox / radius) * Math.PI);
                const pushMagnitude = pushFactor * hoverPushStrength;

                // Direction uses distanceToCenter to ensure bubbles always push away radially
                const nx = dxCenter / distanceToCenter;
                const ny = dyCenter / distanceToCenter;

                // Subtract to push AWAY from the mouse
                targetOffsetX -= nx * pushMagnitude;
                targetOffsetY -= ny * pushMagnitude;
            }

            // Smooth interpolation for scale and offsets
            b.scale += (targetScale - b.scale) * 0.15;
            b.offsetX += (targetOffsetX - b.offsetX) * 0.15;
            b.offsetY += (targetOffsetY - b.offsetY) * 0.15;

            // Apply organic offset along with the dynamic scale
            b.el.style.transform = `translate(${b.offsetX}px, ${b.offsetY}px) scale(${b.scale})`;

            // Adjust z-index based on scale so larger bubbles overlay smaller ones
            b.el.style.zIndex = Math.round(b.scale * 100);
        });

        requestAnimationFrame(render);
    }

    render();

    // ==========================================
    // PREMIUM INTERACTIVE MODAL FOR QUESTIONS
    // ==========================================
    const modal = document.getElementById('question-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalBody = document.getElementById('modal-body');

    // Psychological Q&A database using the 3-Layers Rule
    const questionsData = {
        'two-dads': {
            question: 'למה לנועה יש <strong>שני אבאים</strong>?',
            parentGuide: 'ילדים שואלים על הרכבים משפחתיים מתוך סקרנות והשוואה למשפחה שלהם. המטרה היא להעביר שמשפחה מוגדרת על ידי קשר ואהבה, ולא רק על ידי מבנה קבוע.',
            layer1: 'יש המון סוגים של משפחות בעולם. במשפחה של נועה יש שני אבות שאוהבים אותה, מגדלים אותה ודואגים לכל מה שהיא צריכה ביחד.',
            layer2: 'זה עשוי להיראות קצת שונה ממה שאנחנו מכירים בבית שלנו, וזה טבעי לגמרי להסתקרן או לשאול שאלות על זה כדי להבין.',
            layer3: 'בכל סוג משפחה, מה שהכי חשוב זה שההורים אוהבים את הילדים שלהם ושומרים עליהם. בדיוק כמו שאנחנו אוהבים אותך ושומרים עליך אצלנו בבית.'
        },
        'grandma-driving': {
            question: 'למה סבתא <strong>כבר לא נוהגת</strong>?',
            parentGuide: 'שאלה זו נוגעת בשינויים שמגיעים עם הגיל. חשוב להציג זאת כהחלטה בוגרת ואחראית של שמירה על בטיחות, מבלי להפחיד את הילד.',
            layer1: 'ככל שמתבגרים, הגוף והראייה שלנו משתנים, והתגובות הופכות לאיטיות יותר. סבתא החליטה שעבורה ועבור כולם, בטוח ונוח יותר שהיא תיסע במוניות או שמישהו אחר יסיע אותה.',
            layer2: 'לפעמים זה קצת עצוב או מוזר לראות שסבתא משתנה או עושה פחות דברים שעשתה פעם, וזה טבעי לגמרי להרגיש ככה.',
            layer3: 'למרות שסבתא לא נוהגת, היא עדיין אותה סבתא שאוהבת אותך כל כך, ואנחנו תמיד נדאג להביא אותה אלינו או לנסוע לבקר אותה בבטחה.'
        },
        'skin-color': {
            question: 'למה האיש הזה <strong>שחור</strong>?',
            parentGuide: 'סקרנות לגבי הבדלים גופניים. מומלץ להסביר את ההבדל בצורה ביולוגית פשוטה (מלנין/הגנה מהשמש) ולהציג את השונות האנושית כדבר יפה ומסקרן.',
            layer1: 'בני אדם מגיעים בכל מיני צבעי עור – מחום כהה מאוד ועד בהיר מאוד. הצבע נקבע על ידי חומר טבעי בעור שנקרא מלנין, שמגן עלינו מפני השמש. אנשים שאבותיהם הגיעו מארצות חמות מאוד קיבלו עור כהה יותר כדי להגן עליהם.',
            layer2: 'זה נהדר להבחין בהבדלים בינינו! העולם שלנו צבעוני ומגוון, וזה מה שהופך אותו למעניין ויפה כל כך.',
            layer3: 'לא משנה מה צבע העור של אדם, לכולנו יש את אותם הרגשות – כולנו אוהבים, צוחקים ורוצים להרגיש בטוחים. ובבית שלנו אנחנו מכבדים ואוהבים כל אדם.'
        },
        'wheelchair': {
            question: 'למה האישה הזאת <strong>בכיסא</strong>?',
            parentGuide: 'התמודדות עם מוגבלות פיזית. יש להסביר את המוגבלות בצורה עניינית ללא רחמים מוגזמים, ולהציג את כיסא הגלגלים ככלי שמסייע לחופש ולעצמאות.',
            layer1: 'הרגליים של האישה הזו אינן חזקות מספיק כדי ללכת בעצמן, לפעמים בגלל שהיא נולדה כך ולפעמים בגלל פציעה או מחלה. כיסא הגלגלים עוזר לה לנוע ממקום למקום בקלות ובמהירות.',
            layer2: 'לפעמים כשרואים מישהו בכיסא גלגלים זה מעורר סקרנות או רצון להסתכל, וזה טבעי לרצות להבין. אנו מקווים שלכולם יהיה קל ונוח להגיע לכל מקום.',
            layer3: 'למרות שהיא לא יכולה ללכת ברגליה, היא יכולה לעשות המון דברים אחרים – לעבוד, ללמוד, לאהוב ולשמוח, בדיוק כמו כל אחד מאיתנו.'
        },
        'sign-language': {
            question: 'למה אנשים מדברים <strong>עם הידיים</strong>?',
            parentGuide: 'שפה ותקשורת שונה. מומלץ להציג את שפת הסימנים כשפה עשירה ויפהפייה שמאפשרת לאנשים חרשים לתקשר באופן מלא.',
            layer1: 'האנשים האלו הם חרשים או כבדי שמיעה, כלומר האוזניים שלהם לא שומעות קולות. במקום לדבר עם הפה, הם משתמשים בשפת הסימנים – שפה שלמה ומדהימה המשתמשת בתנועות ידיים, הבעות פנים וגוף.',
            layer2: 'זה נראה מרתק ויפה לראות אותם משוחחים כך! שפות הן דרך נפלאה לחבר בין אנשים.',
            layer3: 'לכולנו יש צורך לשתף ולדבר, וזה נפלא שיש דרך מיוחדת שמאפשרת להם לעשות זאת. כל אדם מוצא את הדרך שלו להתחבר לעולם.'
        },
        'holocaust': {
            question: 'מה זה <strong>השואה</strong>?',
            parentGuide: 'זהו נושא קשה ורגיש ביותר. בגיל צעיר חשוב לענות ברכות, ללא פרטים מזעזעים, תוך הדגשה היסטורית כללית והתמקדות בביטחון העכשווי ובקיומה של מדינת ישראל כמגן.',
            layer1: 'לפני הרבה שנים, בארץ רחוקה, היה שלטון של אנשים רעים מאוד שנקראו נאצים. הם החליטו לפגוע ביהודים רק בגלל שהם יהודים, והרבה יהודים נאלצו להתחבא או נפגעו.',
            layer2: 'זה סיפור עצוב, מפחיד וקשה מאוד לשמיעה. טבעי להרגיש עצב, פחד או כעס כשחושבים על זה, וגם אנחנו המבוגרים מרגישים ככה לפעמים.',
            layer3: 'זה קרה מזמן, וכיום המצב שונה לחלוטין. יש לנו מדינה משלנו, צבא חזק ששומר עלינו, ואנחנו כאן ביחד בבית הבטוח שלנו כדי להגן עליך תמיד.'
        },
        'death': {
            question: 'אמא, מה זה <strong>מוות</strong>?',
            parentGuide: 'שאלה המעוררת חרדת פרידה עמוקה. חשוב להשתמש במילים ביולוגיות מדויקות (הגוף מפסיק לעבוד) ולהימנע ממטאפורות כמו "הלך לישון" (שעלולות לגרום לפחד משינה), תוך הבטחה יציבה לנוכחות שלכם.',
            layer1: 'מוות הוא כאשר הגוף של יצור חי (אדם, חיה או צמח) מפסיק לעבוד לחלוטין. הוא כבר לא נושם, לא אוכל, לא מרגיש, לא כואב לו והוא לא יכול לחזור לחיים.',
            layer2: 'מחשבות על מוות הן עצובות ומפחידות מאוד, וזה לגמרי טבעי ונורמלי להרגיש דאגה או לרצות לבכות כשחושבים על זה.',
            layer3: 'אנחנו כאן, בריאים, צעירים וחזקים מאוד. אנחנו נמשיך לשמור עליך, להיות איתך, לצחוק ולחיות יחד עוד המון המון שנים ארוכות.'
        },
        'danny-room': {
            question: 'למה לדני יש <strong>מיטה וחדר משלו</strong>?',
            parentGuide: 'שאלה על הבדלים כלכליים או תנאי מחיה. יש להסביר שלכל משפחה יש תנאים ויכולות שונים, תוך נרמול החוויה של שיתוף חדר והדגשת הערך של יחד ושל מה שיש בבית.',
            layer1: 'לכל משפחה יש בית שונה בגודלו ותנאים שונים. להורים של דני יש בית עם חדרים נפרדים לכל ילד, ובבתים אחרים אחים חולקים חדר ביחד כי זה מה שמתאים ונוח למשפחה שלהם.',
            layer2: 'לפעמים זה מעורר קנאה או רצון שיהיה לנו בדיוק אותו דבר, וזה טבעי ונורמלי לגמרי לרצות פינה פרטית משלך לפעמים.',
            layer3: 'לחלוק חדר זו הזדמנות מדהימה לקרבה, משחק וחוויות משותפות של אחים. אנחנו תמיד נדאג שלכל אחד מכם תהיה המיטה החמה שלו, הפינה הבטוחה והדברים שחשובים לו בבית שלנו.'
        },
        'god-answering': {
            question: 'למה אלוהים <strong>לא עונה לי</strong>?',
            parentGuide: 'נושא מופשט של אמונה ותפילה. מומלץ להסביר שאלוהים הוא מושג מופשט ולא אדם עם קול פיזי, ושמענה של אלוהים מתקבל דרך תחושות פנימיות, מחשבות טובות או דברים שקורים במציאות.',
            layer1: 'אלוהים אינו אדם בעל קול פיזי שאפשר לשמוע באוזניים. אנשים מאמינים מדברים אל אלוהים בלב או בתפילה, והם מרגישים את התשובות שלו דרך המחשבות שלהם, דרך הלב או דרך דברים טובים שקורים להם בחיים.',
            layer2: 'זה יכול להרגיש קצת מתסכל או מאכזב כשמבקשים משהו ולא שומעים קול שעונה מיד, וזה מאוד טבעי לחכות לתשובה ברורה.',
            layer3: 'התפילה או המשאלה שלך הן ביטוי ללב הטוב שלך. גם כשלא שומעים תשובה בקול, המשאלה שלך נשמרת אצלך בלב, ואנחנו תמיד כאן כדי להקשיב לך ולעזור לך להגשים את הדברים שאתה מקווה להם.'
        },
        'lesbian': {
            question: 'מה זה אומר שמישהי <strong>לסבית</strong>?',
            parentGuide: 'הסבר פשוט ונטול שיפוטיות למושג חברתי של נטייה מינית. יש לפשט את המונח לעולם המושגים של אהבה וזוגיות.',
            layer1: 'לסבית זו אישה שאוהבת נשים, ובוחרת להקים זוגיות, לחיות ולפעמים להקים משפחה עם אישה אחרת שהיא אוהבת, בדיוק כפי שיש גברים ונשים שבוחרים לחיות יחד.',
            layer2: 'זה יכול להישמע מושג חדש או מעניין, וזה נהדר לשאול ולרצות להבין מה מילים ששומעים אומרות.',
            layer3: 'הדבר הכי יפה בעולם הוא שכל אדם יכול לבחור את מי לאהוב ועם מי לבנות את החיים שלו בביטחון ובשמחה. ואצלנו בבית תמיד מותר לאהוב ולהיות מי שאתה.'
        },
        'ashkenazi': {
            question: 'מה זה אומר שאני <strong>אשכנזי</strong>?',
            parentGuide: 'נושא של עדתיות ושורשים משפחתיים. מומלץ להסביר זאת כחלק מההיסטוריה והמסורת הגיאוגרפית המשפחתית, תוך חיבור לכור ההיתוך הישראלי המגוון.',
            layer1: 'אשכנזי הוא אדם שאבות אבותיו הגיעו ממדינות באירופה (כמו פולין, גרמניה, רוסיה ועוד), שם התפתחו מנהגים, מאכלים וסגנון תפילה משלהם. אנשים שאבותיהם הגיעו מארצות ערב או ספרד נקראים מזרחים או ספרדים.',
            layer2: 'זה מאוד מעניין לחקור מאיפה המשפחה שלנו הגיעה! לכל עדה יש סיפורים, שירים ומאכלים טעימים ומיוחדים משלה.',
            layer3: 'כיום כולנו חיים כאן ביחד כמשפחה אחת גדולה ומגוונת. השורשים שלך הם חלק מהיופי שלך, והכי חשוב זה מי שאתה כיום והלב הטוב שלך.'
        }
    };

    function openModal(questionId) {
        const data = questionsData[questionId];
        if (!data || !modal || !modalBody) return;

        // Render dynamic content beautifully matching the Design Language
        modalBody.innerHTML = `
            <div class="modal-question-header">
                <div class="chat-bubble kid tail-bottom-right">
                    ${data.question}
                </div>
            </div>
            
            <div class="modal-parent-guide">
                <strong>💡 רקע פסיכולוגי להורה:</strong>
                <p>${data.parentGuide}</p>
            </div>
            
            <div class="modal-layers-container">
                <div class="modal-layer-row" style="border-right: 4px solid var(--highlight-blue);">
                    <span class="modal-layer-label bg-blue">שכבה 1: העובדה היבשה (התשובה ל"מה")</span>
                    <p class="modal-layer-text">${data.layer1}</p>
                </div>
                
                <div class="modal-layer-row" style="border-right: 4px solid var(--highlight-indigo);">
                    <span class="modal-layer-label bg-indigo">שכבה 2: הרגש והנורמליזציה (התשובה ל"איך מרגישים")</span>
                    <p class="modal-layer-text">${data.layer2}</p>
                </div>
                
                <div class="modal-layer-row" style="border-right: 4px solid var(--accent-salmon);">
                    <span class="modal-layer-label bg-salmon">שכבה 3: העוגן והביטחון (התשובה ל"מה איתי")</span>
                    <p class="modal-layer-text">${data.layer3}</p>
                </div>
            </div>
        `;

        // Display modal
        modal.style.display = 'flex';
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Prevent main page scrolling

        // Smooth transition animation
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Restore scrolling

        // Hide after scale-down transition finishes
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }

    // Attach click listeners to interactive bubbles
    bubbles.forEach(b => {
        const questionId = b.el.getAttribute('data-question-id');
        if (questionId) {
            b.el.addEventListener('click', (e) => {
                e.preventDefault();
                openModal(questionId);
            });
        }
    });

    // Close listeners
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    // Close on clicking backdrop
    modal.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-backdrop')) {
            closeModal();
        }
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
});

