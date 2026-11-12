(() => {
  'use strict';
  const root = document.documentElement;
  root.classList.add('js');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const scrollProgress = document.querySelector('.progress');
  const hero = document.querySelector('.hero');
  const title = document.querySelector('.hero-type');
  const parallaxItems = [...document.querySelectorAll('.parallax-item')];
  const inView = document.querySelectorAll('.reveal');

  // IntersectionObserver keeps scroll entrances inexpensive, and only JS-enabled
  // pages opt into initial hidden states. No framework or analytics required.
  if ('IntersectionObserver' in window && !reduceMotion.matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.07, rootMargin: '0px 0px -30px 0px' });
    inView.forEach(el => observer.observe(el));
  } else {
    inView.forEach(el => el.classList.add('in-view'));
  }

  let scheduled = false;
  function updateScroll() {
    scheduled = false;
    const y = window.scrollY || 0;
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    if (scrollProgress) scrollProgress.style.width = `${Math.min(100, y / max * 100)}%`;
    if (reduceMotion.matches) return;
    // Small transforms provide depth without distorting the reference's clean layout.
    if (hero && title) {
      const progress = Math.min(1, y / Math.max(1, hero.offsetHeight));
      title.style.transform = `translate3d(0,${Math.round(progress * 62)}px,0)`;
      title.style.opacity = String(Math.max(.65, 1 - progress * .35));
    }
    parallaxItems.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.bottom < -250 || rect.top > innerHeight + 250) return;
      const speed = Number(el.dataset.parallax || 0.07);
      const shift = Math.max(-68, Math.min(68, (innerHeight * .5 - rect.top - rect.height*.5) * speed));
      el.style.setProperty('--parallax-y', `${shift.toFixed(1)}px`);
    });
  }
  function requestScrollUpdate() {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(updateScroll);
    }
  }
  window.addEventListener('scroll', requestScrollUpdate, { passive:true });
  window.addEventListener('resize', requestScrollUpdate, { passive:true });
  requestScrollUpdate();

  // Animate the content wrapper so each row and the rows below stay in normal flow.
  // Native details/summary still provide keyboard operation and a no-JS fallback.
  const serviceControllers = [];
  document.querySelectorAll('.service-row').forEach(row => {
    const summary = row.querySelector('summary');
    const panel = row.querySelector('.service-panel');
    if (!summary || !panel) return;
    let expanded = row.open;
    let animation = null;

    function finish() {
      row.open = expanded;
      if (animation) {
        animation.onfinish = null;
        animation.cancel();
        animation = null;
      }
      panel.style.height = '';
      panel.inert = !expanded;
    }

    function setExpanded(next) {
      if (next === expanded) return;
      const startHeight = row.open ? panel.getBoundingClientRect().height : 0;
      expanded = next;
      row.dataset.expanded = String(next);
      summary.setAttribute('aria-expanded', String(next));
      if (animation) {
        animation.onfinish = null;
        animation.cancel();
        animation = null;
      }
      if (reduceMotion.matches || typeof panel.animate !== 'function') {
        finish();
        return;
      }
      // Leave details open until the closing animation has actually completed.
      row.open = true;
      panel.inert = !next;
      panel.style.height = 'auto';
      const endHeight = next ? panel.scrollHeight : 0;
      panel.style.height = `${startHeight}px`;
      animation = panel.animate([
        { height: `${startHeight}px` },
        { height: `${endHeight}px` }
      ], { duration:240, easing:'cubic-bezier(.22,1,.36,1)', fill:'both' });
      animation.onfinish = finish;
    }

    const controller = { setExpanded, finish };
    serviceControllers.push(controller);
    summary.setAttribute('aria-expanded', String(expanded));
    panel.inert = !expanded;
    summary.addEventListener('click', event => {
      event.preventDefault();
      const next = !expanded;
      if (next) {
        serviceControllers.forEach(other => {
          if (other !== controller) other.setExpanded(false);
        });
      }
      setExpanded(next);
    });
  });
  // Resizing or changing motion settings must not leave a stale pixel height.
  window.addEventListener('resize', () => serviceControllers.forEach(c => c.finish()), { passive:true });
  reduceMotion.addEventListener('change', () => serviceControllers.forEach(c => c.finish()));

  // Mobile navigation: real controls, keyboard-safe, closes after navigation.
  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('#mobile-menu');
  function closeMenu() {
    if (!menu || !menuButton) return;
    menu.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'открыть меню');
  }
  if (menuButton && menu) {
    menuButton.addEventListener('click', () => {
      const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
      menu.hidden = isOpen;
      menuButton.setAttribute('aria-expanded', String(!isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'открыть меню' : 'закрыть меню');
    });
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    document.addEventListener('keydown', e => {if(e.key === 'Escape') closeMenu();});
    document.addEventListener('click', e => {
      if (!menu.hidden && !menu.contains(e.target) && !menuButton.contains(e.target)) closeMenu();
    });
  }

  // Keep contact destinations in config.js. Static HTML also works without JS.
  const contacts = window.SITE_CONTACTS || {};
  document.querySelectorAll('[data-contact]').forEach(el => {
    const type = el.dataset.contact;
    const value = typeof contacts[type] === 'string' ? contacts[type].trim() : '';
    if (!value) {
      el.addEventListener('click', e => e.preventDefault());
      return;
    }
    const isDirectContact = type === 'email' || type === 'phone';
    const link = type === 'email' ? `mailto:${value}` :
      type === 'phone' ? `tel:${value.replace(/[^\d+]/g, '')}` : value;
    if (!isDirectContact && !/^https:\/\//i.test(link)) return;
    el.href = link;
    el.classList.remove('placeholder');
    el.removeAttribute('aria-disabled');
    el.querySelector('strong').textContent = isDirectContact ? value :
      type === 'telegram' ? `@${new URL(value).pathname.slice(1).toLowerCase()}` :
      type === 'linkedin' ? new URL(value).pathname.split('/').filter(Boolean).pop() :
      value.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
    if (!isDirectContact) { el.target = '_blank'; el.rel = 'noopener noreferrer'; }
  });
  const year = document.querySelector('#year');
  if (year) year.textContent = String(new Date().getFullYear());
  const shortYear = document.querySelector('#short-year');
  if (shortYear) shortYear.textContent = String(new Date().getFullYear()).slice(-2);
})();
