/* ========= 1. Editable sections: auto-save ke localStorage ========= */
const editableBoxes = document.querySelectorAll(".editable-box");

editableBoxes.forEach(box => {
  const key = "pitajell_" + box.dataset.key;
  const flag = document.querySelector(`.saved-flag[data-flag="${box.dataset.key}"]`);

  // load isi tersimpan sebelumnya (kalau ada)
  const saved = localStorage.getItem(key);
  if (saved) box.innerText = saved;

  let debounceTimer;
  box.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      localStorage.setItem(key, box.innerText);
      if (flag) {
        flag.classList.add("show");
        setTimeout(() => flag.classList.remove("show"), 1400);
      }
    }, 500);
  });
});

/* ========= 2. Nav: highlight section aktif saat scroll ========= */
const navLinks = document.querySelectorAll(".nav a");
const sections = document.querySelectorAll("section[id]");

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const link = document.querySelector(`.nav a[href="#${entry.target.id}"]`);
    if (!link) return;
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
    }
  });
}, { rootMargin: "-40% 0px -50% 0px" });

sections.forEach(s => navObserver.observe(s));

/* ========= 3. Reveal animasi saat scroll ========= */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

/* ========= 4. Ambil data percobaan dari backend, render + sort ========= */
const percobaanListEl = document.getElementById("percobaan-list");
const sortSelect = document.getElementById("sort-select");
let percobaanData = [];

async function loadPercobaan() {
  const res = await fetch("/api/percobaan");
  percobaanData = await res.json();
  renderPercobaan(sortData(percobaanData, sortSelect.value));
}

function sortData(data, mode) {
  const copy = [...data];
  if (mode === "suhu") copy.sort((a, b) => a.suhu_c - b.suhu_c);
  else if (mode === "waktu") copy.sort((a, b) => a.waktu_menit - b.waktu_menit);
  else if (mode === "tekstur") copy.sort((a, b) => b.skor_tekstur - a.skor_tekstur);
  else copy.sort((a, b) => a.rank - b.rank); // default: skor optimal dari backend
  return copy;
}

function renderPercobaan(data) {
  percobaanListEl.innerHTML = data.map(p => `
    <div class="percobaan-card ${p.optimal ? "optimal" : ""}">
      ${p.optimal
        ? `<div class="badge">${miniCrossSection()} Resep Paling Optimal</div>`
        : (!p.berhasil_set ? `<div class="badge badge-fail">Tidak set</div>` : "")
      }
      <h3>${p.nama}</h3>
      <div class="detail-grid">
        <div><strong>Kulit Naga</strong><span class="val">${p.kulit_naga_g} g</span></div>
        <div><strong>Air</strong><span class="val">${p.air_ml} ml</span></div>
        <div><strong>Gula</strong><span class="val">${p.gula_g} g</span></div>
        <div><strong>Suhu</strong><span class="val">${p.suhu_c}°C</span></div>
        <div><strong>Waktu</strong><span class="val">${p.waktu_menit} min</span></div>
        <div><strong>Set?</strong><span class="val">${p.berhasil_set ? "Ya" : "Tidak"}</span></div>
        <div><strong>Tekstur</strong><span class="val">${p.skor_tekstur}/5</span></div>
        <div><strong>Skor</strong><span class="val">${p.skor_optimal}</span></div>
      </div>
      <p class="catatan">${p.catatan}</p>
    </div>
  `).join("");
}

function miniCrossSection() {
  return `<svg width="13" height="13" viewBox="0 0 20 20" style="vertical-align:-2px"><circle cx="10" cy="10" r="9" fill="#fff"/><circle cx="10" cy="10" r="9" fill="#fff" opacity="0"/><circle cx="10" cy="10" r="9" fill="none" stroke="#fff" stroke-width="1.5"/><circle cx="8" cy="8" r="1.1" fill="#fff"/><circle cx="12" cy="11" r="1" fill="#fff"/><circle cx="9" cy="13" r="1" fill="#fff"/></svg>`;
}

sortSelect.addEventListener("change", () => {
  renderPercobaan(sortData(percobaanData, sortSelect.value));
});

loadPercobaan();