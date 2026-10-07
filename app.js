// Navigation is the only enhancement; all text and links work without JavaScript.
(() => {
  const header = document.querySelector(".site-header");
  const links = [...document.querySelectorAll(".site-header nav a")];
  const sections = links.map((link) => document.querySelector(link.hash));
  if (!header || !links.length || sections.some((section) => !section)) return;

  let scheduled = false;
  function updateNavigation() {
    scheduled = false;
    const marker = header.getBoundingClientRect().bottom + 100;
    let current = sections[0];
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= marker) current = section;
    }
    for (const link of links) {
      if (link.hash === `#${current.id}`) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    }
  }
  function scheduleUpdate() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(updateNavigation);
  }
  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate);
  window.addEventListener("hashchange", scheduleUpdate);
  window.addEventListener("load", updateNavigation);
  updateNavigation();
})();
