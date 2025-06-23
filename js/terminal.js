document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const terminalIcon = document.getElementById('terminal-icon');
    const terminalWindow = document.getElementById('terminal-window');
    const closeBtn = document.querySelector('.close-btn');
    const terminalContent = document.getElementById('terminal-content');
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    const logoLink = document.getElementById('logo-link');

    // Directory Configuration
    const directoryMap = {
        'Bio Artiste': 'bioartiste.html',
        'Écrits': 'ecrits.html',
        'Exclusivités Audio': 'exclu.html',
        'Québec selon Ness': 'quebecness.html',
        'studio nord (lespot)': 'https://ernieandflo-dotcom.github.io/studionord/' // Replace with actual external URL
    };

    let isTerminalActive = false;

    // Event Listeners
    terminalIcon.addEventListener('click', openTerminal);
    closeBtn.addEventListener('click', closeTerminal);
    logoLink.addEventListener('click', handleLogoClick);
    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);

    function openTerminal() {
        terminalWindow.style.display = 'block';
        body.classList.add('terminal-active');
        isTerminalActive = true;

        if (themeToggle) {
            themeToggle.disabled = true;
            themeToggle.style.opacity = '0.4';
            themeToggle.style.cursor = 'not-allowed';
        }

        removeExistingInputs();
        addNewPrompt();
    }

    function closeTerminal() {
        terminalWindow.style.display = 'none';
        body.classList.remove('terminal-active');
        isTerminalActive = false;

        if (themeToggle) {
            themeToggle.disabled = false;
            themeToggle.style.opacity = '';
            themeToggle.style.cursor = '';
        }

        removeExistingInputs();
    }

    function handleLogoClick(e) {
        if (isTerminalActive) {
            e.preventDefault();
            closeTerminal();
        }
    }

    function handleOutsideClick(e) {
        if (
            isTerminalActive &&
            !terminalWindow.contains(e.target) &&
            e.target !== terminalIcon &&
            !terminalIcon.contains(e.target)
        ) {
            closeTerminal();
        }
    }

    function handleKeyDown(e) {
        if (e.key === 'Escape' && isTerminalActive) {
            closeTerminal();
        }
    }

    function removeExistingInputs() {
        const inputs = terminalContent.querySelectorAll('.command[contenteditable]');
        inputs.forEach(el => el.removeAttribute('id'));
    }

    function addNewPrompt() {
        const prompt = document.createElement('div');
        prompt.className = 'terminal-line';
        prompt.innerHTML = `
            <span class="prompt">$</span>
            <span class="command" contenteditable="true" id="terminal-input"></span>
            <span class="cursor">|</span>
        `;
        terminalContent.appendChild(prompt);

        const input = prompt.querySelector('#terminal-input');
        input.focus();

        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const command = input.textContent.trim();
                processCommand(command);
            }
        });

        scrollToBottom();
    }

    function processCommand(command) {
        if (!command) return;

        addTerminalLine(`$ ${command}`);

        if (command.toLowerCase().startsWith('cd ')) {
            const dir = command.slice(3).trim();
            navigateToDirectory(dir);
        } else if (command.toLowerCase() === 'ls') {
            addDirectoryListing();
            addNewPrompt();
        } else if (command.toLowerCase() === 'clear') {
            terminalContent.innerHTML = '';
            addNewPrompt();
        } else {
            addTerminalOutput(`Commande non reconnue: ${command}`);
            addNewPrompt();
        }
    }

    function normalize(str) {
        return str
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, '') // remove accents
            .replace(/^cd\s+/i, '') // remove leading "cd "
            .replace(/\/$/, '') // remove trailing slash
            .trim();
    }
    
    function navigateToDirectory(rawInput) {
        const normalizedInput = normalize(rawInput);
    
        const matchKey = Object.keys(directoryMap).find(dir =>
            normalize(dir) === normalizedInput
        );
    
        if (matchKey) {
            const target = directoryMap[matchKey];
            if (target.startsWith('http')) {
                window.open(target, '_blank');
            } else {
                window.location.href = target;
            }
        } else {
            addTerminalOutput(`Dossier introuvable: ${rawInput}`);
            addNewPrompt();
        }
    }

    function addDirectoryListing() {
        const output = document.createElement('div');
        output.className = 'terminal-output';

        const entries = Object.keys(directoryMap).map(dir => {
            const isOasis = dir === 'studio nord (lespot)';
            if (isOasis) {
                return `
                    <div class="directory-entry" data-dir="${dir}">
                        <img src="assets/items/logoOasis_v0.1.png" alt="Oasis" class="emoji-icon no-invert" />
                    </div>`;
            } else {
                const formattedName = dir.split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
                return `<div class="directory-entry">cd ${formattedName}/</div>`;
            }
        }).join('');

        output.innerHTML = entries;
        terminalContent.appendChild(output);

        output.querySelectorAll('.directory-entry').forEach(entry => {
            entry.addEventListener('click', function () {
                const isOasis = this.querySelector('img');
                const dirName = isOasis
                    ? 'studio nord (lespot)'
                    : this.textContent.trim().replace('/', '').toLowerCase();
                navigateToDirectory(dirName);
            });
        });
    }

    function addTerminalLine(text) {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerHTML = `<span class="prompt">$</span> <span class="command">${text}</span>`;
        terminalContent.appendChild(line);
    }

    function addTerminalOutput(text) {
        const output = document.createElement('div');
        output.className = 'terminal-output';
        output.textContent = text;
        terminalContent.appendChild(output);
    }

    function scrollToBottom() {
        terminalContent.scrollTop = terminalContent.scrollHeight;
    }

    // Initialize terminal with default content if empty
    if (terminalContent.children.length === 0) {
        addTerminalLine('ls');
        addDirectoryListing();
    }
});
