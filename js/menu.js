document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const menuButton = document.getElementById('menu-button');
    const menuContainer = menuButton?.closest('.menu-container');
    const themeToggle = document.getElementById('theme-toggle');
    const dropdown = document.getElementById('menu-dropdown');

    // Abort if core elements are missing
    if (!menuButton || !menuContainer || !dropdown) return;

    // State
    let isMenuOpen = false;

    // Apply saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
    }

    updateThemeToggleText();

    // Event Listeners
    menuButton.addEventListener('click', handleMenuButtonClick);
    document.addEventListener('click', handleDocumentClick);
    themeToggle?.addEventListener('click', toggleTheme);

    // Event Handlers
    function handleMenuButtonClick(e) {
        e.stopPropagation();
        toggleMenu();
    }

    function handleDocumentClick() {
        if (isMenuOpen) closeMenu();
    }

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        menuContainer.classList.toggle('active');
        menuButton.setAttribute('aria-expanded', isMenuOpen.toString());
    }

    function closeMenu() {
        isMenuOpen = false;
        menuContainer.classList.remove('active');
        menuButton.setAttribute('aria-expanded', 'false');
    }

    function toggleTheme() {
        const isNowLight = document.body.classList.toggle('light-theme');
        localStorage.setItem('theme', isNowLight ? 'light' : 'dark');
        updateThemeToggleText();
        closeMenu();

        // Force video reload to prevent rendering artifacts
        document.querySelectorAll('.coming-soon-video video').forEach(video => {
            video.style.display = 'none';
            setTimeout(() => {
            video.style.display = 'block';
            }, 50);
        });
    }

    function updateThemeToggleText() {
        if (!themeToggle) return;
        const isLight = document.body.classList.contains('light-theme');
        themeToggle.innerHTML = isLight
            ? '<span aria-hidden="true">🌙</span> Thème sombre'
            : '<span aria-hidden="true">☀️</span> Thème clair';
        themeToggle.setAttribute(
            'aria-label',
            isLight ? 'Passer en mode sombre' : 'Passer en mode clair'
        );
    }

    // Keyboard navigation in dropdown
    dropdown.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMenu();
            menuButton.focus();
        }

        if (e.key === 'Tab' && isMenuOpen) {
            const focusable = dropdown.querySelectorAll('a, button');
            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (e.shiftKey && document.activeElement === first) {
                last.focus();
                e.preventDefault();
            } else if (!e.shiftKey && document.activeElement === last) {
                first.focus();
                e.preventDefault();
            }
        }
    });

    // Accessibility setup
    menuButton.setAttribute('aria-haspopup', 'true');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-controls', 'menu-dropdown');
});
