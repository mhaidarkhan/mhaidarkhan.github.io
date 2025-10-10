// main.js — enhanced interactivity: theme, page transitions, scroll reveal, parallax, cursor, lazy load
(function(){
  // helpers
  const $ = selector => document.querySelector(selector);
  const $$ = selector => Array.from(document.querySelectorAll(selector));

  // page overlay for smooth transitions
  const overlay = document.getElementById('pageOverlay');

  // theme toggle (default: light)
  const saved = localStorage.getItem('haidar-theme');
  if(saved === 'dark') document.body.setAttribute('data-theme','dark');
  else document.body.setAttribute('data-theme','light');

  // update icons on all theme buttons
  function updateThemeIcons(){
    $$('#themeToggle, #themeToggle2, #themeToggle3, #themeToggle4, #themeToggle5').forEach(btn=>{
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
    // small glow pulse
    document.body.animate([{opacity:0.98},{opacity:1}], {duration:300,fill:'forwards'});
  }
  // attach to any theme buttons present
  $$('#themeToggle, #themeToggle2, #themeToggle3, #themeToggle4, #themeToggle5').forEach(b=> b && b.addEventListener('click', toggleTheme));

  // Menu toggle (mobile)
  $$('#menuBtn, #menuBtn2, #menuBtn3, #menuBtn4, #menuBtn5').forEach(b => {
    if(!b) return;
    b.addEventListener('click', ()=> {
      const nav = b.closest('.header-inner').querySelector('.nav');
      if(!nav) return;
      nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
      nav.style.flexDirection = 'column';
      nav.style.gap = '12px';
      nav.style.background = 'transparent';
      nav.style.padding = '12px';
    });
  });

  // Smooth "page" transition for internal links (adds overlay then navigates)
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if(!a) return;
    const href = a.getAttribute('href');
    if(!href) return;
    // only intercept same-origin page links (html pages, not hashes or external)
    if(href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#')) return;
    e.preventDefault();
    if(overlay) overlay.classList.add('active');
    // small delay for animation, then navigate
    setTimeout(()=> window.location = href, 450);
  });

  // Scroll-to-top button
  const scrollTop = $('#scrollTop');
  window.addEventListener('scroll', () => {
    if(window.scrollY > 400) scrollTop && scrollTop.classList.add('show');
    else scrollTop && scrollTop.classList.remove('show');
  });
  scrollTop && scrollTop.addEventListener('click', ()=> window.scrollTo({top:0,behavior:'smooth'}));

  // IntersectionObserver: reveal elements with stagger
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const el = entry.target;
        const delay = parseFloat(el.dataset.revealDelay || '0');
        setTimeout(()=> el.classList.add('visible'), delay * 1000);
        revealObserver.unobserve(el);
      }
    });
  }, {threshold:0.15});

  // add .reveal to important blocks automatically
  $$('.card, .case, .hero-left, .hero-right, .about-hero, .service-grid, .case-study, .work-preview .case-list > *').forEach((el,i)=>{
    el.classList.add('reveal');
    el.dataset.revealDelay = (i * 0.06).toFixed(2); // stagger
    revealObserver.observe(el);
  });

  // Parallax effect for elements with [data-parallax]
  const parallaxEls = $$('[data-parallax]');
  window.addEventListener('scroll', () => {
    const sc = window.scrollY;
    parallaxEls.forEach(el => {
      // gentle translate on scroll
      const speed = parseFloat(el.dataset.parallaxSpeed || '0.18');
      el.style.transform = `translateY(${sc * speed}px)`;
    });
  }, {passive:true});

  // Lazy image reveal (add fade when loaded)
  $$('img[loading="lazy"]').forEach(img => {
    if(img.complete) img.classList.add('loaded');
    else {
      img.addEventListener('load', ()=> img.classList.add('loaded'));
    }
  });

  // cursor highlight (subtle)
  const cursor = document.createElement('div');
  cursor.className = 'cursor-highlight';
  document.body.appendChild(cursor);
  window.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });
  // enlarge on actionable elements
  ['a','button','.btn-primary','.nav a'].forEach(sel => {
    $$(sel).forEach(el => {
      el.addEventListener('mouseenter', () => { cursor.style.transform = 'translate(-50%,-50%) scale(1.5)'; cursor.style.opacity = '0.9'; });
      el.addEventListener('mouseleave', () => { cursor.style.transform = 'translate(-50%,-50%) scale(1)'; cursor.style.opacity = '1'; });
    });
  });

  // small submit UX for contact form
  const contactForm = document.getElementById('contactForm');
  if(contactForm){
    contactForm.addEventListener('submit', (e) => {
      const btn = contactForm.querySelector('button[type="submit"]');
      if(btn){
        btn.disabled = true;
        const prev = btn.textContent;
        btn.textContent = 'Sending…';
        // re-enable after 4s in case user stays (Formspree will handle redirect)
        setTimeout(()=> { btn.disabled=false; btn.textContent = prev; }, 4000);
      }
    });
  }

  // On load, animate overlay out
  window.addEventListener('load', () => {
    if(overlay) {
      overlay.classList.remove('active');
      // brief overlay flash in then out for first navigation appearance
      overlay.style.transition = 'transform .6s cubic-bezier(.2,.9,.25,1), opacity .5s';
    }
    // small entrance animation for hero image
    const heroImg = document.querySelector('.portrait-frame img');
    if(heroImg) heroImg.style.transform = 'translateY(-6px)';
    setTimeout(()=> {
      if(heroImg) heroImg.style.transform = 'translateY(0)';
    }, 420);
  });

})();
