/* ============================================================
   RAKESH LAW FOUNDATION — Enhanced Script
   Features: Tamil/English toggle, Dark/Light mode, Countdown, Reveal
   ============================================================ */

// ── NAV SCROLL ──────────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ── HAMBURGER ───────────────────────────────────────────────
function toggleMenu() {
  const links = document.querySelector('.nav-links');
  const isOpen = links.style.display === 'flex';
  if (isOpen) {
    links.style.display = 'none';
  } else {
    links.style.cssText = [
      'display:flex',
      'flex-direction:column',
      'position:fixed',
      'top:4rem',
      'left:0',
      'right:0',
      'background:var(--nav-bg)',
      'padding:2rem',
      'gap:1.5rem',
      'backdrop-filter:blur(14px)',
      'border-bottom:1px solid var(--line-gold)',
      'z-index:999'
    ].join(';');
  }
}

// ── YEAR TABS ────────────────────────────────────────────────
function showYear(year, e) {
  document.querySelectorAll('.year-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.lecture-year-section').forEach(s => s.classList.remove('active'));
  e.currentTarget.classList.add('active');
  document.getElementById('year-' + year).classList.add('active');
}

// ── LECTURE DETAIL ───────────────────────────────────────────
function toggleDetail(id) {
  const panel = document.getElementById(id);
  const btn = panel.previousElementSibling?.querySelector('.lecture-expand-btn svg');
  panel.classList.toggle('open');
  if (btn) {
    btn.style.transform = panel.classList.contains('open') ? 'rotate(180deg)' : '';
    btn.style.transition = 'transform 0.25s ease';
  }
}

// ── COUNTDOWN ────────────────────────────────────────────────
function updateCountdown() {
  const target = new Date('2026-04-19T10:30:00+05:30');
  const now = new Date();
  const diff = target - now;

  const pad = n => String(Math.max(0, n)).padStart(2, '0');

  if (diff <= 0) {
    ['days','hours','minutes','seconds'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '00';
    });
    return;
  }

  const d = document.getElementById('days');
  const h = document.getElementById('hours');
  const m = document.getElementById('minutes');
  const s = document.getElementById('seconds');

  if (d) d.textContent = pad(Math.floor(diff / 86400000));
  if (h) h.textContent = pad(Math.floor((diff % 86400000) / 3600000));
  if (m) m.textContent = pad(Math.floor((diff % 3600000) / 60000));
  if (s) s.textContent = pad(Math.floor((diff % 60000) / 1000));
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ── SCROLL REVEAL ─────────────────────────────────────────────
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ── FORM SUBMIT ──────────────────────────────────────────────
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

// ── SMOOTH SCROLL ─────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (window.innerWidth <= 1024) {
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) navLinks.style.display = 'none';
      }
    }
  });
});

// ── DARK / LIGHT THEME ───────────────────────────────────────
(function initTheme() {
  const saved = localStorage.getItem('rlf-theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
})();

function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  html.setAttribute('data-theme', next);
  localStorage.setItem('rlf-theme', next);
}

// ── LANGUAGE TOGGLE (EN / Tamil) ─────────────────────────────
(function initLang() {
  const saved = localStorage.getItem('rlf-lang') || 'en';
  document.documentElement.setAttribute('data-lang', saved);
  if (saved === 'ta') applyLang('ta');
})();

function toggleLang() {
  const html = document.documentElement;
  const current = html.getAttribute('data-lang');
  const next = current === 'en' ? 'ta' : 'en';
  html.setAttribute('data-lang', next);
  localStorage.setItem('rlf-lang', next);
  applyLang(next);
}

