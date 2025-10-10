// core interactivity: theme toggle, menu, smooth link scroll, year
(function(){
  // elements
  const themeToggleBtns = Array.from(document.querySelectorAll('#themeToggle, #themeToggle2, #themeToggle3, #themeToggle4, #themeToggle5'));
  const themeIcons = Array.from(document.querySelectorAll('#themeIcon, #themeIcon2, #themeIcon3, #themeIcon4, #themeIcon5'));
  const menuBtns = Array.from(document.querySelectorAll('#menuBtn, #menuBtn2, #menuBtn3, #menuBtn4, #menuBtn5'));

  // initialize year(s)
  document.querySelectorAll('#year, #year2, #year3, #year4, #year5').forEach(el => {
    if(el) el.textContent = new Date().getFullYear();
  });

  // theme handling: default to light unless previously saved
  const saved = localStorage.getItem('haidar-theme');
  const root = document.documentElement;
  if(saved === 'dark'){
    document.body.setAttribute('data-theme','dark');
    themeIcons.forEach(ic => ic && (ic.textContent = '🌙'));
  } else {
    document.body.setAttribute('data-theme','light');
    themeIcons.forEach(ic => ic && (ic.textContent = '☀️'));
  }

  function toggleTheme(){
    const current = document.body.getAttribute('data-theme') || 'light';
    const next = current === 'light' ? 'dark' : 'light';
    document.body.setAttribute('data-theme', next);
    localStorage.setItem('haidar-theme', next);
    themeIcons.forEach(ic => ic && (ic.textContent = next === 'dark' ? '🌙' : '☀️'));
  }

  themeToggleBtns.forEach(btn => btn && btn.addEventListener('click', toggleTheme));

  // simple mobile menu toggles
  menuBtns.forEach(btn => {
    if(!btn) return;
    btn.addEventListener('click', () => {
      const nav = btn.closest('.header-inner').querySelector('.nav');
      if(!nav) return;
      nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
      nav.style.flexDirection = 'column';
      nav.style.background = 'transparent';
      nav.style.padding = '10px';
    });
  });

  // smooth anchor scroll for local anchors
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e){
      const target = document.querySelector(this.getAttribute('href'));
      if(target){
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth',block:'start'});
      }
    });
  });

  // progressive enhancement: form submit feedback (client side)
  const contactForm = document.getElementById('contactForm');
  if(contactForm){
    contactForm.addEventListener('submit', function(e){
      // let Formspree handle actual submit. We show a quick UI hint.
      const btn = contactForm.querySelector('button[type="submit"]');
      if(btn){
        btn.disabled = true;
        btn.textContent = 'Sending…';
      }
      // allow normal form submit to Formspree
      setTimeout(()=> {
        if(btn){
          btn.disabled = false;
          btn.textContent = 'Send message';
        }
      }, 3000);
    });
  }
})();
