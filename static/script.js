/* ==========================================================================
   PITAJELL — Frontend Interaction Logic
   Active navbar tracking, reveal animations, mascot infinite animation loop,
   and bioactive health showcase interactions.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initRevealAnimations();
  initMascotAnimation();
  initBioactiveShowcase();
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

/* ─── 3. MASCOT DUAL-STAGE & TYPEWRITER INFINITE ANIMATION SEQUENCER ─── */
function initMascotAnimation() {
  const mascotWrap = document.getElementById("mascot-wrap");
  const speechBubble = document.getElementById("speech-bubble");
  const typewriterText = document.getElementById("typewriter-text");
  if (!mascotWrap || !speechBubble || !typewriterText) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) {
    mascotWrap.classList.add("floating");
    speechBubble.classList.add("visible");
    typewriterText.textContent = "H E L L O ! !";
    return;
  }

  const message = "H E L L O ! !";

  function typeText(callback) {
    typewriterText.textContent = "";
    let charIndex = 0;
    speechBubble.classList.add("visible");

    function typeChar() {
      if (charIndex < message.length) {
        typewriterText.textContent += message.charAt(charIndex);
        charIndex++;
        setTimeout(typeChar, 80);
      } else if (callback) {
        callback();
      }
    }

    typeChar();
  }

  function startSequence() {
    // 1. Entrance: Mascot enters from off-screen right
    mascotWrap.className = "mascot-wrap entering";

    setTimeout(() => {
      // 2. Ambient Floating once stationed
      mascotWrap.className = "mascot-wrap floating";

      // 3. Typewriter: Reveal speech bubble and type text
      typeText(() => {
        // 4. Pause: Mascot continues floating for exactly 7 seconds
        setTimeout(() => {
          // 5. Exit: Hide bubble and fly off-screen left
          speechBubble.classList.remove("visible");
          mascotWrap.className = "mascot-wrap exiting";

          setTimeout(() => {
            // 6. Reset: Instantly reset to off-screen right without transition
            mascotWrap.className = "mascot-wrap resetting";
            setTimeout(() => {
              startSequence();
            }, 50);
          }, 1200); // match exit transition duration
        }, 7000); // 7 seconds pause
      });
    }, 1200); // match entrance transition duration
  }

  startSequence();
}

/* ─── 4. BIOACTIVE HEALTH SHOWCASE WIDGET INTERACTION ─── */
function initBioactiveShowcase() {
  const cards = document.querySelectorAll(".bioactive-card");
  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener("click", () => {
      cards.forEach(c => c.classList.remove("active"));
      card.classList.add("active");
    });
  });
}