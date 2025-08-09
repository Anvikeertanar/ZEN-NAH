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
        "Every breath is a new beginning.",
        "Let your thoughts drift away.",
        "Calm is a superpower.",
        "You are here, you are now.",
        "Peace begins with a single breath."
    ];

    // Breathing parameters
    const inhaleDuration = 3000;
    const exhaleDuration = 3000;
    const cycleDuration = inhaleDuration + exhaleDuration;
    const pathWidth = 100;
    const pathHeight = 100;
    const chaosLevel = 10;

    let currentCycle = 0;
    let isChaotic = false;
    let lastPoint = null;

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
                const angle = Math.atan2(point.y - lastPoint.y, point.x - lastPoint.x) * 180 / Math.PI;
                ball.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
            }

            lastPoint = point;

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                callback();
            }
        }

        window.requestAnimationFrame(step);
    }
    
    animatePath();
});