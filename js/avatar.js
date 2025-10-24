
    /*
    ===================================================================
    2. JAVASCRIPT LOGIC
    ===================================================================
    */
    const ANIMATION_CONFIG = {
    SMOOTH_DURATION: 600,
    INITIAL_DURATION: 1500,
    INITIAL_X_OFFSET: 70,
    INITIAL_Y_OFFSET: 60,
};

    const clamp = (value, min = 0, max = 100) => Math.min(Math.max(value, min), max);
    const round = (value, precision = 3) => parseFloat(value.toFixed(precision));
    const adjust = (value, fromMin, fromMax, toMin, toMax) =>
    round(toMin + ((toMax - toMin) * (value - fromMin)) / (fromMax - fromMin));
    const easeInOutCubic = x => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

    let rafId = null;

    const updateCardTransform = (offsetX, offsetY, card, wrap) => {
    const width = card.clientWidth;
    const height = card.clientHeight;

    const percentX = clamp((100 / width) * offsetX);
    const percentY = clamp((100 / height) * offsetY);

    const centerX = percentX - 50;
    const centerY = percentY - 50;

    const properties = {
    '--pointer-x': `${percentX}%`,
    '--pointer-y': `${percentY}%`,
    '--background-x': `${adjust(percentX, 0, 100, 35, 65)}%`,
    '--background-y': `${adjust(percentY, 0, 100, 35, 65)}%`,
    '--pointer-from-center': `${clamp(Math.hypot(percentY - 50, percentX - 50) / 50, 0, 1)}`,
    '--pointer-from-top': `${percentY / 100}`,
    '--pointer-from-left': `${percentX / 100}`,
    '--rotate-x': `${round(-(centerX / 5))}deg`,
    '--rotate-y': `${round(centerY / 4)}deg`
};

    Object.entries(properties).forEach(([property, value]) => {
    wrap.style.setProperty(property, value);
});
};

    const createSmoothAnimation = (duration, startX, startY, card, wrap) => {
    cancelAnimationFrame(rafId);

    const startTime = performance.now();
    const targetX = wrap.clientWidth / 2;
    const targetY = wrap.clientHeight / 2;

    const animationLoop = currentTime => {
    const elapsed = currentTime - startTime;
    const progress = clamp(elapsed / duration, 0, 1);
    const easedProgress = easeInOutCubic(progress);

    const currentX = adjust(easedProgress, 0, 1, startX, targetX);
    const currentY = adjust(easedProgress, 0, 1, startY, targetY);

    updateCardTransform(currentX, currentY, card, wrap);

    if (progress < 1) {
    rafId = requestAnimationFrame(animationLoop);
}
};

    rafId = requestAnimationFrame(animationLoop);
};

    // --- Main Card Initialization ---
    function createProfileCard(
    rootElementId = 'root',
    // Default avatar URL changed to a standard placeholder for reliability
    avatarUrl = '/images/avatar/Hapon.png',
    name = 'Vitalii Hapon',
    title = 'Software Developer',
    ) {
    const root = document.getElementById(rootElementId);
    if (!root) return;

    // 1. HTML Structure Injection
    const html = `
            <div class="pc-card-wrapper">
                <section class="pc-card">
                    <div class="pc-inside">
                        <div class="pc-shine"></div>
                        <div class="pc-glare"></div>
                        <div class="pc-content pc-avatar-content">
                            <img class="avatar" src="${avatarUrl}" alt="${name} avatar" loading="lazy">
                        </div>
                        <div class="pc-content">
                            <div class="pc-details">
                                <h3 class="title pricing-gradient-text">${name}</h3>
                                <p>${title}</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            `;

    root.innerHTML = html;

    // 2. Get Elements and Handlers
    const wrap = root.querySelector('.pc-card-wrapper');
    const card = root.querySelector('.pc-card');

    const handlePointerMove = (event) => {
    const rect = card.getBoundingClientRect();
    updateCardTransform(event.clientX - rect.left, event.clientY - rect.top, card, wrap);
};

    const handlePointerEnter = () => {
    cancelAnimationFrame(rafId);
    wrap.classList.add('active');
    card.classList.add('active');
};

    const handlePointerLeave = (event) => {
    createSmoothAnimation(
    ANIMATION_CONFIG.SMOOTH_DURATION,
    event.offsetX,
    event.offsetY,
    card,
    wrap
    );
    wrap.classList.remove('active');
    card.classList.remove('active');
};

    // 3. Attach Events
    card.addEventListener('pointerenter', handlePointerEnter);
    card.addEventListener('pointermove', handlePointerMove);
    card.addEventListener('pointerleave', handlePointerLeave);

    // 4. Run Initial Animation
    const initialX = wrap.clientWidth - ANIMATION_CONFIG.INITIAL_X_OFFSET;
    const initialY = ANIMATION_CONFIG.INITIAL_Y_OFFSET;

    updateCardTransform(initialX, initialY, card, wrap);
    createSmoothAnimation(ANIMATION_CONFIG.INITIAL_DURATION, initialX, initialY, card, wrap);
}

    document.addEventListener('DOMContentLoaded', () => {
    createProfileCard('root');
});
