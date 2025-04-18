const artContainer = document.getElementById('art-container');
const clearButton = document.getElementById('clear-button');

// --- Helper Functions for Generating Random Styles ---

// Generate a random HSL color string
function getRandomHSLColor(saturationRange = [50, 100], lightnessRange = [40, 80]) {
    const hue = Math.floor(Math.random() * 360); // Hue (0-360)
    const saturation = Math.floor(Math.random() * (saturationRange[1] - saturationRange[0])) + saturationRange[0]; // Saturation (%)
    const lightness = Math.floor(Math.random() * (lightnessRange[1] - lightnessRange[0])) + lightnessRange[0]; // Lightness (%)
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

// Generate a random size for the overall SVG container
function getRandomSize() {
    return Math.floor(Math.random() * 150) + 100; // Size between 100px and 250px for the SVG element
}

// Generate a random initial transform (including scale, rotation)
function getRandomInitialTransform() {
     const scale = Math.random() * 0.4 + 0.05; // Start very small (0.05 to 0.45)
     const rotate = Math.floor(Math.random() * 1080) - 540; // Rotate up to +/- 540 degrees
     // Note: The centering translate(-50%, -50%) is handled by CSS class on the SVG
     return `scale(${scale}) rotate(${rotate}deg)`;
}

// Generate a random final transform (including scale, rotation)
function getRandomFinalTransform() {
     const scale = Math.random() * 0.5 + 0.5; // End closer to full size (0.5 to 1.0)
     const rotate = Math.floor(Math.random() * 360) - 180; // Final rotation +/- 180 degrees
     // Note: The centering translate(-50%, -50%) is handled by CSS class on the SVG
     return `translate(-50%, -50%) scale(${scale}) rotate(${rotate}deg)`;
}

// Generate a random CSS filter
function getRandomFilter() {
    if (Math.random() < 0.7) { // Increased chance of having a filter
        const filters = [];
        if (Math.random() < 0.7) filters.push(`hue-rotate(${Math.floor(Math.random() * 360)}deg)`);
        if (Math.random() < 0.5) filters.push(`blur(${Math.random() * 1.5}px)`); // Less blur for geometry
        if (Math.random() < 0.5) filters.push(`brightness(${Math.random() * 0.5 + 0.75})`); // 75% to 125%
        if (Math.random() < 0.5) filters.push(`contrast(${Math.random() * 0.5 + 0.75})`); // 75% to 125%
         if (Math.random() < 0.5) filters.push(`saturate(${Math.random() * 1 + 0.9})`); // 90% to 190%
         if (Math.random() < 0.3) filters.push(`drop-shadow(0 0 ${Math.random() * 10 + 5}px rgba(255,255,255,0.3))`); // Subtle glow effect

        return filters.length > 0 ? filters.join(' ') : 'none';
    }
    return 'none'; // No filter
}


// --- Functions to Create Sacred Geometry SVG Elements ---

// Helper to create SVG circle
function createSVGCircle(cx, cy, r, stroke, strokeWidth, fill = 'none') {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', r);
    circle.setAttribute('fill', fill);
    circle.setAttribute('stroke', stroke);
    circle.setAttribute('stroke-width', strokeWidth);
    return circle;
}

// Helper to create SVG line
function createSVGLine(x1, y1, x2, y2, stroke, strokeWidth) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', stroke);
    line.setAttribute('stroke-width', strokeWidth);
    line.setAttribute('stroke-linecap', 'round'); // Rounded ends for lines
    return line;
}


