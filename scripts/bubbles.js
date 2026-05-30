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

    const bubbles = Array.from(bubbleElements).map(el => {
        return {
            el,
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

        const clusterRect = cluster.getBoundingClientRect();
        clusterCenterX = clusterRect.left + clusterRect.width / 2 + scrollX;
        clusterCenterY = clusterRect.top + clusterRect.height / 2 + scrollY;

        // Temporarily clear transforms to read true layout grid positions
        bubbles.forEach(b => { b.el.style.transform = 'none'; });

        bubbles.forEach(b => {
            const rect = b.el.getBoundingClientRect();
            const elCenterX = rect.left + rect.width / 2 + scrollX;
            const elCenterY = rect.top + rect.height / 2 + scrollY;

            // Calculate vector outward from the center of the grid (document-relative)
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

            // Store base center and rect boundaries for precise box-distance calculations (document-relative)
            b.baseCenterX = elCenterX;
            b.baseCenterY = elCenterY;
            b.baseLeft = rect.left + scrollX;
            b.baseRight = rect.right + scrollX;
            b.baseTop = rect.top + scrollY;
            b.baseBottom = rect.bottom + scrollY;
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

        const scrollX = window.scrollX || window.pageXOffset || 0;
        const scrollY = window.scrollY || window.pageYOffset || 0;

        bubbles.forEach(b => {
            let targetScale = 0; // Default target scale is 0 when not revealed
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

            // Vector from mouse to center for directional pushing (document-relative)
            const dxCenter = mouseDocX - b.baseCenterX;
            const dyCenter = mouseDocY - b.baseCenterY;
            const distanceToCenter = Math.sqrt(dxCenter * dxCenter + dyCenter * dyCenter) || 1;

            // Distance to the bounding box for precise hovering scale (document-relative)
            const dxBox = Math.max(b.baseLeft - mouseDocX, 0, mouseDocX - b.baseRight);
            const dyBox = Math.max(b.baseTop - mouseDocY, 0, mouseDocY - b.baseBottom);
            const distanceToBox = Math.sqrt(dxBox * dxBox + dyBox * dyBox);

            let targetOffsetX = b.baseOffsetX;
            let targetOffsetY = b.baseOffsetY;

            if (b.revealed) {
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
                    const nx = dxCenter / distanceToCenter;
                    const ny = dyCenter / distanceToCenter;

                    // Subtract to push AWAY from the mouse
                    targetOffsetX -= nx * pushMagnitude;
                    targetOffsetY -= ny * pushMagnitude;
                }
            }

            // Smooth responsive interpolation for scale and offsets
            b.scale += (targetScale - b.scale) * 0.22;
            b.offsetX += (targetOffsetX - b.offsetX) * 0.20;
            b.offsetY += (targetOffsetY - b.offsetY) * 0.20;

            // Apply organic offset along with the dynamic scale
            b.el.style.transform = `translate(${b.offsetX}px, ${b.offsetY}px) scale(${b.scale})`;

            // Adjust z-index based on scale so larger bubbles overlay smaller ones
            b.el.style.zIndex = Math.round(b.scale * 100);
        });

        requestAnimationFrame(render);
    }

    render();

    // ==========================================
    // ORGANIC STAGGERED ENTRANCE ANIMATION FOR HERO
    // ==========================================
    function startEntranceAnimation() {
        const leftBubbles = bubbles.filter(b => b.el.closest('.left-column'));
        const rightBubbles = bubbles.filter(b => b.el.closest('.right-column'));

        // Shuffling helper function
        function shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        // Shuffle both sides independently
        const shuffledLeft = shuffle([...leftBubbles]);
        const shuffledRight = shuffle([...rightBubbles]);

        // Combine left and right alternately to maintain visual balance during reveal
        const revealSequence = [];
        const maxLength = Math.max(shuffledLeft.length, shuffledRight.length);
        for (let i = 0; i < maxLength; i++) {
            if (i < shuffledLeft.length) revealSequence.push(shuffledLeft[i]);
            if (i < shuffledRight.length) revealSequence.push(shuffledRight[i]);
        }

        // After 1.2s delay, start revealing bubbles sequentially with 0.2s intervals
        setTimeout(() => {
            revealSequence.forEach((bubbleObj, index) => {
                setTimeout(() => {
                    bubbleObj.revealed = true;
                    bubbleObj.el.classList.add('visible');
                }, index * 200);
            });

            // The CTA button is now always visible immediately, so no delay is needed here
        }, 1200);
    }

    startEntranceAnimation();
});

