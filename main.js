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
    } catch (e) {}
}

document.addEventListener('DOMContentLoaded', () => {
    let theme = 'light';
    try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') {
        theme = saved;
    } else {
        theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    } catch (e) {}
    applyTheme(theme);

    const overlay = document.getElementById('galleryOverlay');
    const img = document.getElementById('galleryImage');
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
});

function closeGallery() {
    const overlay = document.getElementById('galleryOverlay');
    const img = document.getElementById('galleryImage');
    overlay.classList.remove('open');
    img.src = '';
}