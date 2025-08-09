document.addEventListener('DOMContentLoaded', () => {
    const ball = document.getElementById('ball');
    const svgContainer = document.querySelector('.animation-container');
    const instructionText = document.getElementById('breathing-instruction');
    const quoteEl = document.getElementById('breathing-quote');

    // SVG setup
    const svgSize = 300;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", svgSize);
    svg.setAttribute("height", svgSize);
    svg.setAttribute("viewBox", `0 0 ${svgSize} ${svgSize}`);
    svg.setAttribute("preserveAspectRatio", "none");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("id", "breathing-path");
    svg.appendChild(path);
    svgContainer.appendChild(svg);

    // Quotes
    const quotes = [
        "Breathe out stress, breathe in peace.",
        "Let go and relax.",
        "Release what you cannot control.",
        "Exhale tension, inhale calm.",
        "Every breath is a new beginning."
    ];

    // Breathing parameters
    const inhaleDuration = 3000;
    const exhaleDuration = 3000;
    const totalCycles = 3;
    let currentCycle = 0;

    // Generate a random sine-like wave path
    function generateRandomWavePath(width = svgSize, height = svgSize, points = 100) {
        // Randomize amplitude and frequency for each cycle
        const amplitude = (Math.random() * 0.3 + 0.2) * (height / 2); // 20% to 50% of half height
        const frequency = Math.random() * 2 + 1; // 1 to 3 full sine waves
        const phase = Math.random() * Math.PI * 2; // random phase shift

        let d = `M 0 ${height / 2}`;
        for (let i = 1; i <= points; i++) {
            const x = (i / points) * width;
            // Sine wave with random amplitude, frequency, and phase
            const y = height / 2 + Math.sin(frequency * (i / points) * Math.PI * 2 + phase) * amplitude;
            d += ` L ${x} ${y}`;
        }
        return d;
    }

    // Show/hide quote
    function showRandomQuote() {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        quoteEl.textContent = randomQuote;
        quoteEl.style.opacity = 1;
    }
    function hideQuote() {
        quoteEl.style.opacity = 0;
    }

    // Animate ball along path
    function animateBreathingCycle() {
        // Generate new path for each cycle
        const d = generateRandomWavePath();
        path.setAttribute('d', d);
        const pathLength = path.getTotalLength();

        // Inhale
        instructionText.textContent = "BREATHE IN";
        hideQuote();
        animateBall(0, pathLength, inhaleDuration, () => {
            // Exhale
            instructionText.textContent = "BREATHE OUT";
            showRandomQuote();
            animateBall(pathLength, 0, exhaleDuration, () => {
                currentCycle++;
                if (currentCycle < totalCycles) {
                    animateBreathingCycle();
                } else {
                    instructionText.textContent = "SESSION COMPLETE";
                    hideQuote();
                }
            });
        });
    }

    // Animate ball from startLen to endLen over duration ms
    function animateBall(startLen, endLen, duration, callback) {
        const startTime = performance.now();
        function step(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentLen = startLen + (endLen - startLen) * progress;
            const point = path.getPointAtLength(currentLen);

            // Position the ball (SVG and container are same size)
            ball.style.left = `${point.x}px`;
            ball.style.top = `${point.y}px`;

            // Angle for trail (optional)
            // (not implemented here for simplicity)

            if (progress < 1) {
                requestAnimationFrame(step);
            } else if (callback) {
                callback();
            }
        }
        requestAnimationFrame(step);
    }

    // Start breathing cycles
    currentCycle = 0;
    animateBreathingCycle();
});