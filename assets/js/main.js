// Minimal JS: year, menu toggle, smooth scroll
document.getElementById('year').textContent = new Date().getFullYear();

const menuBtn = document.getElementById('menuBtn');
menuBtn && menuBtn.addEventListener('click', () => {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e){
    const target = document.querySelector(this.getAttribute('href'));
    if(target){
      e.preventDefault();
      target.scrollIntoView({behavior:'smooth',block:'start'});
      // on small screens hide nav after click
      if(window.innerWidth < 900){
        const nav = document.querySelector('.nav');
        if(nav) nav.style.display = 'none';
      }
    }
  });
});
