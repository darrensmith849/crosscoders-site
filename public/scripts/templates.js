(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reduce && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      }
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
    document.querySelectorAll('[data-reveal]').forEach((item, index) => {
      item.style.setProperty('--reveal-delay', `${Math.min(index % 6, 5) * 55}ms`);
      revealObserver.observe(item);
    });
  } else {
    document.querySelectorAll('[data-reveal]').forEach((item) => item.classList.add('is-visible'));
  }

  document.querySelectorAll('[data-tabset]').forEach((set) => {
    const buttons = Array.from(set.querySelectorAll('[data-tab-button]'));
    const panels = Array.from(set.querySelectorAll('[data-tab-panel]'));
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const next = button.getAttribute('data-tab-button');
        buttons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
        panels.forEach((panel) => panel.toggleAttribute('hidden', panel.getAttribute('data-tab-panel') !== next));
      });
    });
  });

  document.querySelectorAll('[data-filter-set]').forEach((set) => {
    const buttons = Array.from(set.querySelectorAll('[data-filter]'));
    const items = Array.from(set.querySelectorAll('[data-filter-item]'));
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const next = button.getAttribute('data-filter');
        buttons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
        items.forEach((item) => {
          const match = next === 'all' || item.getAttribute('data-filter-item') === next;
          item.toggleAttribute('hidden', !match);
        });
      });
    });
  });

  document.querySelectorAll('[data-open-drawer]').forEach((button) => {
    const drawer = document.querySelector(button.getAttribute('data-open-drawer') || '');
    if (!drawer) return;
    button.addEventListener('click', () => {
      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
    });
  });

  document.querySelectorAll('[data-close-drawer]').forEach((button) => {
    button.addEventListener('click', () => {
      const drawer = button.closest('.tpl-drawer, .tpl-lightbox');
      if (!drawer) return;
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
    });
  });

  document.querySelectorAll('[data-lightbox-source]').forEach((button) => {
    button.addEventListener('click', () => {
      const target = document.querySelector('#templateLightbox');
      if (!target) return;
      const title = target.querySelector('[data-lightbox-title]');
      const image = target.querySelector('[data-lightbox-image]');
      if (title) title.textContent = button.getAttribute('data-title') || 'Gallery view';
      if (image) image.setAttribute('class', `lightbox-image ${button.getAttribute('data-tone') || ''}`);
      target.classList.add('is-open');
      target.setAttribute('aria-hidden', 'false');
    });
  });
})();