// Creates an SVG for Vesica Piscis
function createVesicaPiscisSVG(size, strokeColor) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const padding = size * 0.18; // Slightly increased padding
    const viewBoxInnerSize = size - 2 * padding; // The coordinate system size
    // For Vesica Piscis (2 circles, radius R, centers R apart), total width is 3*R.
    // To fit comfortably within viewBoxInnerSize, 3*R should be less than viewBoxInnerSize.
    // Let's aim for 3*R = viewBoxInnerSize * 0.95 to leave some margin.
    // So, R = (viewBoxInnerSize * 0.95) / 3.
    const radius = (viewBoxInnerSize * 0.95) / 3; // Adjusted radius calculation
    const offset = radius / 2; // Distance to center of each circle from viewBox center
    const viewBoxCenter = viewBoxInnerSize / 2;

    // Set viewBox to the inner drawing area, SVG size includes padding
    svg.setAttribute('viewBox', `0 0 ${viewBoxInnerSize} ${viewBoxInnerSize}`);
    svg.setAttribute('width', size); // Set actual display size including padding
    svg.setAttribute('height', size);

    // Create two overlapping circles, centered within the viewBox
    // Centers are offset by radius/2 from the viewBox center
    const circle1 = createSVGCircle(viewBoxCenter - offset, viewBoxCenter, radius, strokeColor, viewBoxInnerSize / 40);
    const circle2 = createSVGCircle(viewBoxCenter + offset, viewBoxCenter, radius, strokeColor, viewBoxInnerSize / 40);

    svg.appendChild(circle1);
    svg.appendChild(circle2);

    return svg;
}

// Creates an SVG for Egg of Life (3 circles)
function createEggOfLifeSVG(size, strokeColor) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const padding = size * 0.15;
    const viewBoxInnerSize = size - 2 * padding;
     // For Egg of Life (3 circles stacked, radius R), total height is 3*R.
    // To fit within viewBoxInnerSize, 3*R should be <= viewBoxInnerSize.
    // So, R = viewBoxInnerSize / 3.
    const radius = viewBoxInnerSize / 3;
    const viewBoxCenter = viewBoxInnerSize / 2;

    svg.setAttribute('viewBox', `0 0 ${viewBoxInnerSize} ${viewBoxInnerSize}`);
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);

    // Create three circles, vertically aligned and overlapping
    const circle1 = createSVGCircle(viewBoxCenter, viewBoxCenter - radius, radius, strokeColor, viewBoxInnerSize / 50);
    const circle2 = createSVGCircle(viewBoxCenter, viewBoxCenter, radius, strokeColor, viewBoxInnerSize / 50);
    const circle3 = createSVGCircle(viewBoxCenter, viewBoxCenter + radius, radius, strokeColor, viewBoxInnerSize / 50);


    svg.appendChild(circle1);
    svg.appendChild(circle2);
    svg.appendChild(circle3);

    return svg;
}


// Creates an SVG for Seed of Life (7 circles)
function createSeedOfLifeSVG(size, strokeColor) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const padding = size * 0.15;
    const viewBoxInnerSize = size - 2 * padding;
    // For Seed of Life (7 circles, radius R), the diameter of the whole shape is 4*R.
    // To fit within viewBoxInnerSize, 4*R should be <= viewBoxInnerSize.
    // So, R = viewBoxInnerSize / 4.
    const radius = viewBoxInnerSize / 6; // Adjusted radius calculation
    const viewBoxCenter = viewBoxInnerSize / 2;

    svg.setAttribute('viewBox', `0 0 ${viewBoxInnerSize} ${viewBoxInnerSize}`);
    svg.setAttribute('width', size); // Set actual display size including padding
    svg.setAttribute('height', size);

    // Center circle
    const centerCircle = createSVGCircle(viewBoxCenter, viewBoxCenter, radius, strokeColor, viewBoxInnerSize / 50);
    svg.appendChild(centerCircle);

    // Six surrounding circles
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const cx = viewBoxCenter + radius * Math.cos(angle);
        const cy = viewBoxCenter + radius * Math.sin(angle);
        const circle = createSVGCircle(cx, cy, radius, strokeColor, viewBoxInnerSize / 50);
        svg.appendChild(circle);
    }

    return svg;
}

