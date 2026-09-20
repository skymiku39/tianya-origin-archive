const body = document.body;
const topbar = document.querySelector('.topbar');
const progress = document.querySelector('.reading-progress span');
const bootDialog = document.querySelector('.boot-dialog');
const terminalLines = [...document.querySelectorAll('.terminal-line')];
const navLinks = [...document.querySelectorAll('.topbar nav a')];
let bootTimers = [];

function updatePageState() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progress.style.width = `${percent}%`;
  topbar.classList.toggle('scrolled', window.scrollY > 36);
}

function showBootSequence() {
  bootTimers.forEach(clearTimeout);
  bootTimers = [];
  terminalLines.forEach((line) => line.classList.remove('visible'));
  if (!bootDialog.open) bootDialog.showModal();
  body.classList.add('modal-open');

  terminalLines.forEach((line, index) => {
    bootTimers.push(setTimeout(() => line.classList.add('visible'), 180 + index * 360));
  });
}

function closeBootSequence() {
  bootTimers.forEach(clearTimeout);
  bootTimers = [];
  if (bootDialog.open) bootDialog.close();
  body.classList.remove('modal-open');
}

document.querySelectorAll('[data-boot-open]').forEach((button) => {
  button.addEventListener('click', showBootSequence);
});

document.querySelectorAll('[data-boot-close]').forEach((button) => {
  button.addEventListener('click', closeBootSequence);
});

bootDialog.addEventListener('click', (event) => {
  if (event.target === bootDialog) closeBootSequence();
});

bootDialog.addEventListener('cancel', () => {
  body.classList.remove('modal-open');
});

document.querySelectorAll('.core-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.core;
    document.querySelectorAll('.core-tab').forEach((item) => {
      const active = item === tab;
      item.classList.toggle('active', active);
      item.setAttribute('aria-selected', String(active));
    });

    document.querySelectorAll('.core-panel').forEach((panel) => {
      const active = panel.id === `panel-${target}`;
      panel.classList.toggle('active', active);
      panel.hidden = !active;
    });
  });
});

document.querySelectorAll('.timeline-trigger').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const expanded = trigger.getAttribute('aria-expanded') === 'true';

    document.querySelectorAll('.timeline-trigger').forEach((item) => {
      item.setAttribute('aria-expanded', 'false');
      item.nextElementSibling.hidden = true;
    });

    if (!expanded) {
      trigger.setAttribute('aria-expanded', 'true');
      trigger.nextElementSibling.hidden = false;
    }
  });
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${visible.target.id}`);
    });
  },
  { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.2, 0.5] }
);

document.querySelectorAll('#dossier, #architecture, #history, #reconstruction').forEach((section) => {
  sectionObserver.observe(section);
});

window.addEventListener('scroll', updatePageState, { passive: true });
window.addEventListener('resize', updatePageState);
updatePageState();
