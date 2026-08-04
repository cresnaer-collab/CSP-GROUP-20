const percobaanListEl = document.getElementById("percobaan-list");

async function loadPercobaan() {
  const res = await fetch("/api/percobaan");
  const data = await res.json();
  renderPercobaan(data);
}

function renderPercobaan(data) {
  percobaanListEl.innerHTML = data.map(p => `
    <div class="percobaan-card ${p.optimal ? "optimal" : ""}">
      ${p.optimal ? '<div class="badge">🏆 Resep Paling Optimal</div>' : ""}
      <h3>${p.nama}</h3>
      <div class="detail-grid">
        <div><strong>Kulit naga:</strong> ${p.kulit_naga_g} g</div>
        <div><strong>Air:</strong> ${p.air_ml} ml</div>
        <div><strong>Gula:</strong> ${p.gula_g} g</div>
        <div><strong>Suhu:</strong> ${p.suhu_c}°C</div>
        <div><strong>Waktu:</strong> ${p.waktu_menit} menit</div>
        <div><strong>Berhasil set:</strong> ${p.berhasil_set ? "Ya" : "Tidak"}</div>
        <div><strong>Skor tekstur:</strong> ${p.skor_tekstur}/5</div>
        <div><strong>Skor total:</strong> ${p.skor_optimal}</div>
      </div>
      <p class="catatan">"${p.catatan}"</p>
    </div>
  `).join("");
}

loadPercobaan();