// Creates an SVG for Flower of Life (more circles)
function createFlowerOfLifeSVG(size, strokeColor) {
     const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const padding = size * 0.1; // Slightly less padding for more complex shape
    const viewBoxInnerSize = size - 2 * padding;
    // For Flower of Life, the diameter is roughly 6*R (where R is the smallest circle radius).
    // To fit comfortably within viewBoxInnerSize, 6*R should be less than viewBoxInnerSize.
    // Let's aim for 6*R = viewBoxInnerSize * 0.95.
    // So, R = (viewBoxInnerSize * 0.95) / 6.
    const radius = (viewBoxInnerSize * 0.95) / 12; // Adjusted radius calculation
    const viewBoxCenter = viewBoxInnerSize / 2;

    svg.setAttribute('viewBox', `0 0 ${viewBoxInnerSize} ${viewBoxInnerSize}`);
    svg.setAttribute('width', size); // Set actual display size including padding
    svg.setAttribute('height', size);

    // Function to add a circle
    const addCircle = (cx, cy) => {
        const circle = createSVGCircle(cx, cy, radius, strokeColor, viewBoxInnerSize / 60);
        svg.appendChild(circle);
    };

    // Add center circle
    addCircle(viewBoxCenter, viewBoxCenter);

    // Add 6 circles around the center (Seed of Life)
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const cx = viewBoxCenter + radius * Math.cos(angle);
        const cy = viewBoxCenter + radius * Math.sin(angle);
        addCircle(cx, cy);
    }

    // Add the next layer of 12 circles
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const angleOffset = angle + Math.PI / 6; // 30 degrees offset
         const cx = viewBoxCenter + 2 * radius * Math.cos(angleOffset);
         const cy = viewBoxCenter + 2 * radius * Math.sin(angleOffset);
         addCircle(cx, cy);
    }

    // Add the outermost layer centers (6 points)
     for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const cx = viewBoxCenter + 3 * radius * Math.cos(angle);
        const cy = viewBoxCenter + 3 * radius * Math.sin(angle);
        addCircle(cx, cy);
     }


    return svg;
}


// Creates an SVG for Metatron's Cube (lines)
function createMetatronsCubeSVG(size, strokeColor) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const padding = size * 0.25; // Increased padding for this shape
    const viewBoxInnerSize = size - 2 * padding; // The coordinate system size
    // Metatron's Cube outermost points are at distance * 2 from center.
    // Total span is 4 * distance.
    // To fit comfortably within viewBoxInnerSize, 4 * distance should be less than viewBoxInnerSize.
    // Let's aim for 4 * distance = viewBoxInnerSize * 0.9.
    // So, distance = (viewBoxInnerSize * 0.9) / 4.
    const distance = (viewBoxInnerSize * 0.9) / 4; // Adjusted distance calculation

    const viewBoxCenter = viewBoxInnerSize / 2;


    svg.setAttribute('viewBox', `0 0 ${viewBoxInnerSize} ${viewBoxInnerSize}`);
    svg.setAttribute('width', size); // Set actual display size including padding
    svg.setAttribute('height', size);

    const points = [];

    // Center point
    points.push({ x: viewBoxCenter, y: viewBoxCenter });

    // 6 points around the center (like Seed of Life centers)
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        points.push({
            x: viewBoxCenter + distance * Math.cos(angle),
            y: viewBoxCenter + distance * Math.sin(angle)
        });
    }

    // 6 points further out (like Fruit of Life outer layer centers)
     for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 + Math.PI/6; // Offset by 30 degrees
        points.push({
            x: viewBoxCenter + distance * 2 * Math.cos(angle), // Twice the distance
            y: viewBoxCenter + distance * 2 * Math.sin(angle)
        });
    }

    // Connect all points to each other (this creates Metatron's Cube lines)
    const strokeWidth = viewBoxInnerSize / 100;
    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            const line = createSVGLine(points[i].x, points[i].y, points[j].x, points[j].y, strokeColor, strokeWidth);
            svg.appendChild(line);
        }
    }

    // Optional: Add small circles at the points
     points.forEach(p => {
         const circle = createSVGCircle(p.x, p.y, strokeWidth * 1.5, strokeColor, 0, strokeColor); // Small filled circle
         svg.appendChild(circle);
     });


    return svg;
}

