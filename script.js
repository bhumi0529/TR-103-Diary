// ---- Day order used for Prev/Next and keyboard navigation ----
const DAY_ORDER = Array.from({ length: 21 }, (_, i) => `day${i + 1}`);
const STORAGE_KEY = 'tr103-visited-days';

function getVisited() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
        return [];
    }
}

function saveVisited(list) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) { /* storage unavailable, fail silently */ }
}

function markVisited(id) {
    const visited = getVisited();
    if (!visited.includes(id)) {
        visited.push(id);
        saveVisited(visited);
    }
    updateProgress();
    updateChipState(id);
}

function updateProgress() {
    const visited = getVisited().filter(id => DAY_ORDER.includes(id));
    const count = visited.length;
    const fill = document.getElementById('progressFill');
    const label = document.getElementById('progressCount');
    if (fill) fill.style.width = (count / DAY_ORDER.length * 100) + '%';
    if (label) label.textContent = `${count} / ${DAY_ORDER.length}`;

    document.querySelectorAll('.day-chip').forEach(chip => {
        const day = chip.dataset.day;
        chip.classList.toggle('visited', visited.includes(day));
    });
}

function updateChipState(activeId) {
    document.querySelectorAll('.day-chip').forEach(chip => {
        chip.classList.toggle('current', chip.dataset.day === activeId);
    });
}

function showSection(id) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));
    const target = document.getElementById(id);
    if (!target) return;
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (DAY_ORDER.includes(id)) {
        markVisited(id);
    } else {
        updateChipState(null);
    }
}

function goRelative(step) {
    const current = document.querySelector('.section.active');
    if (!current || !DAY_ORDER.includes(current.id)) return;
    const idx = DAY_ORDER.indexOf(current.id);
    const nextIdx = idx + step;
    if (nextIdx >= 0 && nextIdx < DAY_ORDER.length) {
        showSection(DAY_ORDER[nextIdx]);
    }
}

// ---- Keyboard navigation: Left/Right arrows flip between days ----
document.addEventListener('keydown', (e) => {
    const active = document.activeElement;
    const typing = active && (active.tagName === 'INPUT' || active.tagName === 'SELECT' || active.tagName === 'TEXTAREA');
    if (typing) return;

    if (e.key === 'ArrowRight') goRelative(1);
    if (e.key === 'ArrowLeft') goRelative(-1);
});

// ---- Populate the "Jump to an entry" dropdown ----
function populateDaySelect() {
    const select = document.getElementById('daySelect');
    if (!select) return;
    DAY_ORDER.forEach(id => {
        const section = document.getElementById(id);
        if (!section) return;
        const title = section.querySelector('h1') ? section.querySelector('h1').textContent : id;
        const option = document.createElement('option');
        option.value = id;
        option.textContent = `Day ${section.dataset.num} — ${title}`;
        select.appendChild(option);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    populateDaySelect();
    updateProgress();
});
