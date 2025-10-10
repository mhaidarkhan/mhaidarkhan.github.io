// main.js — robust final: theme, overlay, reveal, funnel, cursor, parallax, form UX
(function () {
  'use strict';

  const $ = selector => document.querySelector(selector);
  const $$ = selector => Array.from(document.querySelectorAll(selector || ''));

  // ---------- Theme handling ----------
  const THEME_KEY = 'haidar-theme';
  const themeToggles = $$('#themeToggle, #themeToggle2, #themeToggle3, .theme-toggle');

  function getSavedTheme() {
    try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
  }
  function saveTheme(value) {
    try { localStorage.setItem(THEME_KEY, value); } catch (e) { /* ignore */ }
  }

  function setTheme(theme) {
    if (!theme) theme = 'light';
    document.body.setAttribute('data-theme', theme);
    // update toggle labels/icons (if present)
    themeToggles.forEach(btn => {
      try { btn.textContent = theme === 'dark' ? '🌙' : '☀️'; } catch (e) { /* ignore */ }
    });
  }

  // initialize theme (default light)
  const saved = getSavedTheme();
  setTheme(saved === 'dark' ? 'dark' : 'light');

  function toggleTheme() {
    const next = document.body.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    setTheme(next);
    saveTheme(next);
    // subtle visual cue
    try {
      document.body.animate([{ opacity: 0.98 }, { opacity: 1 }], { duration: 260, fill: 'forwards' });
    } catch (e) {}
  }
  // attach toggles safely
  themeToggles.forEach(btn => {
    if (!btn) return;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleTheme();
    });
  });

  // ---------- Overlay navigation (smooth page change) ----------
  const overlay = $('#pageOverlay');
  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href') || '';
    // ignore anchors, external links, mailto, tel
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.match(/^https?:\/\//i)) return;
    // internal navigation -> animate overlay then go
    if (overlay) {
      e.preventDefault();
      overlay.classList.add('active');
      setTimeout(() => {
        window.location.href = href;
      }, 420);
    }
  });

  // ---------- Reveal on scroll (IntersectionObserver) ----------
  const revealSelector = '.reveal, .card, .service-card, .portrait-frame, .funnel-step, .book-card, .fade-up, .fade-in, .fade-left';
  let revealObserver;
  try {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
  } catch (err) {
    revealObserver = null;
  }

  if (revealObserver) {
    $$(revealSelector).forEach((el, idx) => {
      if (!el) return;
      // ensure elements have base class for initial state
      if (!el.classList.contains('reveal')) el.classList.add('reveal');
      // staggered delay
      el.style.transitionDelay = `${Math.min(600, idx * 40)}ms`;
      revealObserver.observe(el);
    });
  }

  // ---------- Parallax (simple) ----------
  const parallaxEls = $$('[data-parallax]');
  function applyParallax() {
    const s = window.scrollY || window.pageYOffset || 0;
    parallaxEls.forEach(el => {
      if (!el) return;
      const speed = parseFloat(el.dataset.parallaxSpeed || '0.12');
      el.style.transform = `translateY(${Math.round(s * speed)}px)`;
    });
  }
  if (parallaxEls.length) {
    window.addEventListener('scroll', applyParallax, { passive: true });
    // initial
    applyParallax();
  }

  // ---------- Scroll to top button ----------
  const scrollTop = $('#scrollTop');
  if (scrollTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 420) scrollTop.classList.add('show');
      else scrollTop.classList.remove('show');
    }, { passive: true });
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---------- Cursor highlight ----------
  const cursor = $$('.cursor-highlight')[0] || null;
  if (cursor) {
    // hide on touch devices
    const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    if (!isTouch) {
      window.addEventListener('mousemove', (ev) => {
        cursor.style.left = `${ev.clientX}px`;
        cursor.style.top = `${ev.clientY}px`;
      });
      // interactive scaling for actionable elements
      const hoverTargets = ['a', 'button', '.btn-primary', '.funnel-step', '.animated-btn', '.book-cta a'];
      hoverTargets.forEach(sel => {
        $$(sel).forEach(el => {
          el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%,-50%) scale(1.45)';
            cursor.style.opacity = '0.95';
          });
          el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%,-50%) scale(1)';
            cursor.style.opacity = '1';
          });
        });
      });
    } else {
      // hide on touch
      cursor.style.display = 'none';
    }
  }

  // ---------- Contact form UX helper ----------
  $$('#contactForm').forEach(form => {
    form.addEventListener('submit', (e) => {
      const submitBtn = form.querySelector('button[type="submit"], .btn-primary');
      if (submitBtn) {
        submitBtn.disabled = true;
        const prev = submitBtn.textContent;
        submitBtn.textContent = 'Sending…';
        // in case Formspree or network takes long, re-enable after 6s
        setTimeout(() => {
          try { submitBtn.disabled = false; submitBtn.textContent = prev; } catch (e) {}
        }, 6000);
      }
    });
  });

  // ---------- Funnel interactive steps ----------
  const funnelSteps = $$('.funnel-step');
  if (funnelSteps.length) {
    funnelSteps.forEach((step, idx) => {
      // pointer and keyboard accessible
      step.setAttribute('tabindex', '0');
      step.addEventListener('click', () => {
        const expanded = step.getAttribute('aria-expanded') === 'true';
        // close all
        funnelSteps.forEach(s => s.setAttribute('aria-expanded', 'false'));
        // open selected if was closed
        if (!expanded) step.setAttribute('aria-expanded', 'true');
      });
      step.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          step.click();
        }
      });
      // small hover highlight (improve visibility in dark mode)
      step.addEventListener('mouseenter', () => step.classList.add('hover'));
      step.addEventListener('mouseleave', () => step.classList.remove('hover'));
    });
  }

  // ---------- Funnel pulse animation restart (if pulse element exists) ----------
  const pulse = $('#funnelPulse');
  if (pulse) {
    let pulseTimer = null;
    const restart = () => {
      try {
        pulse.style.animation = 'none';
        // force reflow
        void pulse.offsetWidth;
        pulse.style.animation = '';
        if (pulseTimer) clearTimeout(pulseTimer);
        pulseTimer = setTimeout(restart, 3800);
      } catch (e) { /* ignore */ }
    };
    window.addEventListener('load', restart);
    window.addEventListener('focus', restart);
    document.addEventListener('click', restart);
  }

  // ---------- Mobile menu toggle (simple) ----------
  $$('#menuBtn').forEach(btn => {
    btn.addEventListener('click', () => {
      const nav = btn.closest('.header-inner') && btn.closest('.header-inner').querySelector('.nav');
      if (!nav) return;
      const isOpen = nav.classList.toggle('mobile-open');
      if (isOpen) {
        nav.style.display = 'flex';
        nav.style.flexDirection = 'column';
      } else {
        nav.style.display = '';
        nav.style.flexDirection = '';
      }
    });
  });

  // ---------- Image entrance subtle transform ----------
  window.addEventListener('load', () => {
    $$('.portrait-frame img, .book-cover, .card img').forEach(img => {
      try {
        img.style.transform = 'translateY(-8px) scale(1.01)';
        setTimeout(() => { img.style.transition = 'transform 520ms cubic-bezier(.2,.9,.25,1)'; img.style.transform = 'translateY(0) scale(1)'; }, 420);
      } catch (e) {}
    });

    // remove overlay if present
    if (overlay) overlay.classList.remove('active');

    // populate year placeholders
    const yearEls = $$('#year, #yearA, #yearC, .year-auto');
    const y = new Date().getFullYear();
    yearEls.forEach(el => { try { el.textContent = y; } catch (e) {} });
  });

  // ---------- Defensive cleanup for older browsers ----------
  // Ensure features that might be missing don't break script
  if (!('IntersectionObserver' in window)) {
    // if no IO, just reveal everything immediately
    $$(revealSelector).forEach(el => el && el.classList.add('visible'));
  }

  // End IIFE
})();
