
window.Pages = window.Pages || {};

const gkFilters = { city: "", avail: "", price: "" };

function filterKeepers() {
  return DB.goalkeepers.filter((g) => {
    if (gkFilters.city && g.city !== gkFilters.city) return false;
    if (gkFilters.avail === "yes" && !g.available) return false;
    if (gkFilters.avail === "today" && !g.today) return false;
    if (gkFilters.price === "low" && g.fee > 220) return false;
    if (gkFilters.price === "high" && g.fee <= 220) return false;
    return true;
  });
}

window.keeperCard = (g) => {
  const reserved = Store.get("reservations", []).includes(g.id);
  return `
  <article class="card card--hover stagger">
    <div class="card__head">
      <div style="position:relative">
        ${avatar(g.name, "lg")}
        <span class="odot ${g.online ? "on" : ""}" style="position:absolute; bottom:4px; right:2px; border:2px solid var(--surface)"></span>
      </div>
      <div style="flex:1; min-width:0">
        <div class="card__title">${esc(g.name)} ${badges(g)}</div>
        <div class="card__sub">${esc(g.city)} • ${esc(g.last)}</div>
        <div style="margin-top:5px">${trustStars(g.trust)}</div>
      </div>
      <div style="display:flex; flex-direction:column; align-items:flex-end; gap:6px">
        ${favBtn("keeper", g.id)}
        ${g.today ? `<span class="gk-today">${Icons.check} Bugün uygun</span>`
                  : `<span class="chip ${g.available ? "chip--gray" : "chip--red"}">${g.available ? "Müsait" : "Dolu"}</span>`}
      </div>
    </div>

    <div class="gk-card__stats">
      <div><b>${g.matches}</b><span>Maç</span></div>
      <div><b>${g.cs}</b><span>Clean Sheet</span></div>
      <div><b>%${Math.round((g.cs / g.matches) * 100)}</b><span>CS Oranı</span></div>
    </div>

    <div style="display:flex; align-items:center; justify-content:space-between; gap:10px">
      <div>
        <b style="font-size:19px">${g.fee}₺</b>
        <span class="muted"> / saat</span>
      </div>
      <button class="btn btn--sm ${reserved ? "btn--done" : g.available ? "btn--primary" : "btn--ghost"}"
              data-action="reserve-keeper" data-id="${g.id}" ${g.available || reserved ? "" : "disabled"}>
        ${reserved ? `${Icons.check} Rezerve Edildi` : g.available ? "Rezervasyon Yap" : "Müsait Değil"}
      </button>
    </div>
  </article>`;
};

function rerenderKeeperList() {
  const wrap = $("#gk-list");
  if (!wrap) return;
  const list = filterKeepers();
  wrap.innerHTML = list.length
    ? list.map(keeperCard).join("")
    : emptyState(Icons.glove, "Kaleci bulunamadı", "Filtreleri gevşetip tekrar dene.");
  applyStagger(wrap);
}

Pages.goalkeepers = {
  title: "Kaleciler",

  render() {
    const todayCount = DB.goalkeepers.filter((g) => g.today).length;
    return `
      <div class="page-head stagger">
        <h1>Kaleci Kirala</h1>
        <p>${todayCount} kaleci bugün müsait — dakikalar içinde rezerve et</p>
      </div>

      <!-- Filtreler: şehir / müsaitlik / ücret -->
      <div class="filters stagger">
        <select id="gk-city" aria-label="Şehir filtresi">
          <option value="">Tüm Şehirler</option>
          ${DB.cities.map((c) => `<option ${gkFilters.city === c ? "selected" : ""}>${c}</option>`).join("")}
        </select>
        <select id="gk-avail" aria-label="Müsaitlik filtresi">
          <option value="">Hepsi</option>
          <option value="today" ${gkFilters.avail === "today" ? "selected" : ""}>Bugün uygun</option>
          <option value="yes"   ${gkFilters.avail === "yes" ? "selected" : ""}>Müsait</option>
        </select>
        <select id="gk-price" aria-label="Ücret filtresi">
          <option value="">Tüm Ücretler</option>
          <option value="low"  ${gkFilters.price === "low" ? "selected" : ""}>220₺/saat ve altı</option>
          <option value="high" ${gkFilters.price === "high" ? "selected" : ""}>220₺/saat üzeri</option>
        </select>
      </div>

      <div class="stack" id="gk-list">
        ${filterKeepers().map(keeperCard).join("")}
      </div>`;
  },

  after(root) {
    const bind = (id, key) =>
      $(id, root)?.addEventListener("change", (e) => {
        gkFilters[key] = e.target.value;
        rerenderKeeperList();
      });
    bind("#gk-city", "city");
    bind("#gk-avail", "avail");
    bind("#gk-price", "price");
  }
};

Object.assign(Actions, {

  "reserve-keeper"(data) {
    const g = DB.goalkeepers.find((x) => x.id === data.id);
    if (!g) return;

    if (Store.get("reservations", []).includes(g.id)) {
      Toast.info("Bu kaleciyi zaten rezerve ettin");
      return;
    }

    Modal.open("Rezervasyon Onayı", `
      <div style="display:flex; flex-direction:column; align-items:center; gap:10px; text-align:center; margin-bottom:18px">
        ${avatar(g.name, "lg")}
        <div>
          <div class="card__title" style="font-size:17px">${esc(g.name)} ${badges(g)}</div>
          <div class="card__sub">${esc(g.city)} • ${g.matches} maç • ${g.cs} clean sheet</div>
        </div>
        <div style="display:flex; gap:8px; align-items:center">${trustStars(g.trust)}
          <span class="chip">${Icons.money} ${g.fee}₺ / saat</span>
        </div>
      </div>
      <p class="muted" style="text-align:center; margin-bottom:16px">
        Rezervasyon sonrası kaleci seninle uygulama içinden iletişime geçecek.
        Ücret sahada elden ödenir.
      </p>
      <button class="btn btn--primary btn--block" id="gk-confirm">${Icons.check} Rezervasyonu Onayla</button>
    `, (modal) => {
      $("#gk-confirm", modal).addEventListener("click", () => {
        const res = Store.get("reservations", []);
        res.push(g.id);
        Store.set("reservations", res);

        Modal.close();
        Toast.success(`Rezervasyon onaylandı: ${g.name} 🧤`);
        rerenderKeeperList();
      });
    });
  }
});
