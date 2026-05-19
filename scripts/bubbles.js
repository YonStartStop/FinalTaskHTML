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
});
