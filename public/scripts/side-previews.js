(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('sp-ready');

  if (!reduce && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });

    document.querySelectorAll('[data-reveal]').forEach((node, index) => {
      node.style.setProperty('--reveal-delay', `${Math.min(index % 7, 6) * 55}ms`);
      observer.observe(node);
    });
  } else {
    document.querySelectorAll('[data-reveal]').forEach((node) => node.classList.add('is-visible'));
  }

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

  const setOpen = (modal, open) => {
    modal.classList.toggle('is-open', open);
    modal.setAttribute('aria-hidden', open ? 'false' : 'true');
    document.body.classList.toggle('sp-modal-open', open);
    if (open) modal.querySelector('button, a, input, select, textarea')?.focus();
  };

  document.querySelectorAll('[data-open-drawer]').forEach((button) => {
    const drawer = document.querySelector(button.getAttribute('data-open-drawer') || '');
    if (!drawer) return;
    button.addEventListener('click', () => setOpen(drawer, true));
  });

  document.querySelectorAll('[data-close-drawer]').forEach((button) => {
    button.addEventListener('click', () => {
      const modal = button.closest('.sp-drawer, .sp-lightbox');
      if (modal) setOpen(modal, false);
    });
  });

  document.querySelectorAll('[data-lightbox-source]').forEach((button) => {
    button.addEventListener('click', () => {
      const lightbox = document.querySelector('#sidePreviewLightbox');
      if (!lightbox) return;
      const title = lightbox.querySelector('[data-lightbox-title]');
      const image = lightbox.querySelector('[data-lightbox-image]');
      if (title) title.textContent = button.getAttribute('data-title') || 'Gallery view';
      if (image) {
        image.setAttribute('class', `lightbox-image ${button.getAttribute('data-tone') || ''}`);
        const src = button.getAttribute('data-image');
        image.style.backgroundImage = src ? `url("${src}")` : '';
      }
      setOpen(lightbox, true);
    });
  });

  if (!reduce && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('[data-tilt]').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty('--tilt-x', `${(-y * 4).toFixed(2)}deg`);
        card.style.setProperty('--tilt-y', `${(x * 5).toFixed(2)}deg`);
      });
      card.addEventListener('pointerleave', () => {
        card.style.removeProperty('--tilt-x');
        card.style.removeProperty('--tilt-y');
      });
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    document.querySelectorAll('.sp-drawer.is-open, .sp-lightbox.is-open').forEach((modal) => setOpen(modal, false));
  });
})();