// Creates an SVG for Merkaba (Star Tetrahedron outline with connecting lines)
function createMerkabaSVG(size, strokeColor) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const padding = size * 0.15;
    const viewBoxInnerSize = size - 2 * padding;
    const viewBoxCenter = viewBoxInnerSize / 2;
    // Adjust height and side calculations to fit comfortably within the viewBox
    // The height of the Merkaba outline is roughly related to the side length of the base triangles.
    // Let's set the height relative to the viewBoxInnerSize
    const height = viewBoxInnerSize * 0.7; // Reduced height multiplier from 0.8
    const side = height / Math.sqrt(3); // Side length of the triangle base

    svg.setAttribute('viewBox', `0 0 ${viewBoxInnerSize} ${viewBoxInnerSize}`);
    svg.setAttribute('width', size); // Set actual display size including padding
    svg.setAttribute('height', size);

    const strokeWidth = viewBoxInnerSize / 60;

    // Define points for the two overlapping triangles
    // Upward pointing triangle
    const p1_up = { x: viewBoxCenter, y: viewBoxCenter - height/2 };
    const p2_up = { x: viewBoxCenter - side/2, y: viewBoxCenter + height/2 - (height * 1/3) }; // Adjusted Y to make it interlock
    const p3_up = { x: viewBoxCenter + side/2, y: viewBoxCenter + height/2 - (height * 1/3) }; // Adjusted Y

    // Downward pointing triangle
     const p1_down = { x: viewBoxCenter, y: viewBoxCenter + height/2 };
     const p2_down = { x: viewBoxCenter - side/2, y: viewBoxCenter - height/2 + (height * 1/3) }; // Adjusted Y
     const p3_down = { x: viewBoxCenter + side/2, y: viewBoxCenter - height/2 + (height * 1/3) }; // Adjusted Y


    // Create paths for the triangles
    const pathUp = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathUp.setAttribute('d', `M ${p1_up.x},${p1_up.y} L ${p2_up.x},${p2_up.y} L ${p3_up.x},${p3_up.y} Z`); // M=move to, L=line to, Z=close path
    pathUp.setAttribute('fill', 'none');
    pathUp.setAttribute('stroke', strokeColor);
    pathUp.setAttribute('stroke-width', strokeWidth);

    const pathDown = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathDown.setAttribute('d', `M ${p1_down.x},${p1_down.y} L ${p2_down.x},${p2_down.y} L ${p3_down.x},${p3_down.y} Z`);
    pathDown.setAttribute('fill', 'none');
    pathDown.setAttribute('stroke', strokeColor);
    pathDown.setAttribute('stroke-width', strokeWidth);

     // Add connecting lines for the 3D effect
    const line1 = createSVGLine(p1_up.x, p1_up.y, p2_down.x, p2_down.y, strokeColor, strokeWidth);
    const line2 = createSVGLine(p1_up.x, p1_up.y, p3_down.x, p3_down.y, strokeColor, strokeWidth);
    const line3 = createSVGLine(p2_up.x, p2_up.y, p1_down.x, p1_down.y, strokeColor, strokeWidth);
    const line4 = createSVGLine(p3_up.x, p3_up.y, p1_down.x, p1_down.y, strokeColor, strokeWidth);
    const line5 = createSVGLine(p2_up.x, p2_up.y, p2_down.x, p2_down.y, strokeColor, strokeWidth); // Base line 1
    const line6 = createSVGLine(p3_up.x, p3_up.y, p3_down.x, p3_down.y, strokeColor, strokeWidth); // Base line 2
    const line7 = createSVGLine(p2_down.x, p2_down.y, p3_down.x, p3_down.y, strokeColor, strokeWidth); // Base line 3


    svg.appendChild(pathUp);
    svg.appendChild(pathDown);
    svg.appendChild(line1);
    svg.appendChild(line2);
    svg.appendChild(line3);
    svg.appendChild(line4);
    svg.appendChild(line5);
    svg.appendChild(line6);
    svg.appendChild(line7);


    return svg;
}


