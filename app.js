/* ============================================================
   FINSKY IT SOLUTIONS — script.js
   - Intersection Observer scroll animations
   - Terminal typewriter effect
   - Navbar scroll state
   - Mobile nav toggle
   - Contact form handler
   ============================================================ */

/* ---- Intersection Observer: Reveal on scroll ---- */
function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // fire once
      }
    });
  }, observerOptions);

  // Observe .reveal elements
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Trigger hero .fade-up elements immediately (they are above fold)
  document.querySelectorAll('#hero .fade-up, .hero-terminal.fade-up').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 100 + i * 120);
  });
}

/* ---- Navbar scroll behaviour ---- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ---- Mobile nav toggle ---- */
function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen);
  });

  // Close nav when a link is clicked
  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---- Terminal typewriter effect ---- */
function initTerminal() {
  const el = document.getElementById('terminalBody');
  if (!el) return;

  const lines = [
    { text: '$ nmap -sV --script vuln 192.168.1.0/24', cls: 'cmd', delay: 0 },
    { text: 'Starting Nmap 7.94 — scanning 256 hosts...', cls: '', delay: 600 },
    { text: '[ <span class="ok">OK</span> ] Host discovery complete.', cls: '', delay: 1400 },
    { text: '[ <span class="warn">WARN</span> ] CVE-2023-4911 found on host .104', cls: '', delay: 2100 },
    { text: '$ sudo lynis audit system --quick', cls: 'cmd', delay: 3000 },
    { text: 'Hardening index : <span class="ok">[ 87/100 ]</span>', cls: '', delay: 3800 },
    { text: '[ <span class="ok">PASS</span> ] Firewall active — all ports secured.', cls: '', delay: 4500 },
    { text: '[ <span class="ok">PASS</span> ] SELinux enforcing.', cls: '', delay: 5100 },
    { text: '$ _', cls: 'cursor-line', delay: 5800 },
  ];

  let lineIndex = 0;
  let charIndex = 0;
  let currentLineEl = null;

  function typeChar() {
    if (lineIndex >= lines.length) return;

    const line = lines[lineIndex];

    if (charIndex === 0) {
      currentLineEl = document.createElement('div');
      currentLineEl.style.minHeight = '1.8em';
      if (line.cls && line.cls !== 'cursor-line') {
        currentLineEl.className = line.cls;
      }
      el.appendChild(currentLineEl);
    }

    // Use innerHTML to support spans but type raw chars
    // Strip HTML tags for character counting, render full line when done
    const rawText = line.text.replace(/<[^>]*>/g, '');

    if (charIndex < rawText.length) {
      // Build the "typed so far" slice of raw text
      const visibleText = rawText.slice(0, charIndex + 1);
      // Replace styled segments progressively
      currentLineEl.innerHTML = visibleText;
      charIndex++;
      setTimeout(typeChar, line.cls === 'cmd' ? 38 : 20);
    } else {
      // Full line: render with HTML
      currentLineEl.innerHTML = line.text === '$ _'
        ? '$ <span class="cursor"></span>'
        : line.text;
      charIndex = 0;
      lineIndex++;
      el.scrollTop = el.scrollHeight;
      if (lineIndex < lines.length) {
        const nextDelay = lines[lineIndex].delay - line.delay;
        setTimeout(typeChar, Math.max(nextDelay, 60));
      }
    }
  }

  // Start after a short delay
  setTimeout(typeChar, 800);
}

/* ---- Contact form (Updated to Real Forwarding) ---- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const message = form.message.value.trim();

    // Validasi dasar
    if (!name || !email || !message) {
      alert('Please fill in all fields.');
      return;
    }

    // Persiapan link mailto
    const subject = encodeURIComponent(`FinSky Inquiry: Message from ${name}`);
    const body    = encodeURIComponent(
      `Name: ${name}\n` +
      `Email: ${email}\n\n` +
      `Message:\n${message}`
    );
    // Eksekusi buka aplikasi email
    window.location.href = `mailto:hello@finsky.my.id?subject=${subject}&body=${body}`;
    // Reset form setelah beberapa saat
    setTimeout(() => form.reset(), 1000);
  });
}

/* ---- Smooth anchor scroll (native enhanced) ---- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const offset = 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ---- Init ---- */
document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initNavbar();
  initMobileNav();
  initTerminal();
  initContactForm();
  initSmoothScroll();
});
