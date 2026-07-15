/* ================================================
   MAIN.JS – Portfolio Interactive Logic
   ================================================ */

'use strict';

/* ---- Matrix Rain ---- */
(function initMatrix() {
  const canvas = document.getElementById('matrix-canvas');
  const ctx = canvas.getContext('2d');
  let cols, drops;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    cols  = Math.floor(canvas.width / 18);
    drops = Array(cols).fill(1);
  }

  const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*(){}[]<>/\\|';

  function draw() {
    ctx.fillStyle = 'rgba(8,12,16,0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00ff88';
    ctx.font = '14px JetBrains Mono, monospace';

    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(char, i * 18, drops[i] * 18);
      if (drops[i] * 18 > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }

  resize();
  window.addEventListener('resize', resize);
  setInterval(draw, 50);
})();


/* ---- Navbar scroll effect ---- */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });
})();


/* ---- Mobile Nav Toggle ---- */
(function initMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const links  = document.getElementById('nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', links.classList.contains('open'));
  });

  // Close on link click
  links.querySelectorAll('.nav-link, .btn-download-nav').forEach(link => {
    link.addEventListener('click', () => links.classList.remove('open'));
  });
})();


/* ---- Active nav link on scroll ---- */
(function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[data-section]');

  function updateActiveLink() {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.dataset.section === id);
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();
})();


/* ---- Hero Typewriter Terminal ---- */
(function initTerminal() {
  const cmdEl    = document.getElementById('typewriter-cmd');
  const outputEl = document.getElementById('terminal-output');
  if (!cmdEl || !outputEl) return;

  const commands = [
    {
      cmd: 'whoami',
      lines: [
        { type: 'kv', key: 'name',       val: 'M.N.M. Fawzul Haq' },
        { type: 'kv', key: 'role',       val: 'System Engineer | Cybersecurity Enthusiast' },
        { type: 'kv', key: 'location',   val: 'Sri Lanka 🇱🇰', class: 'out-val-blue' },
        { type: 'kv', key: 'experience', val: '4+ years in IT & Security' },
        { type: 'kv', key: 'status',     val: 'Open to opportunities ✅' },
      ]
    },
    {
      cmd: 'cat certifications.txt',
      lines: [
        { type: 'text', val: '✅ CRTOM – Certified Red Team Operations Mgmt' },
        { type: 'text', val: '✅ CPPS – Certified Phishing Prevention Specialist' },
        { type: 'text', val: '✅ Cisco Network Security Learn-A-Thon 2020' },
        { type: 'text', val: '📖 CompTIA Security+ (In Progress)' },
        { type: 'text', val: '📖 ISC2 Certified Cybersecurity (In Progress)' },
        { type: 'text', val: '📖 CEH – Certified Ethical Hacker (In Progress)' },
      ]
    },
    {
      cmd: 'nmap --skills localhost',
      lines: [
        { type: 'text', val: 'Scanning target: localhost (127.0.0.1)' },
        { type: 'kv', key: '80/tcp',  val: 'SIEM & Security Monitoring' },
        { type: 'kv', key: '443/tcp', val: 'Red Team Operations', class: 'out-val' },
        { type: 'kv', key: '22/tcp',  val: 'Linux Administration' },
        { type: 'kv', key: '3389/tcp', val: 'Windows Server Administration' },
        { type: 'comment', val: '-- Nmap done: All skills OPEN --' },
      ]
    }
  ];

  let cmdIdx = 0;

  async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function typeCmd(text) {
    cmdEl.textContent = '';
    for (const char of text) {
      cmdEl.textContent += char;
      await sleep(60 + Math.random() * 40);
    }
  }

  async function showOutput(lines) {
    outputEl.innerHTML = '';
    for (const line of lines) {
      await sleep(120);
      const span = document.createElement('span');
      span.className = 'out-line';

      if (line.type === 'kv') {
        span.innerHTML = `<span class="out-key">${line.key}</span>: <span class="${line.class || 'out-val'}">${line.val}</span>`;
      } else if (line.type === 'comment') {
        span.innerHTML = `<span class="out-comment">${line.val}</span>`;
      } else {
        span.innerHTML = `<span class="out-val-blue">${line.val}</span>`;
      }

      outputEl.appendChild(span);
    }
  }

  async function runLoop() {
    while (true) {
      const { cmd, lines } = commands[cmdIdx % commands.length];
      cmdIdx++;

      await typeCmd(cmd);
      await sleep(600);
      await showOutput(lines);
      await sleep(4000);
      cmdEl.textContent = '';
      outputEl.innerHTML = '';
      await sleep(500);
    }
  }

  runLoop();
})();


/* ---- Hero Role Rotator ---- */
(function initRoleRotator() {
  const el = document.getElementById('role-rotator');
  if (!el) return;

  const roles = [
    'Red Teaming',
    'Ethical Hacking',
    'Security Operations',
    'Threat Detection',
    'SIEM Engineering',
    'Penetration Testing',
  ];

  let idx = 0;

  setInterval(() => {
    idx = (idx + 1) % roles.length;
    el.style.opacity = '0';
    setTimeout(() => {
      el.textContent = roles[idx];
      el.style.opacity = '1';
    }, 300);
  }, 2500);

  el.style.transition = 'opacity 0.3s ease';
})();


/* ---- Skill Bar Animations (Intersection Observer) ---- */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const width = bar.getAttribute('data-width');
        bar.style.width = width + '%';
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
})();


/* ---- AOS-like scroll animations ---- */
(function initScrollAnimations() {
  const elements = document.querySelectorAll('[data-aos]');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('aos-animate');
        }, i * 100);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  elements.forEach(el => observer.observe(el));
})();


/* ---- Contact Form (mailto fallback) ---- */
function handleFormSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const name    = document.getElementById('contact-name').value;
  const email   = document.getElementById('contact-email').value;
  const subject = document.getElementById('contact-subject').value;
  const message = document.getElementById('contact-message').value;

  const mailtoBody = encodeURIComponent(
    `Hi Fawzul,\n\nMy name is ${name} (${email}).\n\n${message}\n\nBest regards,\n${name}`
  );

  const mailtoLink = `mailto:fawzulhaq.mnm@gmail.com?subject=${encodeURIComponent(subject)}&body=${mailtoBody}`;
  window.location.href = mailtoLink;

  const btn = document.getElementById('form-submit-btn');
  btn.textContent = '✓ Opening email client...';
  btn.style.background = '#28c840';

  setTimeout(() => {
    btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Send Message`;
    btn.style.background = '';
  }, 3000);
}


/* ---- Hex grid animation ---- */
(function initHexGrid() {
  const items = document.querySelectorAll('.hex-item');
  if (!items.length) return;

  setInterval(() => {
    const idx = Math.floor(Math.random() * items.length);
    items[idx].classList.toggle('active');
  }, 800);
})();


/* ---- CV Download tracking ---- */
(function initCVDownload() {
  const btns = document.querySelectorAll('[href="fawzulhaq_cv.pdf"]');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      console.log('[Portfolio] CV download initiated');
    });
  });
})();


/* ---- Smooth anchor scroll ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* ---- Cursor glow effect ---- */
(function initCursorGlow() {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,255,136,0.04) 0%, transparent 70%);
    pointer-events: none;
    z-index: 999;
    transform: translate(-50%, -50%);
    transition: left 0.15s ease, top 0.15s ease;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
})();
