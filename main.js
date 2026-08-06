/**
 * Data & ML Engineer Portfolio — Interactive Features
 */

(function () {
  'use strict';

  // --- DOM References ---
  const header = document.querySelector('.site-header');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav__link');
  const yearEl = document.getElementById('year');
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  // --- Footer year ---
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // --- Mobile navigation ---
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('is-open');
        navToggle.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open menu');
      });
    });
  }

  // --- Sticky header on scroll ---
  window.addEventListener('scroll', () => {
    if (header) {
      header.classList.toggle('is-scrolled', window.scrollY > 20);
    }
  }, { passive: true });

  // --- Active nav link on scroll ---
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    const scrollPos = window.scrollY + 100;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav__link[href="#${id}"]`);

      if (link && scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((l) => l.classList.remove('is-active'));
        link.classList.add('is-active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  // --- Skill filter ---
  const skillFilterBtns = document.querySelectorAll('[data-filter]');
  const skillCards = document.querySelectorAll('.skill-card[data-category]');

  skillFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      skillFilterBtns.forEach((b) => {
        b.classList.toggle('is-active', b === btn);
        b.setAttribute('aria-selected', String(b === btn));
      });

      skillCards.forEach((card) => {
        const category = card.dataset.category;
        const show = filter === 'all' || category === filter;
        card.classList.toggle('is-hidden', !show);
      });
    });
  });

  // --- Project filter ---
  const projectFilterBtns = document.querySelectorAll('[data-project-filter]');
  const projectCards = document.querySelectorAll('.project-card[data-category]');

  projectFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.projectFilter;

      projectFilterBtns.forEach((b) => {
        b.classList.toggle('is-active', b === btn);
        b.setAttribute('aria-selected', String(b === btn));
      });

      projectCards.forEach((card) => {
        const category = card.dataset.category;
        const show = filter === 'all' || category === filter;
        card.classList.toggle('is-hidden', !show);
      });
    });
  });

  // --- Animate skill bars on scroll ---
  const skillBars = document.querySelectorAll('.skill-bar__fill');

  if ('IntersectionObserver' in window) {
    const barObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-animated');
            barObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    skillBars.forEach((bar) => barObserver.observe(bar));
  } else {
    skillBars.forEach((bar) => bar.classList.add('is-animated'));
  }

  // --- Animate stat counters ---
  const statNumbers = document.querySelectorAll('.stat-card__number[data-count]');

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1500;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    statNumbers.forEach((el) => counterObserver.observe(el));
  } else {
    statNumbers.forEach((el) => {
      el.textContent = el.dataset.count;
    });
  }

  // --- Scroll reveal ---
  const revealEls = document.querySelectorAll(
    '.section__header, .skill-card, .project-card, .timeline__item, .edu-card, .award-card, .about__grid > *'
  );

  revealEls.forEach((el) => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  // --- Contact form (Formspree or fallback mailto) ---
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      const action = contactForm.getAttribute('action');

      // If Formspree URL is still placeholder, use mailto fallback
      if (!action || action.includes('your-form-id')) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        window.location.href = `mailto:mantunigudgi@gmail.com?subject=Portfolio contact from ${encodeURIComponent(name)}&body=${encodeURIComponent(message + '\n\n— ' + email)}`;
        if (formStatus) formStatus.textContent = 'Opening your email client…';
        return;
      }

      e.preventDefault();
      if (formStatus) formStatus.textContent = 'Sending…';

      try {
        const response = await fetch(action, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { Accept: 'application/json' },
        });

        if (response.ok) {
          contactForm.reset();
          if (formStatus) formStatus.textContent = 'Message sent! I\'ll get back to you soon.';
        } else {
          if (formStatus) formStatus.textContent = 'Something went wrong. Please email me directly.';
        }
      } catch {
        if (formStatus) formStatus.textContent = 'Network error. Please email me directly.';
      }
    });
  }
})();
