
window.Pages = window.Pages || {};

window.venueCard = (v) => `
  <article class="card card--hover team-card stagger" data-action="go" data-route="venue/${v.id}">
    <div class="team-card__banner" style="background:linear-gradient(120deg, ${v.grad[0]}, ${v.grad[1]})">
      <div class="team-card__logo">${v.photo}</div>
    </div>
    <div class="team-card__body">
      <div class="card__head" style="margin-bottom:6px">
        <div style="flex:1; min-width:0">
          <div class="card__title">${esc(v.name)}</div>
          <div class="card__sub">${esc(v.district)}, ${esc(v.city)} • ${v.dist} km</div>
        </div>
        <span class="chip chip--yellow">${Icons.star} ${v.rating.toFixed(1)}</span>
      </div>
      <div class="meta-row" style="margin:4px 0 10px">
        <span class="meta">${Icons.money} ${v.hourly}₺/saat</span>
        ${v.amen.shower ? `<span class="meta">${Icons.shower} Duş</span>` : ""}
        ${v.amen.parking ? `<span class="meta">${Icons.car} Otopark</span>` : ""}
        ${v.amen.cafe ? `<span class="meta">${Icons.coffee} Kafe</span>` : ""}
      </div>
      <button class="btn btn--sm btn--primary btn--block" data-action="reserve-venue" data-id="${v.id}">
        Rezervasyon Yap
      </button>
    </div>
  </article>`;

let venueCityFilter = "";

Pages.venues = {
  title: "Halı Sahalar",

  render() {
    const list = DB.venues.filter((v) => !venueCityFilter || v.city === venueCityFilter);
    return `
      <div class="page-head stagger">
        <h1>Halı Sahalar</h1>
        <p>Çevrendeki en iyi sahaları keşfet ve rezerve et</p>
      </div>

      <div class="filters stagger">
        <select id="vf-city" aria-label="Şehir filtresi">
          <option value="">Tüm Şehirler</option>
          ${DB.cities.map((c) => `<option ${venueCityFilter === c ? "selected" : ""}>${c}</option>`).join("")}
        </select>
      </div>

      <div class="stack" id="venue-list">
        ${list.length ? list.map(venueCard).join("")
                      : emptyState(Icons.map, "Saha bulunamadı", "Bu şehirde kayıtlı saha yok.")}
      </div>`;
  },

  after(root) {
    $("#vf-city", root)?.addEventListener("change", (e) => {
      venueCityFilter = e.target.value;
      const list = DB.venues.filter((v) => !venueCityFilter || v.city === venueCityFilter);
      const wrap = $("#venue-list");
      wrap.innerHTML = list.length ? list.map(venueCard).join("")
                                   : emptyState(Icons.map, "Saha bulunamadı", "Bu şehirde kayıtlı saha yok.");
      applyStagger(wrap);
    });
  }
};

Pages.venue = {
  title: "Saha Profili",

  render() {
    const v = DB.venues.find((x) => x.id === App.param);
    if (!v) return emptyState(Icons.map, "Saha bulunamadı", "Bu saha kaldırılmış olabilir.");

    const amen = (ok, icon, label) => `
      <div class="amen ${ok ? "" : "off"}">${icon} ${label}${ok ? "" : " yok"}</div>`;

    const upcoming = DB.matches.filter((m) => m.venueId === v.id).slice(0, 3);

    return `
      <div class="detail-head stagger">
        <button class="icon-btn" data-action="back" aria-label="Geri">${Icons.back}</button>
        <h1>${esc(v.name)}</h1>
      </div>

      <!-- Kapak -->
      <div class="cover stagger" style="background:linear-gradient(130deg, ${v.grad[0]}, ${v.grad[1]})">
        <div class="cover__pattern"></div>
        <div class="cover__logo">${v.photo}</div>
      </div>

      <div class="card__head stagger" style="margin-bottom:4px">
        <div style="flex:1">
          <div class="card__title" style="font-size:17px">${esc(v.name)}</div>
          <div class="card__sub">${esc(v.district)}, ${esc(v.city)} • ${v.dist} km uzaklıkta</div>
        </div>
        <span class="chip chip--yellow">${Icons.star} ${v.rating.toFixed(1)}</span>
      </div>
      <p class="muted stagger" style="margin:8px 0 16px; line-height:1.6">${esc(v.desc)}</p>

      <!-- Olanaklar -->
      ${sectionTitle(Icons.check, "Olanaklar")}
      <div class="amen-grid stagger">
        ${amen(v.amen.shower, Icons.shower, "Duş")}
        ${amen(v.amen.cafe, Icons.coffee, "Kafe")}
        ${amen(v.amen.parking, Icons.car, "Otopark")}
        ${amen(v.amen.lights, Icons.lamp, "Aydınlatma")}
        <div class="amen" style="grid-column:1/-1">${Icons.grass} ${esc(v.amen.turf)}</div>
      </div>

      <!-- İletişim + fiyat -->
      <div class="stat-grid stagger" style="grid-template-columns:1fr 1fr">
        <div><b>${v.hourly}₺</b><span>Saat Kirası</span></div>
        <div><b style="font-size:14px; line-height:2">${esc(v.phone)}</b><span>Telefon</span></div>
      </div>

      <!-- Bu sahadaki maçlar -->
      ${upcoming.length ? sectionTitle(Icons.ball, "Bu Sahadaki Maçlar") + `
        <div class="stack">${upcoming.map(matchCard).join("")}</div>` : ""}

      <!-- Rezervasyon -->
      <div class="sticky-cta stagger">
        <button class="btn btn--primary btn--block" data-action="reserve-venue" data-id="${v.id}">
          ${Icons.calendar} Rezervasyon Yap — ${v.hourly}₺/saat
        </button>
      </div>`;
  }
};

Object.assign(Actions, {

  "reserve-venue"(data) {
    const v = DB.venues.find((x) => x.id === data.id);
    if (!v) return;

    Modal.open("Saha Rezervasyonu", `
      <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px">
        <div class="tile-icon" style="font-size:22px">${v.photo}</div>
        <div>
          <div class="card__title">${esc(v.name)}</div>
          <div class="card__sub">${esc(v.district)}, ${esc(v.city)} • ${v.hourly}₺/saat</div>
        </div>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px">
        <div class="field">
          <label for="rv-date">Tarih</label>
          <input id="rv-date" type="date" value="${new Date().toISOString().slice(0, 10)}" />
        </div>
        <div class="field">
          <label for="rv-time">Saat</label>
          <input id="rv-time" type="time" value="21:00" />
        </div>
      </div>
      <button class="btn btn--primary btn--block" id="rv-confirm">${Icons.check} Rezervasyonu Onayla</button>
    `, (modal) => {
      $("#rv-confirm", modal).addEventListener("click", () => {
        Modal.close();
        Toast.success(`Rezervasyon talebin iletildi: ${v.name} 🏟️`);
      });
    });
  }
});
