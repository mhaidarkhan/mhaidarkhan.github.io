// main.js — theme, overlay, animations, funnel, cursor
(function(){
  // short selectors
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));

  // theme initialization (default: light)
  const saved = localStorage.getItem('haidar-theme');
  if(saved === 'dark') document.body.setAttribute('data-theme','dark');
  else document.body.setAttribute('data-theme','light');

  // update all theme-toggle buttons
  function updateThemeIcons(){
    $$('#themeToggle, #themeToggle2, #themeToggle3').forEach(btn => {
      if(!btn) return;
      btn.textContent = document.body.getAttribute('data-theme') === 'dark' ? '🌙' : '☀️';
    });
  }
  updateThemeIcons();

  function toggleTheme(){
    const next = document.body.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    document.body.setAttribute('data-theme', next);
    localStorage.setItem('haidar-theme', next);
    updateThemeIcons();
    // slight pulse to indicate change
    document.body.animate([{opacity:.97},{opacity:1}], {duration:300,fill:'forwards'});
  }
  // attach toggles
  $$('#themeToggle, #themeToggle2, #themeToggle3').forEach(b => b && b.addEventListener('click', toggleTheme));

  // page overlay navigation smoothness
  const overlay = $('#pageOverlay');
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if(!a) return;
    const href = a.getAttribute('href') || '';
    if(!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http')) return;
    e.preventDefault();
    overlay.classList.add('active');
    setTimeout(()=> window.location = href, 420);
  });

  // reveal on scroll
  const revealObserver = new IntersectionObserver((entries)=>{
    entries.forEach(ent=>{
      if(ent.isIntersecting){
        ent.target.classList.add('visible');
        revealObserver.unobserve(ent.target);
      }
    });
  }, {threshold: 0.12});

  $$('.reveal, .card, .hero-left, .portrait-frame, .service-card, .timeline-cards .card').forEach((el, idx) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(idx*40)}ms`;
    revealObserver.observe(el);
  });

  // parallax for elements with data-parallax
  const parallaxEls = $$('[data-parallax]');
  window.addEventListener('scroll', () => {
    const s = window.scrollY;
    parallaxEls.forEach(el => {
      const speed = parseFloat(el.dataset.parallaxSpeed || '0.14');
      el.style.transform = `translateY(${s * speed}px)`;
    });
  }, {passive:true});

  // scroll to top
  const scrollTop = $('#scrollTop');
  window.addEventListener('scroll', () => {
    if(window.scrollY > 420) scrollTop && scrollTop.classList.add('show');
    else scrollTop && scrollTop.classList.remove('show');
  });
  scrollTop && scrollTop.addEventListener('click', ()=> window.scrollTo({top:0,behavior:'smooth'}));

  // cursor highlight control
  const cursor = $$('.cursor-highlight')[0] || null;
  if(cursor){
    window.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });

    // enlarge on actionable elements
    const hoverTargets = ['a','button','.btn-primary','.funnel-step'];
    hoverTargets.forEach(sel => {
      $$(sel).forEach(el => {
        el.addEventListener('mouseenter', () => { cursor.style.transform = 'translate(-50%,-50%) scale(1.5)'; cursor.style.opacity = '0.95'; });
        el.addEventListener('mouseleave', () => { cursor.style.transform = 'translate(-50%,-50%) scale(1)'; cursor.style.opacity = '1'; });
      });
    });
  }

  // contact form submit UX
  const contactForms = $$('#contactForm');
  contactForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      const btn = form.querySelector('button[type="submit"], .btn-primary');
      if(btn){
        btn.disabled = true;
        const prev = btn.textContent;
        btn.textContent = 'Sending…';
        setTimeout(()=> { btn.disabled=false; btn.textContent = prev; }, 4000);
      }
    });
  });

  // Funnel: interactive vertical steps
  const funnelSteps = $$('.funnel-step');
  funnelSteps.forEach(step => {
    step.addEventListener('click', () => {
      // toggle expanded
      const expanded = step.getAttribute('aria-expanded') === 'true';
      // close others
      funnelSteps.forEach(s => s.setAttribute('aria-expanded','false'));
      if(!expanded) step.setAttribute('aria-expanded','true');
    });

    // keyboard accessibility
    step.addEventListener('keydown', (e) => {
      if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); step.click(); }
    });
  });

  // small periodic pulse animation restart logic (restarts when user interacts)
  const pulse = $('#funnelPulse');
  let pulseTimer = null;
  function restartPulse(){
    if(!pulse) return;
    pulse.style.animation = 'none';
    void pulse.offsetWidth;
    pulse.style.animation = null;
    if(pulseTimer) clearTimeout(pulseTimer);
    pulseTimer = setTimeout(restartPulse, 3800);
  }
  window.addEventListener('load', restartPulse);
  window.addEventListener('focus', restartPulse);
  document.addEventListener('click', restartPulse);

  // image subtle entrance
  window.addEventListener('load', () => {
    $$('.portrait-frame img').forEach(img => {
      img.style.transform = 'translateY(-8px) scale(1.01)';
      setTimeout(()=> img.style.transform = 'translateY(0) scale(1)', 420);
    });
    // remove overlay if present
    if(overlay) overlay.classList.remove('active');
    // populate years
    const y = new Date().getFullYear();
    ['#year','#yearA','#yearC'].forEach(id => {
      const el = document.querySelector(id);
      if(el) el.textContent = y;
    });
  });

})();
