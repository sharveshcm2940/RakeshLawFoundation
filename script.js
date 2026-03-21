// NAV
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// HAMBURGER
function toggleMenu() {
  const links = document.querySelector('.nav-links');
  if (links.style.display === 'flex') {
    links.style.display = 'none';
  } else {
    links.style.cssText = 'display:flex;flex-direction:column;position:fixed;top:4rem;left:0;right:0;background:rgba(245,240,232,0.98);padding:2rem;gap:1.5rem;backdrop-filter:blur(10px);border-bottom:1px solid rgba(184,134,11,0.3);z-index:999;';
  }
}

// YEAR TABS
function showYear(year, e) {
  document.querySelectorAll('.year-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.lecture-year-section').forEach(s => s.classList.remove('active'));
  e.currentTarget.classList.add('active');
  document.getElementById('year-' + year).classList.add('active');
}

// LECTURE DETAIL
function toggleDetail(id) {
  const panel = document.getElementById(id);
  panel.classList.toggle('open');
}

// COUNTDOWN to April 19, 2026
function updateCountdown() {
  const target = new Date('2026-04-19T10:30:00+05:30');
  const now = new Date();
  const diff = target - now;
  if (diff <= 0) {
    ['days', 'hours', 'minutes', 'seconds'].forEach(id => {
      document.getElementById(id).textContent = '00';
    });
    return;
  }
  document.getElementById('days').textContent = String(Math.floor(diff / 86400000)).padStart(2, '0');
  document.getElementById('hours').textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
  document.getElementById('minutes').textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
  document.getElementById('seconds').textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

// SCROLL REVEAL
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// FORM
function handleSubmit(e) {
  e.preventDefault();
  const toast = document.getElementById('toast');
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
  }, 3000);
  e.target.reset();
}

// SMOOTH SCROLL
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (window.innerWidth <= 1024) {
        document.querySelector('.nav-links').style.display = 'none';
      }
    }
  });
});
