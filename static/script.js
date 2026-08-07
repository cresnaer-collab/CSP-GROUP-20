/* ==========================================================================
   PITAJELL — FRONTEND INTERACTION & CALCULATOR LOGIC
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initRevealAnimations();
  initBatchCalculator();
  initRecipeFinder();
});

/* ─── 1. STICKY NAV & MOBILE MENU ─── */
function initNav() {
  const navLinks = document.querySelectorAll(".nav-links a");
  const sections = document.querySelectorAll("section[id], header[id]");
  const navToggle = document.getElementById("nav-toggle");
  const navLinksContainer = document.querySelector(".nav-links");

  // Mobile menu toggle
  if (navToggle && navLinksContainer) {
    navToggle.addEventListener("click", () => {
      navLinksContainer.classList.toggle("show");
    });

    // Close menu when clicking link
    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        navLinksContainer.classList.remove("show");
      });
    });
  }

  // Active section tracking on scroll
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
  }, { threshold: 0.35 });

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

/* ─── 3. BATCH & INGREDIENT CALCULATOR ─── */
function initBatchCalculator() {
  const numberInput = document.getElementById("fruit-input");
  const sliderInput = document.getElementById("fruit-slider");

  const elSkin = document.getElementById("calc-skin");
  const elFlesh = document.getElementById("calc-flesh");
  const elGelatin = document.getElementById("calc-gelatin");
  const elSugar = document.getElementById("calc-sugar");
  const elCornstarch = document.getElementById("calc-cornstarch");
  const elCitric = document.getElementById("calc-citric");

  if (!numberInput || !sliderInput) return;

  function calculate(weight) {
    // Prevent invalid or negative inputs
    if (isNaN(weight) || weight <= 0) weight = 1;

    // Base ratio per 100g total fruit (50g skin : 50g flesh)
    const factor = weight / 100;

    const skin = Math.round(50 * factor);
    const flesh = Math.round(50 * factor);
    const gelatin = Math.round(100 * factor);
    const sugar = Math.round(380 * factor);
    const cornstarch = (0.5 * factor).toFixed(2);
    const citric = (0.5 * factor).toFixed(2);

    if (elSkin) elSkin.textContent = skin.toLocaleString();
    if (elFlesh) elFlesh.textContent = flesh.toLocaleString();
    if (elGelatin) elGelatin.textContent = gelatin.toLocaleString();
    if (elSugar) elSugar.textContent = sugar.toLocaleString();
    if (elCornstarch) elCornstarch.textContent = cornstarch;
    if (elCitric) elCitric.textContent = citric;
  }

  // Sync inputs
  numberInput.addEventListener("input", (e) => {
    let val = parseFloat(e.target.value);
    if (isNaN(val)) val = 1;
    sliderInput.value = Math.min(val, 2000);
    calculate(val);
  });

  sliderInput.addEventListener("input", (e) => {
    const val = parseFloat(e.target.value);
    numberInput.value = val;
    calculate(val);
  });

  // Initial calc
  calculate(parseFloat(numberInput.value) || 100);
}

/* ─── 4. EXPERIMENTAL RESULTS & RECIPE FINDER ─── */
let percobaanData = [];

async function initRecipeFinder() {
  const listEl = document.getElementById("percobaan-list");
  const sortSelect = document.getElementById("sort-select");

  if (!listEl) return;

  try {
    const res = await fetch("/api/percobaan");
    if (!res.ok) throw new Error("Failed to fetch data");
    percobaanData = await res.json();
    
    if (sortSelect) {
      renderPercobaan(sortData(percobaanData, sortSelect.value), listEl);
      sortSelect.addEventListener("change", () => {
        renderPercobaan(sortData(percobaanData, sortSelect.value), listEl);
      });
    } else {
      renderPercobaan(percobaanData, listEl);
    }
  } catch (err) {
    console.error("Error loading recipe data:", err);
    listEl.innerHTML = `<p style="color: var(--text-muted);">Failed to load experimental recipe data. Please refresh.</p>`;
  }
}

function sortData(data, mode) {
  const copy = [...data];
  if (mode === "suhu") {
    copy.sort((a, b) => a.suhu_c - b.suhu_c);
  } else if (mode === "waktu") {
    copy.sort((a, b) => a.waktu_menit - b.waktu_menit);
  } else if (mode === "tekstur") {
    copy.sort((a, b) => b.skor_tekstur - a.skor_tekstur);
  } else {
    // Default: optimal score rank from backend
    copy.sort((a, b) => a.rank - b.rank);
  }
  return copy;
}

function renderPercobaan(data, container) {
  if (!data || data.length === 0) {
    container.innerHTML = `<p style="color: var(--text-muted);">No experimental data available.</p>`;
    return;
  }

  container.innerHTML = data.map(p => `
    <div class="percobaan-card ${p.optimal ? "optimal" : ""}">
      ${p.optimal
        ? `<div class="badge">✦ Most Optimal Recipe</div>`
        : (!p.berhasil_set ? `<div class="badge badge-fail">Did Not Set</div>` : "")
      }
      <h3>${escapeHtml(p.nama)}</h3>
      <div class="detail-grid">
        <div><strong>Peel</strong><span class="val">${p.kulit_naga_g}g</span></div>
        <div><strong>Flesh</strong><span class="val">${p.daging_naga_g || 50}g</span></div>
        <div><strong>Gelatin</strong><span class="val">${p.gelatin_g || 100}g</span></div>
        <div><strong>Sugar</strong><span class="val">${p.gula_g}g</span></div>
        <div><strong>Temp</strong><span class="val">${p.suhu_c}°C</span></div>
        <div><strong>Time</strong><span class="val">${p.waktu_menit}m</span></div>
        <div><strong>Set?</strong><span class="val">${p.berhasil_set ? "Yes" : "No"}</span></div>
        <div><strong>Texture</strong><span class="val">${p.skor_tekstur}/5</span></div>
        <div><strong>Score</strong><span class="val">${p.skor_optimal}</span></div>
      </div>
      <p class="catatan">${escapeHtml(p.catatan)}</p>
    </div>
  `).join("");
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}