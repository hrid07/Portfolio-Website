document.addEventListener('DOMContentLoaded', () => {
    const bg = document.getElementById('binary-bg');
    const columnCount = Math.floor(window.innerWidth / 20); 

    function createColumn() {
        const column = document.createElement('div');
        column.className = 'binary-column';

        
        column.style.left = Math.random() * 100 + 'vw';

        
        const duration = 10 + Math.random() * 15;
        const delay = Math.random() * -20; 
        column.style.animationDuration = duration + 's';
        column.style.animationDelay = delay + 's';

      
        column.style.opacity = 0.1 + Math.random() * 0.3;

       
        let content = '';
        const rows = Math.floor(window.innerHeight / 10);
        for (let i = 0; i < rows; i++) {
            content += Math.round(Math.random()) + '\n';
        }
        column.innerText = content;

        bg.appendChild(column);

        
        setTimeout(() => {
            column.remove();
            createColumn();
        }, (duration + delay) * 1000);
    }

    for (let i = 0; i < columnCount; i++) {
        setTimeout(createColumn, i * 50); 
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