function applyLang(lang) {
  // Text nodes via data-en / data-ta attributes
  document.querySelectorAll('[data-en][data-ta]').forEach(el => {
    const text = el.getAttribute('data-' + lang);
    if (text !== null) {
      // Use innerHTML for elements that may contain HTML
      const tag = el.tagName.toLowerCase();
      const htmlTags = ['p','h1','h2','h3','span','a','label','button','blockquote','li','div'];
      if (htmlTags.includes(tag) || el.querySelector('span')) {
        el.innerHTML = text;
      } else {
        el.textContent = text;
      }
    }
  });

  // Placeholder attributes
  document.querySelectorAll('[data-en-placeholder][data-ta-placeholder]').forEach(el => {
    el.placeholder = el.getAttribute('data-' + lang + '-placeholder') || el.placeholder;
  });

  // Select options
  document.querySelectorAll('select option[data-en][data-ta]').forEach(opt => {
    opt.textContent = opt.getAttribute('data-' + lang) || opt.textContent;
  });

  // Nav logo (special case with inner HTML)
  const logoMain = document.querySelector('.nav-logo-main');
  if (logoMain) {
    logoMain.innerHTML = logoMain.getAttribute('data-' + lang) || logoMain.innerHTML;
  }

  // Update page title lang
  document.documentElement.lang = lang === 'ta' ? 'ta' : 'en';
}

// ── READING PROGRESS BAR ─────────────────────────────────────
(function() {
  const bar = document.getElementById('reading-progress-bar');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docH > 0 ? (window.scrollY / docH) * 100 : 0;
    bar.style.width = pct.toFixed(1) + '%';
  }, { passive: true });
})();

// ── FONT SIZE CONTROLS ───────────────────────────────────────
const FONT_SIZES = [14, 15, 16, 17, 18, 20, 22];
let fontIdx = 2; // default = 16px

(function initFontSize() {
  const saved = parseInt(localStorage.getItem('rlf-font-idx'));
  if (!isNaN(saved) && saved >= 0 && saved < FONT_SIZES.length) fontIdx = saved;
  document.documentElement.style.fontSize = FONT_SIZES[fontIdx] + 'px';
})();

function changeFontSize(dir) {
  fontIdx = Math.max(0, Math.min(FONT_SIZES.length - 1, fontIdx + dir));
  document.documentElement.style.fontSize = FONT_SIZES[fontIdx] + 'px';
  localStorage.setItem('rlf-font-idx', fontIdx);
}

function resetFontSize() {
  fontIdx = 2;
  document.documentElement.style.fontSize = '16px';
  localStorage.setItem('rlf-font-idx', fontIdx);
}

// ── TRANSCRIPT DOWNLOAD (generates a text file as PDF stand-in) ──
function downloadTranscript(year, speaker, title, date) {
  const content = [
    'RAKESH LAW FOUNDATION',
    'Rakesh Endowment Lecture — Transcript Summary',
    '================================================',
    '',
    'Lecture Title : ' + title,
    'Speaker       : ' + speaker,
    'Date          : ' + date,
    'Venue         : Roja Muthiah Research Library, Taramani, Chennai',
    'Organised by  : Rakesh Law Foundation × RMRL',
    '',
    '------------------------------------------------',
    'SUMMARY OF PROCEEDINGS',
    '------------------------------------------------',
    '',
    getLectureContent(year),
    '',
    '------------------------------------------------',
    'For full recordings, visit Red Pix 24x7 or TNDALU Media on YouTube.',
    'Contact: dsdinesh2619@gmail.com',
    '',
    '© Rakesh Law Foundation, Chennai. All Rights Reserved.',
    'Registered Charitable Trust — Section 12AB, Income Tax Act.'
  ].join('\n');

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'RLF-Lecture-' + year + '-Transcript.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  // Show toast
  const toast = document.getElementById('toast');
  const lang = document.documentElement.getAttribute('data-lang') || 'en';
  toast.textContent = lang === 'ta' ? 'ஆவணம் பதிவிறக்கப்பட்டது' : 'Transcript Downloaded';
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
  }, 3000);
}

function getLectureContent(year) {
  const contents = {
    '2025': 'This landmark 4th edition marked the 75th anniversary of the Constitution of India. Justice Chelameswar traced the arc of constitutional values from the founding moment to the present day, examining how the judiciary has upheld — and at times strained — the promises of the republic. The discussion centred on federalism, judicial independence, and the enduring relevance of the Preamble\'s ideals of justice, liberty, equality, and fraternity.',
    '2024': 'Dr. Muralidhar delivered a forensic examination of the "dark areas" of criminal law — spaces where the presumption of innocence is routinely eroded by systemic pressures. He identified bail denial, prolonged undertrial detention, and prosecutorial overreach as critical fault lines. The judge urged the public to be informed and stand up to injustice.',
    '2023': 'Singhvi delivered a wide-ranging lecture on the triple strain on Indian federalism — constitutional, economic, and political. He notably coined the phrase that the Centre had transformed "cooperative federalism" into "combative federalism," resulting in unsavoury confrontations between the Union and state governments.',
    '2022': 'The inaugural lecture was attended by Chief Minister M.K. Stalin, N. Ram of The Hindu Group, and Udhayanidhi Stalin. Kapil Sibal argued that the office of Governor is a vestigial colonial institution with strictly limited constitutional mandate. He contended that a Governor should refer Bills to the President only when they conflict with existing parliamentary legislation.'
  };
  return contents[year] || '';
}

