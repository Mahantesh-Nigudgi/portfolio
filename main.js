(() => {
  "use strict";

  const header = document.querySelector(".site-header");
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link");
  const year = document.getElementById("year");

  if (year) year.textContent = new Date().getFullYear();

  // Sticky header
  const handleScroll = () => {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  // Mobile navigation
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const open = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  // Active navigation based on section currently in view
  const sections = [...document.querySelectorAll("main section[id]")];

  const updateActiveNav = () => {
    const y = window.scrollY + 130;
    let current = "";

    sections.forEach(section => {
      if (y >= section.offsetTop && y < section.offsetTop + section.offsetHeight) {
        current = section.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
    });
  };

  window.addEventListener("scroll", updateActiveNav, { passive: true });
  updateActiveNav();

  // Scroll reveal
  const revealItems = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });

    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("is-visible"));
  }
})();
