/* ── Lenis smooth scroll ── */
const lenis = new Lenis({
  duration: 1.3,
  easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

/* ── Scroll reveal ── */
(function () {
  const obs = new IntersectionObserver(entries =>
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); }),
    { threshold: .1 }
  );
  document.querySelectorAll('.proj-reveal').forEach(el => obs.observe(el));
})();

/* ── Sidebar active link ── */
(function () {
  const links = document.querySelectorAll('.proj-index-link');
  const sections = Array.from(links)
    .map(l => document.getElementById(l.getAttribute('href').slice(1)))
    .filter(Boolean);

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.toggle('active',
          l.getAttribute('href') === '#' + entry.target.id));
      }
    });
  }, { threshold: 0.4, rootMargin: '-80px 0px -40% 0px' });

  sections.forEach(s => obs.observe(s));

  /* Smooth click */
  links.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.getElementById(link.getAttribute('href').slice(1));
      if (target) lenis.scrollTo(target, { duration: 1.2 });
    });
  });
})();

/* ── Navbar-style back button shrink on scroll ── */
window.addEventListener('scroll', () => {
  const btn = document.querySelector('.proj-back-btn');
  if (btn) btn.classList.toggle('scrolled', window.scrollY > 80);
});

/* ── Back button curtain page transition ── */
document.querySelectorAll('.proj-back-btn, .proj-btn-s').forEach(btn => {
  btn.addEventListener('click', e => {
    const targetUrl = btn.getAttribute('href');
    if (targetUrl && !targetUrl.startsWith('#')) {
      e.preventDefault();
      const curtain = document.getElementById('cs-curtain');
      if (curtain) {
        curtain.className = '';
        void curtain.offsetWidth;
        curtain.classList.add('in');
        
        document.body.style.overflow = 'hidden';
        lenis.stop();
        
        setTimeout(() => {
          window.location.href = targetUrl;
        }, 450);
      } else {
        window.location.href = targetUrl;
      }
    }
  });
});