// ── PRINT LECTURE DETAIL ─────────────────────────────────────
function printDetail(panelId, title) {
  const panel = document.getElementById(panelId);
  if (!panel) return;
  const content = panel.querySelector('p')?.textContent || '';
  const printWindow = window.open('', '_blank', 'width=800,height=600');
  printWindow.document.write(`
    <!DOCTYPE html><html><head>
    <title>${title} — Rakesh Law Foundation</title>
    <style>
      body { font-family: Georgia, serif; max-width: 700px; margin: 3rem auto; padding: 2rem; color: #0e0c09; line-height: 1.8; }
      h1 { font-size: 1.4rem; margin-bottom: 0.5rem; }
      .meta { font-size: 0.78rem; color: #7a7060; margin-bottom: 2rem; font-family: monospace; letter-spacing: 0.05em; border-bottom: 1px solid #ddd; padding-bottom: 1rem; }
      p { margin-bottom: 1.5rem; }
      .footer { margin-top: 3rem; font-size: 0.75rem; color: #aaa; font-family: monospace; border-top: 1px solid #eee; padding-top: 1rem; }
    </style></head><body>
    <div class="meta">RAKESH LAW FOUNDATION · LECTURE MINUTES</div>
    <h1>${title}</h1>
    <p>${content}</p>
    <div class="footer">© Rakesh Law Foundation, Chennai · dsdinesh2619@gmail.com · Reg. u/s 12AB IT Act</div>
    </body></html>
  `);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => { printWindow.print(); printWindow.close(); }, 400);
}
// ── NEWSLETTER ────────────────────────────────────────────────
function handleNewsletterSubmit(e) {
  e.preventDefault();
  const toast = document.getElementById('toast');
  toast.textContent = 'Successfully subscribed!';
  toast.style.opacity = '1'; toast.style.transform = 'translateY(0)';
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateY(20px)'; }, 3000);
  e.target.reset();
}

// ── GLOSSARY FILTER ───────────────────────────────────────────
function filterGlossary(query) {
  const q = query.trim().toLowerCase();
  document.querySelectorAll('.glossary-item').forEach(item => {
    const match = !q || item.getAttribute('data-term').includes(q) || item.textContent.toLowerCase().includes(q);
    item.classList.toggle('hidden', !match);
  });
}

// ── GALLERY & LIGHTBOX ────────────────────────────────────────
const galleryData = {
  '2025': ['Lecture Commencement','Justice Chelameswar at the Dais','Audience at RMRL','Q&A Session','Foundation Team','Certificate Presentation'],
  '2024': ['Welcome Address','Dr. Muralidhar Speaks','Panel Discussion','Audience Engagement','Post-Lecture Networking','Media Coverage'],
  '2023': ['2nd Edition Opening','Singhvi at the Podium','Full House at RMRL','Audience Q&A','Group Photo','Press Moment'],
  '2022': ['CM Stalin Inaugurates','Kapil Sibal Lecture','Dignitaries on Stage','First Edition Crowd','Foundation Launch','N.R. Elango Speaks']
};
let currentGalleryYear = '2025';
let currentLightboxIdx = 0;

