document.addEventListener('DOMContentLoaded', () => {
    const bg = document.getElementById('binary-bg');
    const columnCount = Math.floor(window.innerWidth / 20); // Responsive column count

    function createColumn() {
        const column = document.createElement('div');
        column.className = 'binary-column';

        // Randomize horizontal position
        column.style.left = Math.random() * 100 + 'vw';

        // Randomize animation duration and delay for a natural look
        const duration = 10 + Math.random() * 15;
        const delay = Math.random() * -20; // Negative delay to start mid-animation
        column.style.animationDuration = duration + 's';
        column.style.animationDelay = delay + 's';

        // Randomize opacity a bit more
        column.style.opacity = 0.1 + Math.random() * 0.3;

        // Generate binary string
        let content = '';
        const rows = Math.floor(window.innerHeight / 10);
        for (let i = 0; i < rows; i++) {
            content += Math.round(Math.random()) + '\n';
        }
        column.innerText = content;

        bg.appendChild(column);

        // Remove and recreate column after animation to keep it fresh (optional, but good for long sessions)
        setTimeout(() => {
            column.remove();
            createColumn();
        }, (duration + delay) * 1000);
    }

    for (let i = 0; i < columnCount; i++) {
        setTimeout(createColumn, i * 50); // Stagger initial creation
    }

    // Handle resizing
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            bg.innerHTML = '';
            const newColumnCount = Math.floor(window.innerWidth / 20);
            for (let i = 0; i < newColumnCount; i++) {
                createColumn();
            }
        }, 250);
    });
});
