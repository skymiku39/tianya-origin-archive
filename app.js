const body = document.body;
const topbar = document.querySelector('.topbar');
const progress = document.querySelector('.reading-progress span');
const bootDialog = document.querySelector('.boot-dialog');
const terminalLines = [...document.querySelectorAll('.terminal-line')];
const navLinks = [...document.querySelectorAll('.topbar nav a')];
const sections = navLinks.map((link) => document.querySelector(link.getAttribute('href')));
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let bootTimers = [];

function updatePageState() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progress.style.width = `${percent}%`;
  topbar.classList.toggle('scrolled', window.scrollY > 36);

  const readingLine = window.innerHeight * 0.36;
  const currentSection = sections.find((section) => {
    const bounds = section.getBoundingClientRect();
    return bounds.top <= readingLine && bounds.bottom > readingLine;
  });

  navLinks.forEach((link) => {
    const current = currentSection && link.getAttribute('href') === `#${currentSection.id}`;
    link.classList.toggle('active', Boolean(current));
    if (current) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}

function showBootSequence() {
  bootTimers.forEach(clearTimeout);
  bootTimers = [];
  terminalLines.forEach((line) => line.classList.remove('visible'));
  if (!bootDialog.open) bootDialog.showModal();
  body.classList.add('modal-open');

  terminalLines.forEach((line, index) => {
    if (reducedMotion.matches) line.classList.add('visible');
    else bootTimers.push(setTimeout(() => line.classList.add('visible'), 180 + index * 360));
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

bootDialog.addEventListener('close', () => {
  bootTimers.forEach(clearTimeout);
  bootTimers = [];
  body.classList.remove('modal-open');
});

const coreTabList = document.querySelector('.core-tabs');
const coreTabs = [...document.querySelectorAll('.core-tab')];
const corePanels = [...document.querySelectorAll('.core-panel')];
const compactCoreTabs = window.matchMedia('(max-width: 760px)');

function updateCoreTabOrientation() {
  coreTabList.setAttribute('aria-orientation', compactCoreTabs.matches ? 'horizontal' : 'vertical');
}

function activateCoreTab(selectedTab, moveFocus = false) {
  const target = selectedTab.dataset.core;

  coreTabs.forEach((tab) => {
    const active = tab === selectedTab;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
  });

  corePanels.forEach((panel) => {
    const active = panel.id === `panel-${target}`;
    panel.classList.toggle('active', active);
    panel.hidden = !active;
  });

  if (moveFocus) selectedTab.focus();
}

coreTabs.forEach((tab) => {
  tab.addEventListener('click', () => activateCoreTab(tab));
});

coreTabList.addEventListener('keydown', (event) => {
  const activeIndex = coreTabs.indexOf(document.activeElement);
  if (activeIndex < 0) return;

  const forwardKey = compactCoreTabs.matches ? 'ArrowRight' : 'ArrowDown';
  const backwardKey = compactCoreTabs.matches ? 'ArrowLeft' : 'ArrowUp';
  let nextIndex = null;

  if (event.key === forwardKey) nextIndex = (activeIndex + 1) % coreTabs.length;
  if (event.key === backwardKey) nextIndex = (activeIndex - 1 + coreTabs.length) % coreTabs.length;
  if (event.key === 'Home') nextIndex = 0;
  if (event.key === 'End') nextIndex = coreTabs.length - 1;

  if (nextIndex === null) return;
  event.preventDefault();
  activateCoreTab(coreTabs[nextIndex], true);
});

updateCoreTabOrientation();
compactCoreTabs.addEventListener('change', updateCoreTabOrientation);

document.querySelector('[data-copy-intro]').addEventListener('click', async () => {
  const status = document.querySelector('.copy-status');
  const introduction = document.querySelector('#short-intro').textContent.trim();

  try {
    await navigator.clipboard.writeText(introduction);
    status.textContent = '自我介紹已複製。';
  } catch {
    status.textContent = '無法自動複製，請直接選取上方的自我介紹文字。';
  }
});

window.addEventListener('scroll', updatePageState, { passive: true });
window.addEventListener('resize', updatePageState);
updatePageState();
