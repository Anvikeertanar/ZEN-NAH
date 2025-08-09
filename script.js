document.addEventListener('DOMContentLoaded', () => {
    const ball = document.getElementById('ball');
    const path = document.getElementById('breathing-path');
    const instructionText = document.getElementById('breathing-instruction');
    
    // Get the length of the SVG path
    const pathLength = path.getTotalLength();
    
    // Define the phases and their durations in milliseconds
    const inhaleDuration = 4000;  // Breathe in (ball goes up)
    const holdDuration = 2000;    // Hold (ball is stable)
    const exhaleDuration = 4000;  // Breathe out (ball goes down)
    const totalDuration = inhaleDuration + holdDuration + exhaleDuration;

    function animateBreathing() {
        let startTime = null;

        function step(timestamp) {
            if (!startTime) {
                startTime = timestamp;
            }

            const elapsedTime = timestamp - startTime;
            const progress = (elapsedTime % totalDuration) / totalDuration;
            
            let currentPathLength;
            let instruction;

            // Determine the current phase and update the ball's position and text
            if (progress < (inhaleDuration / totalDuration)) {
                // Inhale phase: 0% to ~40% of cycle
                instruction = "BREATHE IN";
                const inhaleProgress = progress / (inhaleDuration / totalDuration);
                currentPathLength = inhaleProgress * (pathLength / 2);
            } else if (progress < ((inhaleDuration + holdDuration) / totalDuration)) {
                // Hold phase: ~40% to ~60% of cycle
                instruction = "HOLD";
                currentPathLength = pathLength / 2;
            } else {
                // Exhale phase: ~60% to 100% of cycle
                instruction = "BREATHE OUT";
                const exhaleProgress = (progress - (inhaleDuration + holdDuration) / totalDuration) / (exhaleDuration / totalDuration);
                currentPathLength = (pathLength / 2) + (exhaleProgress * (pathLength / 2));
            }
            
            // Get the coordinates from the SVG path
            const point = path.getPointAtLength(currentPathLength);
            
            // Update the ball's position
            ball.style.left = point.x + 'px';
            ball.style.top = point.y + 'px';
            
            // Update the instruction text
            instructionText.textContent = instruction;
            
            window.requestAnimationFrame(step);
        }

        window.requestAnimationFrame(step);
    }
    
    // Set the initial state of the ball at the start of the path
    const startPoint = path.getPointAtLength(0);
    ball.style.left = startPoint.x + 'px';
    ball.style.top = startPoint.y + 'px';
    
    // Start the animation
    animateBreathing();
});
