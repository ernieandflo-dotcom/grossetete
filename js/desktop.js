document.addEventListener('DOMContentLoaded', () => {
    const desktop = document.querySelector('.desktop-icons');
    const projectIcon = document.getElementById('project-icon');
    const terminalIcon = document.getElementById('terminal-icon');

    function positionIcons() {
        if (!desktop || !projectIcon || !terminalIcon) return;

        const desktopWidth = desktop.offsetWidth;
        const desktopHeight = desktop.offsetHeight;

        const cols = 4;
        const rows = 4;

        const cellWidth = desktopWidth / cols;
        const cellHeight = desktopHeight / rows;

        const isMobile = window.innerWidth <= 768;

        if (isMobile) {
            setPosition(projectIcon, 1, 0.5, cellWidth, cellHeight);
            setPosition(terminalIcon, 2.5, 2.5, cellWidth, cellHeight);
        } else {
            setPosition(projectIcon, 1.5, 1.5, cellWidth, cellHeight);
            setPosition(terminalIcon, 2.5, 2.5, cellWidth, cellHeight);
        }
    }

    function setPosition(element, col, row, cellW, cellH) {
        element.style.left = `${col * cellW}px`;
        element.style.top = `${row * cellH}px`;
    }

    window.addEventListener('resize', positionIcons);
    positionIcons(); // Initial run

    // 🎧 Gérer les icônes audio cliquables
    const toggleIcons = document.querySelectorAll('.toggle-audio');

    toggleIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            const parent = icon.closest('.audio-icon');
            const player = parent.querySelector('.audio-player');
            if (player) {
                player.style.display = 'block';
                player.play(); // facultatif
            }
        });
    });
});
