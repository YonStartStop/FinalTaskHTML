document.addEventListener('DOMContentLoaded', () => {
    const bubbleField = document.getElementById('bubble-field');
    const bubbleCluster = document.getElementById('bubble-cluster');
    const bubbleElements = document.querySelectorAll('.interactive-bubble');

    if (!bubbleField || !bubbleCluster || bubbleElements.length === 0) return;

    // ==========================================
    // TWEAKABLE PARAMETERS
    // Change these values to adjust the feel and look of the bubbles
    // ==========================================

    // Size Parameters
    const maxScale = 1.45;    // The size of the bubble right under the cursor
    const minScale = 0.85;   // The size of bubbles far away from the cursor

    // Interaction Parameters
    const radius = 220;       // Distance (in pixels) the mouse affects the bubbles
    const curvePower = 2.5;   // Smoother curve for gradual zoom response as mouse approaches
    // 1 = linear, 2 = gentle curve, 3-4 = sharp peak at cursor

    // Organic Layout Parameters
    const pushStrength = 30;  // How strongly to push bubbles outward to form a ball/circle shape
    const randomVariance = 8;  // Reduced offset to prevent speech bubbles from overlapping randomly

    // Interactive Globe Effect Parameters
    const hoverPushStrength = 30; // How strongly the mouse pushes surrounding bubbles away to create a 3D sphere effect

    // ==========================================

    let isMouseInField = false;
    let mouseX = -1000;
    let mouseY = -1000;
    let clusterCenterX = 0;
    let clusterCenterY = 0;

    const bubbles = Array.from(bubbleElements).map(bubbleElement => {
        return {
            element: bubbleElement,
            scale: 0,
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
            initialized: false,
            revealed: false
        };
    });

    function calculateOffsets() {
        const scrollX = window.scrollX || window.pageXOffset || 0;
        const scrollY = window.scrollY || window.pageYOffset || 0;

        const clusterRect = bubbleCluster.getBoundingClientRect();
        clusterCenterX = clusterRect.left + clusterRect.width / 2 + scrollX;
        clusterCenterY = clusterRect.top + clusterRect.height / 2 + scrollY;

        // Temporarily clear transforms to read true layout grid positions
        bubbles.forEach(bubble => { bubble.element.style.transform = 'none'; });

        bubbles.forEach(bubble => {
            const bubbleRect = bubble.element.getBoundingClientRect();
            const bubbleCenterX = bubbleRect.left + bubbleRect.width / 2 + scrollX;
            const bubbleCenterY = bubbleRect.top + bubbleRect.height / 2 + scrollY;

            // Calculate vector outward from the center of the grid (document-relative)
            const deltaX = bubbleCenterX - clusterCenterX;
            const deltaY = bubbleCenterY - clusterCenterY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY) || 1;

            // Push bubbles outward to make the grid more spherical
            bubble.baseOffsetX = (deltaX / distance) * pushStrength;
            bubble.baseOffsetY = (deltaY / distance) * pushStrength;

            // Add a touch of chaos so it doesn't look like masonry
            bubble.baseOffsetX += (Math.random() - 0.5) * randomVariance * 2;
            bubble.baseOffsetY += (Math.random() - 0.5) * randomVariance * 2;

            // Initialize the smoothed offsets on first run
            if (!bubble.initialized) {
                bubble.offsetX = bubble.baseOffsetX;
                bubble.offsetY = bubble.baseOffsetY;
                bubble.initialized = true;
            }

            // Store base center and rect boundaries for precise box-distance calculations (document-relative)
            bubble.baseCenterX = bubbleCenterX;
            bubble.baseCenterY = bubbleCenterY;
            bubble.baseLeft = bubbleRect.left + scrollX;
            bubble.baseRight = bubbleRect.right + scrollX;
            bubble.baseTop = bubbleRect.top + scrollY;
            bubble.baseBottom = bubbleRect.bottom + scrollY;
        });
    }

    // Wait slightly for fonts to load and layout to settle before calculating offsets
    setTimeout(calculateOffsets, 100);

    let isMobile = window.innerWidth < 768;

    // Recalculate on window resize
    window.addEventListener('resize', () => {
        const currentlyMobile = window.innerWidth < 768;
        if (currentlyMobile !== isMobile) {
            isMobile = currentlyMobile;
            if (isMobile) {
                // Clear mobile styles once when transitioning to mobile
                bubbles.forEach(bubble => {
                    bubble.element.style.transform = '';
                    bubble.element.style.zIndex = '';
                });
            }
        }
        clearTimeout(window.resizeTimer);
        window.resizeTimer = setTimeout(calculateOffsets, 200);
    });

    bubbleField.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        isMouseInField = true;
    });

    bubbleField.addEventListener('mouseleave', () => {
        isMouseInField = false;
    });

    function render() {
        if (isMobile) {
            requestAnimationFrame(render);
            return;
        }

        const scrollX = window.scrollX || window.pageXOffset || 0;
        const scrollY = window.scrollY || window.pageYOffset || 0;

        let currentMouseX = mouseX;
        let currentMouseY = mouseY;

        // If the mouse is off-screen, simulate mouse at the center of the cluster (viewport-relative)
        if (!isMouseInField) {
            currentMouseX = clusterCenterX - scrollX;
            currentMouseY = clusterCenterY - scrollY;
        }

        // Convert viewport-relative mouse to document-relative coordinates
        const mouseDocX = currentMouseX + scrollX;
        const mouseDocY = currentMouseY + scrollY;

        bubbles.forEach(bubble => {
            let targetScale = 0; // Default target scale is 0 when not revealed

            // Vector from mouse to center for directional pushing (document-relative)
            const deltaXToCenter = mouseDocX - bubble.baseCenterX;
            const deltaYToCenter = mouseDocY - bubble.baseCenterY;
            const distanceToCenter = Math.sqrt(deltaXToCenter * deltaXToCenter + deltaYToCenter * deltaYToCenter) || 1;

            // Distance to the bounding box for precise hovering scale (document-relative)
            const deltaXToBox = Math.max(bubble.baseLeft - mouseDocX, 0, mouseDocX - bubble.baseRight);
            const deltaYToBox = Math.max(bubble.baseTop - mouseDocY, 0, mouseDocY - bubble.baseBottom);
            const distanceToBox = Math.sqrt(deltaXToBox * deltaXToBox + deltaYToBox * deltaYToBox);

            let targetOffsetX = bubble.baseOffsetX;
            let targetOffsetY = bubble.baseOffsetY;

            if (bubble.revealed) {
                targetScale = minScale;
                if (distanceToBox < radius) {
                    // Scale uses distanceToBox so it maxes out across the entire bubble area
                    const factor = 1 - (distanceToBox / radius);
                    const easeFactor = Math.pow(factor, curvePower);
                    targetScale = minScale + (maxScale - minScale) * easeFactor;

                    // Push uses distanceToBox for magnitude (so actively hovered bubbles stay still)
                    const pushFactor = Math.sin((distanceToBox / radius) * Math.PI);
                    const pushMagnitude = pushFactor * hoverPushStrength;

                    // Direction uses distanceToCenter to ensure bubbles always push away radially
                    const directionX = deltaXToCenter / distanceToCenter;
                    const directionY = deltaYToCenter / distanceToCenter;

                    // Subtract to push AWAY from the mouse
                    targetOffsetX -= directionX * pushMagnitude;
                    targetOffsetY -= directionY * pushMagnitude;
                }
            }

            // Smooth responsive interpolation for scale and offsets
            bubble.scale += (targetScale - bubble.scale) * 0.22;
            bubble.offsetX += (targetOffsetX - bubble.offsetX) * 0.20;
            bubble.offsetY += (targetOffsetY - bubble.offsetY) * 0.20;

            // Apply organic offset along with the dynamic scale
            bubble.element.style.transform = `translate(${bubble.offsetX}px, ${bubble.offsetY}px) scale(${bubble.scale})`;

            // Adjust z-index based on scale so larger bubbles overlay smaller ones
            bubble.element.style.zIndex = Math.round(bubble.scale * 100);
        });

        requestAnimationFrame(render);
    }

    render();

    // ==========================================
    // ORGANIC STAGGERED ENTRANCE ANIMATION FOR HERO
    // ==========================================
    function startEntranceAnimation() {
        const leftBubbles = bubbles.filter(bubble => bubble.element.closest('.left-column'));
        const rightBubbles = bubbles.filter(bubble => bubble.element.closest('.right-column'));

        // Shuffling helper function
        function shuffle(array) {
            for (let index = array.length - 1; index > 0; index--) {
                const randomIndex = Math.floor(Math.random() * (index + 1));
                [array[index], array[randomIndex]] = [array[randomIndex], array[index]];
            }
            return array;
        }

        // Shuffle both sides independently
        const shuffledLeft = shuffle([...leftBubbles]);
        const shuffledRight = shuffle([...rightBubbles]);

        // Combine left and right alternately to maintain visual balance during reveal
        const revealSequence = [];
        const maxLength = Math.max(shuffledLeft.length, shuffledRight.length);
        for (let index = 0; index < maxLength; index++) {
            if (index < shuffledLeft.length) revealSequence.push(shuffledLeft[index]);
            if (index < shuffledRight.length) revealSequence.push(shuffledRight[index]);
        }

        // After 1.2s delay, start revealing bubbles sequentially with 0.2s intervals
        setTimeout(() => {
            revealSequence.forEach((bubbleObj, index) => {
                setTimeout(() => {
                    bubbleObj.revealed = true;
                    bubbleObj.element.classList.add('visible');
                }, index * 200);
            });

            // The CTA button is now always visible immediately, so no delay is needed here
        }, 1200);
    }

    startEntranceAnimation();
});

