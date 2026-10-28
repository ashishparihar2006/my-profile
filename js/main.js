/**
 * ASHISH PARIHAR // PORTFOLIO CLIENT ENGINE
 * Handles:
 * 1. Interactive Cyber Canvas (Particle constellation & grid network)
 * 2. Mouse-tracking spotlight glow on cards
 * 3. Sticky header & scroll spy navigation
 * 4. Mobile drawer menu
 * 5. Live UTC/IST clock
 * 6. Contact form validation & simulated encrypted transmission
 * 7. Back-to-top button
 */

(function () {
  'use strict';

  /* --------------------------------------------------------------------------
     1. Cyber Canvas Background: Constellation & Neural Particles
     -------------------------------------------------------------------------- */
  const canvas = document.getElementById('cyber-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let animationFrameId = null;
    let isVisible = true;

    // Mouse tracking for particle attraction
    const mouse = {
      x: null,
      y: null,
      radius: 120
    };

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Handle canvas resize
    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    });

    // Particle Object
    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.radius = Math.random() * 1.5 + 0.8;
        // Accent colors: Cyan (#00F2FE), Blue (#4FACFE), Purple (#B026FF)
        const colors = [
          'rgba(0, 242, 254, 0.75)',
          'rgba(79, 172, 254, 0.6)',
          'rgba(176, 38, 255, 0.5)'
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around bounds
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        // Mouse proximity reaction
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            this.x -= Math.cos(angle) * force * 1.8;
            this.y -= Math.sin(angle) * force * 1.8;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    let particles = [];
    function initParticles() {
      // Density based on screen area (clean & high performance)
      const count = Math.min(Math.floor((width * height) / 16000), 75);
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    }

    function renderCyberNetwork() {
      if (!isVisible) return;

      ctx.clearRect(0, 0, width, height);

      // Connect near particles with delicate cyber neon lines
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.update();
        p1.draw();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const alpha = (1 - dist / 110) * 0.18;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(renderCyberNetwork);
    }

    // Visibility optimization: pause canvas when tab is hidden to save 100% GPU
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        isVisible = false;
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
      } else {
        isVisible = true;
        renderCyberNetwork();
      }
    });

    initParticles();
    renderCyberNetwork();
  }

  /* --------------------------------------------------------------------------
     2. Spotlight Card Mouse-Tracking Radial Border Glow
     -------------------------------------------------------------------------- */
  const spotlightCards = document.querySelectorAll('.spotlight-card');
  spotlightCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  /* --------------------------------------------------------------------------
     3. Header Scroll State & Section Intersection Observer (ScrollSpy)
     -------------------------------------------------------------------------- */
  const header = document.getElementById('site-header');
  const backToTopBtn = document.getElementById('back-to-top-btn');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Header shadow/blur class
    if (scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Back to top visibility
    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.pointerEvents = 'auto';
      } else {
        backToTopBtn.style.opacity = '0.5';
      }
    }
  }, { passive: true });

  // Back to top click handler
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Active Navigation ScrollSpy
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => navObserver.observe(section));

  /* --------------------------------------------------------------------------
     4. Mobile Drawer Menu
     -------------------------------------------------------------------------- */
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-nav-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (mobileToggle && mobileMenu) {
    function toggleMobileMenu(open) {
      const isOpen = open !== undefined ? open : !mobileMenu.classList.contains('open');
      mobileMenu.classList.toggle('open', isOpen);
      mobileToggle.classList.toggle('active', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen);
      mobileMenu.setAttribute('aria-hidden', !isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    mobileToggle.addEventListener('click', () => toggleMobileMenu());

    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => toggleMobileMenu(false));
    });

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        toggleMobileMenu(false);
      }
    });
  }

  /* --------------------------------------------------------------------------
     5. Real-Time UTC / Local Live Clock
     -------------------------------------------------------------------------- */
  const liveClockEl = document.getElementById('live-clock');
  const yearEl = document.getElementById('current-year');

  function updateClock() {
    if (liveClockEl) {
      const now = new Date();
      const utcHours = String(now.getUTCHours()).padStart(2, '0');
      const utcMins = String(now.getUTCMinutes()).padStart(2, '0');
      const utcSecs = String(now.getUTCSeconds()).padStart(2, '0');
      liveClockEl.textContent = `UTC ${utcHours}:${utcMins}:${utcSecs}`;
    }
  }

  setInterval(updateClock, 1000);
  updateClock();

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* --------------------------------------------------------------------------
     6. Interactive Contact Form with Validation & Simulated Delivery Feedback
     -------------------------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  const messageInput = document.getElementById('contact-message');
  const charCounter = document.getElementById('char-counter');
  const formFeedback = document.getElementById('form-feedback');
  const submitBtn = document.getElementById('form-submit-btn');
  const submitBtnText = document.getElementById('submit-btn-text');

  // Textarea live character counter
  if (messageInput && charCounter) {
    messageInput.addEventListener('input', () => {
      const len = messageInput.value.length;
      charCounter.textContent = `${len} / 1000`;
      if (len > 900) {
        charCounter.classList.add('text-cyan');
      } else {
        charCounter.classList.remove('text-cyan');
      }
    });
  }

  // Form Submission
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameVal = document.getElementById('contact-name').value.trim();
      const emailVal = document.getElementById('contact-email').value.trim();
      const subjectVal = document.getElementById('contact-subject').value.trim();
      const msgVal = messageInput.value.trim();

      // Basic RFC email regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!nameVal || !emailVal || !subjectVal || !msgVal) {
        showFeedback('error', 'All fields marked with an asterisk (*) are required.');
        return;
      }

      if (!emailRegex.test(emailVal)) {
        showFeedback('error', 'Please provide a valid email address (e.g. name@domain.com).');
        return;
      }

      if (msgVal.length < 15) {
        showFeedback('error', 'Please provide a more descriptive message (at least 15 characters).');
        return;
      }

      // Enter Transmitting State
      submitBtn.disabled = true;
      submitBtnText.textContent = 'Transmitting Encrypted Packet...';
      showFeedback('success', '[ENCRYPTION: AES-256] Dispatching transmission to Ashish Parihar...');

      // Simulated network handshake delay
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtnText.textContent = 'Transmit Transmission';
        const packetId = Math.random().toString(36).substring(2, 9).toUpperCase();

        showFeedback(
          'success',
          `[SUCCESS: 200 OK] Transmission delivered! Receipt ID: #AP-${packetId}. I will get back to you at ${emailVal} promptly.`
        );

        // Also echo to terminal if available
        if (window.TerminalApp) {
          window.TerminalApp.execute(`echo [CONTACT TRANSMISSION #AP-${packetId}] from ${nameVal} received.`);
        }

        contactForm.reset();
        if (charCounter) charCounter.textContent = '0 / 1000';
      }, 1200);
    });

    function showFeedback(type, message) {
      formFeedback.className = `form-feedback ${type} font-mono text-xs p-3 rounded`;
      formFeedback.textContent = message;
      formFeedback.classList.remove('hidden');
    }
  }

  // Console Easter Egg for developers inspecting source
  console.log(
    '%c> ASHISH PARIHAR // PORTFOLIO INITIALIZED',
    'color: #00F2FE; font-weight: bold; font-size: 14px; background: #0D0F12; padding: 6px 12px; border: 1px solid #00F2FE; border-radius: 4px;'
  );
  console.log(
    '%cStatus: 2-Time National Fencing Medalist | First-Year CS Undergrad | Logic & Systems Enthusiast',
    'color: #00F5A0; font-size: 11px;'
  );
  console.log(
    '%cTip: Press "T" anywhere on the page to focus the interactive CLI terminal.',
    'color: #94A3B8; font-size: 11px;'
  );
})();
