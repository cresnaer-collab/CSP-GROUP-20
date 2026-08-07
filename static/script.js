/* ==========================================================================
   PITAJELL — Frontend Interaction Logic
   Active navbar tracking, reveal animations, mascot animation sequencing
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initRevealAnimations();
  initMascotAnimation();
});

/* ─── 1. STICKY NAV, SCROLL TRACKING & MOBILE MENU ─── */
function initNav() {
  const nav = document.getElementById("main-nav");
  const navLinks = document.querySelectorAll(".nav-links a");
  const sections = document.querySelectorAll("section[id], header[id]");
  const navToggle = document.getElementById("nav-toggle");
  const navLinksContainer = document.getElementById("nav-links");

  // Add shadow on scroll
  if (nav) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 10) {
        nav.classList.add("scrolled");
      } else {
        nav.classList.remove("scrolled");
      }
    }, { passive: true });
  }

  // Mobile menu toggle
  if (navToggle && navLinksContainer) {
    navToggle.addEventListener("click", () => {
      navLinksContainer.classList.toggle("open");
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        navLinksContainer.classList.remove("open");
      });
    });
  }

  // Active section tracking on scroll via IntersectionObserver
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach(link => {
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      }
    });
  }, {
    rootMargin: "-20% 0px -60% 0px",
    threshold: 0
  });

  sections.forEach(sec => navObserver.observe(sec));
}

/* ─── 2. REVEAL ANIMATIONS ON SCROLL ─── */
function initRevealAnimations() {
  const reveals = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  reveals.forEach(el => revealObserver.observe(el));
}

/* ─── 3. MASCOT DUAL-STAGE ANIMATION SEQUENCER ─── */
function initMascotAnimation() {
  const mascotWrap = document.querySelector(".mascot-wrap");
  if (!mascotWrap) return;

  // Listen for the fly-in animation to end, then switch to floating
  mascotWrap.addEventListener("animationend", (e) => {
    if (e.animationName === "flyInRight") {
      // Small delay to ensure smooth transition between stages
      requestAnimationFrame(() => {
        mascotWrap.classList.add("floating");
      });
    }
  });
}