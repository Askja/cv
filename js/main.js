const themeIcon = document.getElementById('theme-icon');
const themeLabel = document.getElementById('theme-label');
const THEME_KEY = 'page-theme';

function applyTheme(theme) {
    const body = document.body;
    if (theme === 'dark') {
        body.classList.add('dark-theme');
        themeIcon.className = 'ms-Icon ms-Icon--ClearNight';
        themeLabel.textContent = 'Тёмная';
    } else {
        body.classList.remove('dark-theme');
        themeIcon.className = 'ms-Icon ms-Icon--Sunny';
        themeLabel.textContent = 'Светлая';
    }
}

function toggleTheme() {
    const isDark = document.body.classList.contains('dark-theme');
    const next = isDark ? 'light' : 'dark';
    applyTheme(next);
    try {
        localStorage.setItem(THEME_KEY, next);
    } catch (e) {
    }
}

function initCodeSamples() {
    const select = document.getElementById('codeSampleSelect');
    const blocks = Array.from(document.querySelectorAll('.code-block'));

    if (!select || !blocks.length) {
        return;
    }

    function updateVisible(key) {
        blocks.forEach(block => {
            if (block.dataset.key === key) {
                block.classList.add('active');
            } else {
                block.classList.remove('active');
            }
        });
    }

    select.addEventListener('change', (e) => {
        updateVisible(e.target.value);
    });

    updateVisible(select.value);

    if (window.hljs) {
        document.querySelectorAll('pre.code-block code').forEach(el => {
            hljs.highlightElement(el);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    let theme = 'light';
    try {
        const saved = localStorage.getItem(THEME_KEY);
        if (saved === 'light' || saved === 'dark') {
            theme = saved;
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            theme = 'dark';
        }
    } catch (e) {
    }
    applyTheme(theme);

    const overlay = document.getElementById('galleryOverlay');
    const img = document.getElementById('galleryImage');

    if (overlay && img) {
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('click', () => {
                const src = card.getAttribute('data-image');
                if (src) {
                    img.src = src;
                    overlay.classList.add('open');
                }
            });
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeGallery();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeGallery();
            }
        });
    }

    initCodeSamples();
});

function closeGallery() {
    const overlay = document.getElementById('galleryOverlay');
    const img = document.getElementById('galleryImage');
    if (!overlay || !img) return;
    overlay.classList.remove('open');
    img.src = '';
}