function showGalleryYear(year, btn) {
  currentGalleryYear = year;
  document.querySelectorAll('.gallery-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  const spans = document.querySelectorAll('#galleryGrid .gallery-placeholder span');
  const captions = galleryData[year] || galleryData['2025'];
  spans.forEach((span, i) => { if (captions[i]) span.textContent = captions[i]; });
}

function openLightbox(idx) {
  currentLightboxIdx = idx;
  const captions = galleryData[currentGalleryYear] || galleryData['2025'];
  document.getElementById('lightboxCaption').textContent = captions[idx] || '';
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}
function navigateLightbox(dir, e) {
  if (e) e.stopPropagation();
  const captions = galleryData[currentGalleryYear] || galleryData['2025'];
  currentLightboxIdx = (currentLightboxIdx + dir + captions.length) % captions.length;
  document.getElementById('lightboxCaption').textContent = captions[currentLightboxIdx];
}
document.addEventListener('keydown', function(e) {
  const lb = document.getElementById('lightbox');
  if (lb && lb.classList.contains('open')) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') navigateLightbox(1, null);
    if (e.key === 'ArrowLeft') navigateLightbox(-1, null);
  }
  if (e.key === 'Escape') closeQRModal();
});

// ── CERTIFICATE VERIFICATION ──────────────────────────────────
const VALID_CERTS = {
  'RLF-2025': 'Moot Court 2025 · First Place — Kavitha Prasad',
  'RLF-2024': 'Lecture Attendance Certificate 2024 — M. Arumugam',
  'RLF-DEMO': 'Demo Certificate — Sample Participant'
};
function handleVerify(e) {
  e.preventDefault();
  const code = document.getElementById('certCode').value.trim().toUpperCase();
  const result = document.getElementById('verifyResult');
  if (VALID_CERTS[code]) {
    result.className = 'verify-result valid';
    result.textContent = '✓ Valid Certificate — ' + VALID_CERTS[code];
  } else {
    result.className = 'verify-result invalid';
    result.textContent = '✗ Not found. Please check your certificate code and try again.';
  }
}

// ── CALENDAR ──────────────────────────────────────────────────
function addToGoogleCalendar() {
  const url = 'https://calendar.google.com/calendar/r/eventedit?text=5th+Rakesh+Endowment+Lecture+2026&dates=20260419T103000/20260419T130000&location=Roja+Muthiah+Research+Library,+Taramani,+Chennai&details=Annual+endowment+lecture+%E2%80%94+Rakesh+Law+Foundation';
  window.open(url, '_blank');
}
function downloadICS() {
  const ics = 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Rakesh Law Foundation//EN\r\nBEGIN:VEVENT\r\nDTSTART;TZID=Asia/Kolkata:20260419T103000\r\nDTEND;TZID=Asia/Kolkata:20260419T130000\r\nSUMMARY:5th Rakesh Endowment Lecture 2026\r\nLOCATION:Roja Muthiah Research Library\\, Taramani\\, Chennai\r\nDESCRIPTION:Annual endowment lecture — Rakesh Law Foundation\r\nEND:VEVENT\r\nEND:VCALENDAR';
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: 'RLF-Lecture-2026.ics' });
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
}

// ── QR CODE ───────────────────────────────────────────────────
function showQRCode() {
  document.getElementById('qrModal').classList.add('open');
  const c = document.getElementById('qrCodeContainer');
  if (!c.innerHTML) c.innerHTML = makeQR();
}
function closeQRModal() {
  document.getElementById('qrModal').classList.remove('open');
}
function makeQR() {
  // Decorative QR-pattern SVG — replace with a real QR library for production
  const size = 21, cell = 9, dark = '#1a1510';
  const finder = (r,c) => { const rr=r%14===13?r-13:r,cc=c%14===13?c-14:c; const inF=(row,col)=>row>=0&&row<7&&col>=0&&col<7; return (inF(rr,cc)||inF(rr,cc-14)||inF(rr-14,cc))&&(rr===0||rr===6||rr===13||rr===19||cc===0||cc===6||cc===13||cc===19||(rr>=2&&rr<=4&&cc>=2&&cc<=4)||(rr>=2&&rr<=4&&cc>=16&&cc<=18)||(rr>=16&&rr<=18&&cc>=2&&cc<=4)); };
  let rects = '';
  for (let r=0;r<size;r++) for (let c=0;c<size;c++) {
    const on = finder(r,c) || (((r*size+c)*2654435761)>>>8)%3===0;
    if (on) rects += `<rect x="${c*cell}" y="${r*cell}" width="${cell}" height="${cell}" fill="${dark}"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="189" height="189" viewBox="0 0 ${size*cell} ${size*cell}" style="background:#fff;display:block">${rects}</svg>`;
}
