/* ── Year ──────────────────────────────────────────── */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ── UTM & click ID capturing ─────────────────────── */
(function () {
  const params = new URLSearchParams(window.location.search);

  // UTM params
  const utmDefaults = { utm_campaign: 'Summer-Promo-2026-Organic-Social' };
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(key => {
    const val = params.get(key);
    if (val) sessionStorage.setItem(key, val);
    const el = document.getElementById(key);
    if (el) el.value = sessionStorage.getItem(key) || utmDefaults[key] || '';
  });

  // Click IDs (Google, Facebook, Microsoft)
  [['gclid', 'gclid_stech'], ['fbclid', 'fbclid_stech'], ['msclkid', 'msclkid_stech']].forEach(([param, field]) => {
    const val = params.get(param);
    if (val) sessionStorage.setItem(field, val);
    const el = document.getElementById(field);
    if (el) el.value = sessionStorage.getItem(field) || '';
  });
})();

/* ── Form submit: ownership check + TrustedForm ───── */
const leadForm = document.querySelector('.lead-form');
if (leadForm) {
  leadForm.addEventListener('submit', function (e) {
    const ownership = document.getElementById('home_type_stech');
    if (ownership && ownership.value === 'Rent') {
      e.preventDefault();
      let msg = document.getElementById('ownership-msg');
      if (!msg) {
        msg = document.createElement('p');
        msg.id = 'ownership-msg';
        msg.style.cssText = 'color:#dc2626;font-size:.85rem;margin-top:.75rem;text-align:center;';
        ownership.closest('.form-group').appendChild(msg);
      }
      msg.textContent = 'Unfortunately, solar installation requires home ownership. Please call us at (619) 743-9193 if you have questions.';
      ownership.focus();
      return;
    }

    const tfCert = document.getElementById('xxTrustedFormCertUrl');
    const tfField = document.getElementById('trustedform_cert_url');
    if (tfCert && tfField) tfField.value = tfCert.value;
  });
}

/* ── Sticky header ────────────────────────────────── */
const header = document.querySelector('[data-header]');
if (header) {
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 12);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ── Smooth scroll ────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', id);
  });
});

/* ── Scroll reveal ────────────────────────────────── */
const reveals = document.querySelectorAll('.reveal');
if (reveals.length && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -32px 0px' }
  );
  reveals.forEach(el => io.observe(el));
} else {
  reveals.forEach(el => el.classList.add('visible'));
}

/* ── Countdown timer ──────────────────────────────── */
const deadline = new Date('2026-07-31T23:59:59');
const cdDays  = document.getElementById('cd-days');
const cdHours = document.getElementById('cd-hours');
const cdMins  = document.getElementById('cd-mins');
const cdSecs  = document.getElementById('cd-secs');

function pad(n) { return String(n).padStart(2, '0'); }

function updateCountdown() {
  const diff = deadline - new Date();
  if (!cdDays) return;
  if (diff <= 0) {
    cdDays.textContent = '00';
    cdHours.textContent = '00';
    cdMins.textContent = '00';
    cdSecs.textContent = '00';
    return;
  }
  cdDays.textContent  = pad(Math.floor(diff / 86400000));
  cdHours.textContent = pad(Math.floor((diff % 86400000) / 3600000));
  cdMins.textContent  = pad(Math.floor((diff % 3600000) / 60000));
  cdSecs.textContent  = pad(Math.floor((diff % 60000) / 1000));
}

updateCountdown();
setInterval(updateCountdown, 1000);

/* ── Trust stat flip + count-up ──────────────────── */
const trustGrid = document.querySelector('.trust-grid');
if (trustGrid && 'IntersectionObserver' in window) {
  new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    document.querySelectorAll('.trust-card').forEach((card, i) => {
      setTimeout(() => {
        const numEl = card.querySelector('.trust-num');
        if (!numEl) return;
        const raw = numEl.textContent.trim();
        const cleaned = raw.replace(/,/g, '');
        const match = cleaned.match(/^(\d+(?:\.\d+)?)(.*)/);
        numEl.classList.add('flipping');
        if (match) {
          const target = parseFloat(match[1]);
          const suffix = match[2];
          const formatNum = n => target >= 1000 ? n.toLocaleString() : String(n);
          const duration = 900;
          const start = performance.now();
          const tick = now => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            numEl.textContent = formatNum(Math.round(eased * target)) + suffix;
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      }, i * 140);
    });
  }, { threshold: 0.4 }).observe(trustGrid);
}