// --- Event Listener for Clicks ---

artContainer.addEventListener('click', (event) => {
    // Get click coordinates relative to the container
    const containerRect = artContainer.getBoundingClientRect();
    const clickX = event.clientX - containerRect.left;
    const clickY = event.clientY - containerRect.top;

    // Choose a random Sacred Geometry shape function
    const shapeFunctions = [
        createVesicaPiscisSVG,
        createEggOfLifeSVG,
        createSeedOfLifeSVG,
        createFlowerOfLifeSVG,
        createMerkabaSVG,
        createMetatronsCubeSVG
    ];
    const randomShapeFunction = shapeFunctions[Math.floor(Math.random() * shapeFunctions.length)];

    // Generate random properties
    const size = getRandomSize();
    const strokeColor = getRandomHSLColor([70, 100], [60, 90]); // Brighter colors for strokes
    const initialTransform = getRandomInitialTransform();
    const finalTransform = getRandomFinalTransform();
    const filter = getRandomFilter();

    // Create the SVG element using the chosen function
    const svgElement = randomShapeFunction(size, strokeColor);

    // Add the common class for styling and positioning
    svgElement.classList.add('art-element');

    // Set the initial position based on the click
    // We position the SVG container, and the CSS transform handles centering
    svgElement.style.left = `${clickX}px`;
    svgElement.style.top = `${clickY}px`;

    // Apply common random styles to the SVG container
    svgElement.style.filter = filter;
    // Note: Box shadow on SVG can be tricky, skipping for now or requires filter effects/CSS on container
    // svgElement.style.boxShadow = getRandomBoxShadow(); // Box shadow might not apply well directly to SVG contents

    // Set initial state (opacity and transform)
    svgElement.style.opacity = 0; // Start invisible
    svgElement.style.transform = initialTransform;


    // Add the SVG element to the container
    artContainer.appendChild(svgElement);

    // --- Animate to Final State ---
    // Use a small delay to allow the element to be added to the DOM before transitioning
    setTimeout(() => {
        svgElement.style.opacity = Math.random() * 0.5 + 0.4; // Fade in to a random opacity (0.4 to 0.9)
        svgElement.style.transform = finalTransform;
        // Add a random transition delay to make animations less synchronized
        svgElement.style.transitionDelay = `${Math.random() * 0.5}s`; // Delay between 0 and 0.5 seconds
    }, 50); // Small delay (50ms)

    // --- Make elements fade out over time ---
    const fadeOutDelay = Math.random() * 8000 + 6000; // Fade out after 6 to 14 seconds
    setTimeout(() => {
        svgElement.style.opacity = 0; // Start fading out
        // Optionally change transform again as it fades
         svgElement.style.transform += ' scale(0.7)'; // Shrink slightly as it fades
    }, fadeOutDelay);

    // --- Remove element after it fades out ---
    const removeDelay = fadeOutDelay + 2000; // Remove after fade out transition (1.5s) + buffer
     setTimeout(() => {
         svgElement.remove(); // Remove the element from the DOM
     }, removeDelay);


});

// --- Event Listener for Clear Button ---
clearButton.addEventListener('click', () => {
    // Select all art elements (which are now SVGs) and remove them with a slight delay
    const elements = artContainer.querySelectorAll('.art-element');
    elements.forEach((el, index) => {
        setTimeout(() => {
            el.style.opacity = 0;
            el.style.transform += ' scale(0.5)'; // Shrink as they disappear
        }, index * 30); // Stagger the removal slightly (increased delay slightly)

        // Remove from DOM after transition
        setTimeout(() => {
            el.remove();
        }, index * 30 + 1500); // Match the transition time
    });
});

