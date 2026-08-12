/* ==========================================================================
   PITAJELL — Frontend Interaction Logic
   Active navbar tracking, reveal animations, mascot infinite animation loop,
   bioactive health showcase interactions, and interactive recipe calculator.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initRevealAnimations();
  initMascotAnimation();
  initBioactiveShowcase();
  initRecipeCalculator();
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

/* ─── 5. INTERACTIVE RECIPE BATCH CALCULATOR ─── */
function initRecipeCalculator() {
  const batchInput = document.getElementById("calcBatchInput");
  const minusBtn = document.getElementById("calcMinusBtn");
  const plusBtn = document.getElementById("calcPlusBtn");
  const sizeSelect = document.getElementById("calcBatchSizeSelect");
  const lemonSelect = document.getElementById("calcLemonSelect");
  const gellingSelect = document.getElementById("calcGellingSelect");

  if (!batchInput || !minusBtn || !plusBtn || !sizeSelect || !lemonSelect || !gellingSelect) return;

  // Event Listeners for Controls
  minusBtn.addEventListener("click", () => {
    let val = parseInt(batchInput.value) || 1;
    if (val > 1) {
      batchInput.value = val - 1;
      updateCalculator();
    }
  });

  plusBtn.addEventListener("click", () => {
    let val = parseInt(batchInput.value) || 1;
    if (val < 50) {
      batchInput.value = val + 1;
      updateCalculator();
    }
  });

  sizeSelect.addEventListener("change", updateCalculator);
  lemonSelect.addEventListener("change", updateCalculator);
  gellingSelect.addEventListener("change", updateCalculator);

  function updateCalculator() {
    const qty = parseInt(batchInput.value) || 1;
    const sizeMult = parseFloat(sizeSelect.value) || 1;
    const totalMult = qty * sizeMult;

    const lemonVal = parseFloat(lemonSelect.value) || 0;
    const gellingType = gellingSelect.value; // 'gelatin' or 'agar'

    // Base 1-batch quantities (Table 2 Standards: 120g fruit base)
    const baseFruit = 120;
    const baseWater = 100;
    const baseSugar = 6;        // tbsp
    const baseCornstarch = 1;   // tsp
    const baseGinger = 10;      // g

    // Estimated unit costs
    const costFruit = 6720;
    const costWater = 200;
    const costSugar = 2250;
    const costCornstarch = 300;
    const costGinger = 350;

    // Multiplied quantities
    const fruitGrams = baseFruit * totalMult;
    const skinGrams = Math.round(fruitGrams * 0.2);
    const fleshGrams = fruitGrams - skinGrams;
    const waterMl = baseWater * totalMult;
    const sugarTbsp = baseSugar * totalMult;
    const cornstarchTsp = baseCornstarch * totalMult;
    const gingerGrams = baseGinger * totalMult;
    const lemonMl = lemonVal * totalMult;

    // Item costs
    const itemCostFruit = Math.round(costFruit * totalMult);
    const itemCostWater = Math.round(costWater * totalMult);
    const itemCostSugar = Math.round(costSugar * totalMult);
    const itemCostCornstarch = Math.round(costCornstarch * totalMult);
    const itemCostGinger = Math.round(costGinger * totalMult);
    const itemCostLemon = Math.round(lemonMl * (1250 / 15));

    // Dynamic Gelling Agent Logic
    let gellingAmountText = "";
    let itemCostGelling = 0;
    const labelGelling = document.getElementById("labelGelling");
    const subGelling = document.getElementById("subGelling");

    if (gellingType === "gelatin") {
      const gelatinTbsp = 1 * totalMult; // 1 tbsp base
      gellingAmountText = formatFraction(gelatinTbsp, "tbsp");
      itemCostGelling = Math.round(3500 * totalMult);
      if (labelGelling) labelGelling.textContent = "Bovine Gelatin";
      if (subGelling) subGelling.textContent = "Structure & chewiness setting agent";
    } else {
      const agarSachets = 1 * totalMult; // 1 sachet base
      gellingAmountText = `${agarSachets} Sachet${agarSachets > 1 ? "s" : ""}`;
      itemCostGelling = Math.round(4000 * totalMult);
      if (labelGelling) labelGelling.textContent = "Agar Powder";
      if (subGelling) subGelling.textContent = "Firm gel texture setting agent";
    }

    const totalCost = itemCostFruit + itemCostWater + itemCostGelling + itemCostSugar + itemCostCornstarch + itemCostGinger + itemCostLemon;
    const costPerBatch = Math.round(totalCost / qty);

    // Formatter Helpers
    const fmtPrice = (num) => "Rp " + num.toLocaleString("en-US");

    // Header Update
    const displayTitle = document.getElementById("calcDisplayTitle");
    if (displayTitle) displayTitle.textContent = `${qty} ${qty === 1 ? "Batch" : "Batches"} PitaJell`;

    // Row Updates
    const elValFruit = document.getElementById("valFruit");
    const elPriceFruit = document.getElementById("priceFruit");
    const elFruitSub = document.getElementById("calcFruitSub");
    if (elValFruit) elValFruit.textContent = `${fruitGrams} g`;
    if (elPriceFruit) elPriceFruit.textContent = fmtPrice(itemCostFruit);
    if (elFruitSub) elFruitSub.textContent = `${skinGrams}g skin & ${fleshGrams}g flesh (20% peel ratio)`;

    const elValWater = document.getElementById("valWater");
    const elPriceWater = document.getElementById("priceWater");
    if (elValWater) elValWater.textContent = `${waterMl} ml`;
    if (elPriceWater) elPriceWater.textContent = fmtPrice(itemCostWater);

    const elValGelling = document.getElementById("valGelling");
    const elPriceGelling = document.getElementById("priceGelling");
    if (elValGelling) elValGelling.textContent = gellingAmountText;
    if (elPriceGelling) elPriceGelling.textContent = fmtPrice(itemCostGelling);

    const elValSugar = document.getElementById("valSugar");
    const elPriceSugar = document.getElementById("priceSugar");
    if (elValSugar) elValSugar.textContent = formatFraction(sugarTbsp, "tbsp");
    if (elPriceSugar) elPriceSugar.textContent = fmtPrice(itemCostSugar);

    const elValCornstarch = document.getElementById("valCornstarch");
    const elPriceCornstarch = document.getElementById("priceCornstarch");
    if (elValCornstarch) elValCornstarch.textContent = formatFraction(cornstarchTsp, "tsp");
    if (elPriceCornstarch) elPriceCornstarch.textContent = fmtPrice(itemCostCornstarch);

    const elValGinger = document.getElementById("valGinger");
    const elPriceGinger = document.getElementById("priceGinger");
    if (elValGinger) elValGinger.textContent = `${gingerGrams} g`;
    if (elPriceGinger) elPriceGinger.textContent = fmtPrice(itemCostGinger);

    const elValLemon = document.getElementById("valLemon");
    const elPriceLemon = document.getElementById("priceLemon");
    if (elValLemon) elValLemon.textContent = `${lemonMl} ml`;
    if (elPriceLemon) elPriceLemon.textContent = fmtPrice(itemCostLemon);

    // Footer Total Cost Updates
    const elCostPerBatch = document.getElementById("calcCostPerBatch");
    const elTotalPrice = document.getElementById("calcTotalPrice");
    if (elCostPerBatch) elCostPerBatch.textContent = `≈ Rp ${costPerBatch.toLocaleString("en-US")} per batch`;
    if (elTotalPrice) elTotalPrice.textContent = fmtPrice(totalCost);
  }

  function formatFraction(num, unit) {
    const whole = Math.floor(num);
    const remainder = num - whole;
    let fracStr = "";
    if (Math.abs(remainder - 0.5) < 0.05) {
      fracStr = "½";
    } else if (Math.abs(remainder - 0.25) < 0.05) {
      fracStr = "¼";
    } else if (Math.abs(remainder - 0.75) < 0.05) {
      fracStr = "¾";
    }

    if (whole === 0) {
      return `${fracStr || remainder.toFixed(1)} ${unit}`;
    } else if (fracStr !== "") {
      return `${whole}${fracStr} ${unit}`;
    } else {
      return `${whole} ${unit}`;
    }
  }

  updateCalculator();
}
