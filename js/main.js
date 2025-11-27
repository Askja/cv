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
    initExportButtons();
});

function closeGallery() {
    const overlay = document.getElementById('galleryOverlay');
    const img = document.getElementById('galleryImage');
    if (!overlay || !img) return;
    overlay.classList.remove('open');
    img.src = '';
}

function initExportButtons() {
    const pdfButton = document.querySelector('[data-export="pdf"]');
    const docxButton = document.querySelector('[data-export="docx"]');

    if (pdfButton) {
        pdfButton.addEventListener('click', downloadPdf);
    }

    if (docxButton) {
        docxButton.addEventListener('click', downloadDocx);
    }
}

function getResumeContent() {
    return document.getElementById('resumeContent');
}

function downloadPdf() {
    if (typeof window.html2pdf === 'undefined') {
        return;
    }

    const content = getResumeContent();
    if (!content) {
        return;
    }

    const options = {
        margin: 0.5,
        filename: 'egor-amiral-resume.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    window.html2pdf().set(options).from(content).save();
}

function downloadDocx() {
    if (typeof window.htmlDocx === 'undefined') {
        return;
    }

    const content = getResumeContent();
    if (!content) {
        return;
    }

    const styles = collectStylesForDocx();
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>${styles}</style></head><body>${content.innerHTML}</body></html>`;

    const blob = window.htmlDocx.asBlob(html);
    triggerDownload(blob, 'egor-amiral-resume.docx');
}

function collectStylesForDocx() {
    let styles = '';
    Array.from(document.styleSheets).forEach(sheet => {
        try {
            Array.from(sheet.cssRules || []).forEach(rule => {
                styles += rule.cssText;
            });
        } catch (e) {
        }
    });
    return styles;
}

function triggerDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
}
