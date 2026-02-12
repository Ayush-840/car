document.addEventListener('DOMContentLoaded', () => {
    const totalFrames = 181;
    const imagePath = 'public/images/revuelto-sequence/frame-';
    const imageExt = '.jpg';

    const imgElement = document.getElementById('car-image');
    const container = document.getElementById('sequence-wrapper');
    const loadingOverlay = document.getElementById('loading-overlay');
    const progressText = document.getElementById('progress-text');

    const images = [];
    let imagesLoaded = 0;
    let currentFrame = 1; // 1-based index to match filenames 001-181
    let isDragging = false;
    let startX = 0;
    let initialFrame = 0;

    // Sensitivity factor: distinct pixels to drag per frame change
    // Higher number = slower rotation (more pixels needed to change frame)
    const sensitivity = 5;

    // --- Preloading Images ---
    function preloadImages() {
        for (let i = 1; i <= totalFrames; i++) {
            const img = new Image();
            const frameNum = i.toString().padStart(3, '0');
            img.src = `${imagePath}${frameNum}${imageExt}`;

            img.onload = () => {
                imagesLoaded++;
                const percent = Math.round((imagesLoaded / totalFrames) * 100);
                progressText.textContent = `${percent}%`;

                if (imagesLoaded === totalFrames) {
                    setTimeout(() => {
                        loadingOverlay.classList.add('hidden');
                    }, 500);
                }
            };

            img.onerror = () => {
                console.error(`Failed to load image: ${img.src}`);
                // Still count it as handled to prevent hanging
                imagesLoaded++;
            };

            images[i] = img; // Store in array (1-indexed)
        }
    }

    // --- Interaction Logic ---
    function updateFrame(frameIndex) {
        // Ensure frameIndex is within bounds [1, totalFrames]
        // Actually, let's implement looping.

        // Efficient modulo wrapping for 1-based index
        // ((x - 1) % n + n) % n + 1 handles both positive and negative arbitrary values
        let normalizedIndex = ((frameIndex - 1) % totalFrames + totalFrames) % totalFrames + 1;

        if (normalizedIndex !== currentFrame) {
            currentFrame = normalizedIndex;
            const frameNum = currentFrame.toString().padStart(3, '0');

            // Use the preloaded image source if available, otherwise construct it
            // Using requestAnimationFrame for smoother updates is handled by the event loop naturally here
            if (images[currentFrame] && images[currentFrame].complete) {
                imgElement.src = images[currentFrame].src;
            } else {
                imgElement.src = `${imagePath}${frameNum}${imageExt}`;
            }
        }
    }

    function onPointerDown(e) {
        isDragging = true;
        // Get X position from mouse or touch
        startX = e.pageX || e.touches[0].pageX;
        initialFrame = currentFrame;
        container.style.cursor = 'grabbing';
    }

    function onPointerMove(e) {
        if (!isDragging) return;

        const x = e.pageX || e.touches[0].pageX;
        const deltaX = x - startX;

        // Calculate interaction: dragging LEFT should rotate car to RIGHT (or vice versa depending on preference)
        // Usually, dragging Left (negative delta) moves to next frames if the sequence is clockwise.
        // Let's assume the sequence is a 360 spin.
        // We divide deltaX by sensitivity to control speed.

        const frameDelta = Math.floor(deltaX / sensitivity);
        const newFrame = initialFrame - frameDelta; // Subtract interaction to "pull" the car

        updateFrame(newFrame);
    }

    function onPointerUp() {
        isDragging = false;
        container.style.cursor = 'grab';
    }

    // --- Event Listeners ---
    container.addEventListener('mousedown', onPointerDown);
    container.addEventListener('touchstart', onPointerDown);

    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('touchmove', onPointerMove);

    window.addEventListener('mouseup', onPointerUp);
    window.addEventListener('touchend', onPointerUp);

    // Prevent default drag behavior
    imgElement.addEventListener('dragstart', (e) => e.preventDefault());

    // Initialize
    preloadImages();
});
