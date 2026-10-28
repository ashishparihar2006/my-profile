/**
 * ASHISH PARIHAR // PORTFOLIO CLIENT ENGINE v2.0.0
 * Handles:
 * 1. Dual UTC & IST live clocks with unmount/visibility cleanup
 * 2. High-DPI Canvas Particle Network with reduced-motion support
 * 3. Spotlight cursor mouse tracking
 * 4. Sticky header, ScrollSpy & Accessible Focus-Managed Mobile Drawer
 * 5. Functional Copy Code buttons
 * 6. Interactive Project Category Filtering
 * 7. Web3Forms Contact Form Integration & Validation
 * 8. Email copy-to-clipboard action
 */

(function () {
  'use strict';

  /* --------------------------------------------------------------------------
     1. Dual UTC & Indian Standard Time (IST) Live Clocks
     -------------------------------------------------------------------------- */
  const utcClockEl = document.getElementById('utc-clock');
  const istClockEl = document.getElementById('ist-clock');
  const yearEl = document.getElementById('current-year');
  let clockIntervalId = null;

  function updateClocks() {
    const now = new Date();

    // UTC Time HH:MM:SS
    if (utcClockEl) {
      const utcHours = String(now.getUTCHours()).padStart(2, '0');
      const utcMins = String(now.getUTCMinutes()).padStart(2, '0');
      const utcSecs = String(now.getUTCSeconds()).padStart(2, '0');
      utcClockEl.textContent = `UTC ${utcHours}:${utcMins}:${utcSecs}`;
    }

    // IST Time HH:MM:SS (Asia/Kolkata timezone)
    if (istClockEl) {
      try {
        const istFormatter = new Intl.DateTimeFormat('en-GB', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        });
        istClockEl.textContent = `IST ${istFormatter.format(now)}`;
      } catch (e) {
        // Fallback calculation: UTC + 5 hours 30 mins
        const istTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
        const istHours = String(istTime.getUTCHours()).padStart(2, '0');
        const istMins = String(istTime.getUTCMinutes()).padStart(2, '0');
        const istSecs = String(istTime.getUTCSeconds()).padStart(2, '0');
        istClockEl.textContent = `IST ${istHours}:${istMins}:${istSecs}`;
      }
    }
  }

  function startClocks() {
    if (!clockIntervalId) {
      updateClocks();
      clockIntervalId = setInterval(updateClocks, 1000);
    }
  }

  function stopClocks() {
    if (clockIntervalId) {
      clearInterval(clockIntervalId);
      clockIntervalId = null;
    }
  }

  // Handle visibility pause to avoid battery drain
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopClocks();
    } else {
      startClocks();
    }
  });

  startClocks();

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* --------------------------------------------------------------------------
     2. Interactive Cyber Canvas (High-DPI, Particle Network, Reduced Motion)
     -------------------------------------------------------------------------- */
  const canvas = document.getElementById('cyber-canvas');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let animationFrameId = null;
    let isCanvasActive = true;

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

    // High-DPI Aware Canvas Resize
    function resizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      initParticles();
    }

    // Particle Model
    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 1.4 + 0.8;
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

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            this.x -= Math.cos(angle) * force * 1.5;
            this.y -= Math.sin(angle) * force * 1.5;
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
      // Lower particle count on mobile viewports for performance
      const isMobile = width < 768;
      const count = isMobile ? 18 : Math.min(Math.floor((width * height) / 18000), 50);
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    }

    function renderCyberNetwork() {
      if (!isCanvasActive || document.body.classList.contains('canvas-disabled')) return;

      ctx.clearRect(0, 0, width, height);

      const maxDist = width < 768 ? 85 : 110;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.update();
        p1.draw();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.18;
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

    window.addEventListener('resize', () => {
      resizeCanvas();
    }, { passive: true });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        isCanvasActive = false;
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
      } else {
        isCanvasActive = true;
        renderCyberNetwork();
      }
    });

    resizeCanvas();
    renderCyberNetwork();
  }

  /* --------------------------------------------------------------------------
     3. Spotlight Card Cursor Tracking
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
     4. Sticky Header, ScrollSpy & Focus-Managed Mobile Navigation
     -------------------------------------------------------------------------- */
  const header = document.getElementById('site-header');
  const backToTopBtn = document.getElementById('back-to-top-btn');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (header) {
      if (scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.pointerEvents = 'auto';
      } else {
        backToTopBtn.style.opacity = '0.5';
      }
    }
  }, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Active Nav ScrollSpy
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if ('IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver(
      (entries) => {
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
      },
      { root: null, rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    );
    sections.forEach((s) => navObserver.observe(s));
  }

  // Accessible Mobile Menu with Focus Trap & Escape Handling
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-nav-menu');
  const mobileCloseBtn = document.getElementById('mobile-menu-close');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (mobileToggle && mobileMenu) {
    function toggleMobileMenu(open) {
      const isOpen = open !== undefined ? open : !mobileMenu.classList.contains('open');
      mobileMenu.classList.toggle('open', isOpen);
      mobileToggle.classList.toggle('active', isOpen);
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
      mobileMenu.setAttribute('aria-hidden', String(!isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';

      if (isOpen) {
        const firstFocusable = mobileMenu.querySelector('button, a');
        if (firstFocusable) firstFocusable.focus();
      } else {
        // Return focus to toggle button (WCAG compliance)
        mobileToggle.focus();
      }
    }

    mobileToggle.addEventListener('click', () => toggleMobileMenu());
    if (mobileCloseBtn) {
      mobileCloseBtn.addEventListener('click', () => toggleMobileMenu(false));
    }

    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => toggleMobileMenu(false));
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        toggleMobileMenu(false);
      }
    });

    document.addEventListener('click', (e) => {
      if (
        mobileMenu.classList.contains('open') &&
        !mobileMenu.contains(e.target) &&
        !mobileToggle.contains(e.target)
      ) {
        toggleMobileMenu(false);
      }
    });
  }

  /* --------------------------------------------------------------------------
     5. Functional "Copy Code" Buttons (Phase 7)
     -------------------------------------------------------------------------- */
  const copyCodeButtons = document.querySelectorAll('.btn-copy-code');
  copyCodeButtons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const targetId = btn.getAttribute('data-code-target');
      const codeEl = document.getElementById(targetId);
      if (!codeEl) return;

      const codeText = codeEl.innerText || codeEl.textContent;

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(codeText);
        } else {
          // Fallback for older browsers
          const textarea = document.createElement('textarea');
          textarea.value = codeText;
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        }

        const originalText = btn.querySelector('.copy-text') || btn;
        const prevText = originalText.textContent;
        originalText.textContent = 'Copied!';
        btn.classList.add('copied');

        setTimeout(() => {
          originalText.textContent = prevText;
          btn.classList.remove('copied');
        }, 2000);
      } catch (err) {
        console.error('Failed to copy code snippet: ', err);
      }
    });
  });

  /* --------------------------------------------------------------------------
     6. Interactive Project Category Filtering (Phase 8)
     -------------------------------------------------------------------------- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      filterButtons.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      button.classList.add('active');
      button.setAttribute('aria-pressed', 'true');

      const filterVal = button.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const categories = (card.getAttribute('data-category') || '').split(/\s+/);
        if (filterVal === 'all' || categories.includes(filterVal)) {
          card.classList.remove('filtered-out');
          card.style.opacity = '1';
        } else {
          card.classList.add('filtered-out');
        }
      });
    });
  });

  /* --------------------------------------------------------------------------
     7. Contact Form with Web3Forms & Client Validation (Phase 9)
     -------------------------------------------------------------------------- */
  // Access Key Placeholder: Replace with your free key from https://web3forms.com
  const WEB3FORMS_ACCESS_KEY = 'YOUR_ACCESS_KEY_HERE';

  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const messageInput = document.getElementById('contact-message');
  const charCounter = document.getElementById('char-counter');
  const formFeedback = document.getElementById('form-feedback');
  const submitBtn = document.getElementById('form-submit-btn');
  const submitBtnText = document.getElementById('submit-btn-text');
  const keyInput = document.getElementById('web3forms-access-key');

  if (keyInput) {
    keyInput.value = WEB3FORMS_ACCESS_KEY;
  }

  // Live message counter
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

  function validateField(inputEl, errorElId, message) {
    const errorEl = document.getElementById(errorElId);
    if (message) {
      inputEl.classList.add('is-invalid');
      if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.remove('hidden');
      }
      return false;
    } else {
      inputEl.classList.remove('is-invalid');
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.classList.add('hidden');
      }
      return true;
    }
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameVal = (nameInput.value || '').trim();
      const emailVal = (emailInput.value || '').trim();
      const msgVal = (messageInput.value || '').trim();

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      let isValid = true;
      if (!nameVal || nameVal.length < 2) {
        isValid = validateField(nameInput, 'name-error', 'Please enter your name (at least 2 characters).') && isValid;
      } else {
        validateField(nameInput, 'name-error', null);
      }

      if (!emailVal || !emailRegex.test(emailVal)) {
        isValid = validateField(emailInput, 'email-error', 'Please provide a valid email address.') && isValid;
      } else {
        validateField(emailInput, 'email-error', null);
      }

      if (!msgVal || msgVal.length < 10) {
        isValid = validateField(messageInput, 'message-error', 'Message must be at least 10 characters long.') && isValid;
      } else {
        validateField(messageInput, 'message-error', null);
      }

      if (!isValid) return;

      // Loading state & duplicate prevention
      submitBtn.disabled = true;
      submitBtnText.textContent = 'Transmitting Message...';
      formFeedback.className = 'form-feedback info font-mono text-xs p-3 rounded';
      formFeedback.textContent = '[TRANSMISSION] Preparing packet dispatch...';
      formFeedback.classList.remove('hidden');

      // Check if Web3Forms key has been configured
      if (WEB3FORMS_ACCESS_KEY === 'YOUR_ACCESS_KEY_HERE') {
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtnText.textContent = 'Send Transmission';
          formFeedback.className = 'form-feedback info font-mono text-xs p-3 rounded';
          formFeedback.innerHTML = `
            <strong>[Form Validated Successfully]</strong><br>
            To receive live emails directly in your inbox, generate a free access key at 
            <a href="https://web3forms.com" target="_blank" rel="noopener noreferrer" class="text-cyan underline">web3forms.com</a> 
            and set <code>WEB3FORMS_ACCESS_KEY</code> in <code>js/main.js</code>.<br>
            Direct contact: <a href="mailto:ashishparihar138@gmail.com" class="text-white underline">ashishparihar138@gmail.com</a>.
          `;
        }, 800);
        return;
      }

      // Live Web3Forms submission
      try {
        const formData = new FormData(contactForm);
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Accept': 'application/json'
          },
          body: formData
        });

        const result = await response.json();

        submitBtn.disabled = false;
        submitBtnText.textContent = 'Send Transmission';

        if (response.status === 200 && result.success) {
          formFeedback.className = 'form-feedback success font-mono text-xs p-3 rounded';
          formFeedback.textContent = '[SUCCESS: 200 OK] Message successfully transmitted! I will respond promptly to ' + emailVal + '.';
          contactForm.reset();
          if (charCounter) charCounter.textContent = '0 / 1000';
        } else {
          formFeedback.className = 'form-feedback error font-mono text-xs p-3 rounded';
          formFeedback.textContent = `[ERROR] Transmission failed: ${result.message || 'Unknown error. Please email directly.'}`;
        }
      } catch (err) {
        submitBtn.disabled = false;
        submitBtnText.textContent = 'Send Transmission';
        formFeedback.className = 'form-feedback error font-mono text-xs p-3 rounded';
        formFeedback.textContent = '[NETWORK ERROR] Unable to reach transmission gateway. Please email ashishparihar138@gmail.com directly.';
      }
    });
  }

  /* --------------------------------------------------------------------------
     8. Direct Email Copy to Clipboard Button
     -------------------------------------------------------------------------- */
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const copyEmailText = document.getElementById('copy-email-text');

  if (copyEmailBtn && copyEmailText) {
    copyEmailBtn.addEventListener('click', async () => {
      const email = 'ashishparihar138@gmail.com';
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(email);
        } else {
          const textarea = document.createElement('textarea');
          textarea.value = email;
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        }
        copyEmailText.textContent = 'Copied!';
        copyEmailBtn.classList.add('copied');
        setTimeout(() => {
          copyEmailText.textContent = 'Copy';
          copyEmailBtn.classList.remove('copied');
        }, 2000);
      } catch (err) {
        console.error('Failed to copy email:', err);
      }
    });
  }

  // Developer Console Badge
  console.log(
    '%c> ASHISH PARIHAR // PORTFOLIO INITIALIZED',
    'color: #00F2FE; font-weight: bold; font-size: 13px; background: #0D0F12; padding: 6px 12px; border: 1px solid #00F2FE; border-radius: 4px;'
  );
  console.log(
    '%cCS Undergrad • 2-Time National Fencing Medalist • Logic & Unix Automation',
    'color: #00F5A0; font-size: 11px;'
  );
})();
