document.addEventListener('DOMContentLoaded', () => {
    const ball = document.getElementById('ball');
    const svgContainer = document.querySelector('.animation-container');
    const instructionText = document.getElementById('breathing-instruction');

    // Create a dynamic SVG path element
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("id", "breathing-path");
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.setAttribute("preserveAspectRatio", "none");
    svg.appendChild(path);
    svgContainer.appendChild(svg);
    
    // Animation parameters
    const totalCycles = 3;
    const inhaleDuration = 3000;
    const exhaleDuration = 3000;
    const cycleDuration = inhaleDuration + exhaleDuration;
    const pathWidth = 100;
    const pathHeight = 100;
    const chaosLevel = 10;

    let currentCycle = 0;
    let isChaotic = false;
    let lastPoint = null;

    // Example quotes array
    const quotes = [
        "Breathe out stress, breathe in peace.",
        "Let go and relax.",
        "Release what you cannot control.",
        "Exhale tension, inhale calm.",
        "Every breath is a new beginning."
    ];

    function generatePath() {
        let d = "M0 " + pathHeight / 2;
        
        if (!isChaotic) {
            // Sine wave path
            for (let i = 0; i <= totalCycles; i++) {
                const startX = i * (pathWidth / totalCycles);
                d += S${startX + (pathWidth / totalCycles) * 0.25} ${pathHeight * 0.1}, ${startX + (pathWidth / totalCycles) * 0.5} ${pathHeight / 2};
                d += S${startX + (pathWidth / totalCycles) * 0.75} ${pathHeight * 0.9}, ${startX + (pathWidth / totalCycles)} ${pathHeight / 2};
            }
        } else {
            // Chaotic path
            let x = 0;
            let y = pathHeight / 2;
            d = M${x} ${y};
            
            for (let i = 0; i < 50; i++) {
                x += pathWidth / 50;
                y += (Math.random() - 0.5) * chaosLevel;
                y = Math.min(Math.max(y, 10), pathHeight - 10);
                d += L${x.toFixed(2)} ${y.toFixed(2)};
            }
        }
        
        path.setAttribute("d", d);
        return path.getTotalLength();
    }

    function animatePath() {
        let pathLength = generatePath();
        let startTime = null;

        function step(timestamp) {
            if (!startTime) {
                startTime = timestamp;
            }

            const elapsedTime = timestamp - startTime;
            let instruction;
            let currentPathLength;

            if (isChaotic) {
                const duration = 10000;
                const progress = Math.min(elapsedTime / duration, 1);
                currentPathLength = progress * pathLength;
                instruction = "FOLLOW THE CHAOS";
                instructionText.textContent = instruction;
                
                if (progress >= 1) {
                    return; // End animation
                }
            } else {
                const progress = (elapsedTime % cycleDuration) / cycleDuration;
                
                if (progress < (inhaleDuration / cycleDuration)) {
                    instruction = "BREATHE IN";
                } else {
                    instruction = "BREATHE OUT";
                }

                currentPathLength = (currentCycle * (pathLength / totalCycles)) + (progress * (pathLength / totalCycles));
                instructionText.textContent = instruction;
                
                if (elapsedTime >= (currentCycle + 1) * cycleDuration) {
                    currentCycle++;
                    if (currentCycle >= totalCycles) {
                        isChaotic = true;
                        animatePath();
                        return;
                    }
                }
            }
            
            const point = path.getPointAtLength(currentPathLength);
            
            // Get the previous point to calculate the angle for the trail
            let angle = 0;
            if (lastPoint) {
                angle = Math.atan2(point.y - lastPoint.y, point.x - lastPoint.x) * 180 / Math.PI;
            }
            
            ball.style.left = point.x + 'px';
            ball.style.top = point.y + 'px';
            ball.style.transform = translate(-50%, -50%) rotate(${angle}deg);
            
            lastPoint = point;
            
            window.requestAnimationFrame(step);
        }

        const startPoint = path.getPointAtLength(0);
        ball.style.left = startPoint.x + 'px';
        ball.style.top = startPoint.y + 'px';
        
        window.requestAnimationFrame(step);
    }
    
    // Function to show a random quote
    function showRandomQuote() {
        const quoteEl = document.getElementById('breathing-quote');
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        quoteEl.textContent = randomQuote;
        quoteEl.style.opacity = 1;
    }

    // Function to hide the quote
    function hideQuote() {
        const quoteEl = document.getElementById('breathing-quote');
        quoteEl.style.opacity = 0;
    }

    // Call showRandomQuote() when breathing out starts
    function startBreathingOut() {
        // ...existing code for breathing out...
        showRandomQuote();
    }

    // Call hideQuote() when breathing in starts or at the end of the cycle
    function startBreathingIn() {
        // ...existing code for breathing in...
        hideQuote();
    }

    function generateRandomWavePath(width = 300, height = 300, waves = 3, points = 8) {
        let path = `M 0 ${height / 2}`;
        const step = width / (points - 1);
        for (let i = 1; i < points; i++) {
            // Randomize amplitude and direction for each segment
            const amplitude = (Math.random() * 0.4 + 0.3) * (height / 2);
            const direction = i % 2 === 0 ? 1 : -1;
            const y = height / 2 + direction * amplitude;
            path += ` Q ${step * (i - 0.5)} ${y}, ${step * i} ${height / 2}`;
        }
        return path;
    }

    function setRandomWavePath() {
        const svg = document.querySelector('svg');
        const path = document.getElementById('breathing-path');
        const width = svg.clientWidth;
        const height = svg.clientHeight;
        path.setAttribute('d', generateRandomWavePath(width, height));
    }

    // Call this once on page load and whenever you want a new wave
    setRandomWavePath();

    animatePath();
});