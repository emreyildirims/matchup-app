
window.Pages = window.Pages || {};

const matchFilters = { city: "", position: "", time: "", price: "", dist: "" };

function filterMatches() {
  return DB.matches.filter((m) => {
    if (matchFilters.city && m.city !== matchFilters.city) return false;
    if (matchFilters.position && m.position !== matchFilters.position) return false;
    if (matchFilters.time) {
      const h = parseInt(m.time, 10);
      if (matchFilters.time === "early" && h >= 20) return false;
      if (matchFilters.time === "evening" && (h < 20 || h >= 22)) return false;
      if (matchFilters.time === "night" && h < 22) return false;
    }
    if (matchFilters.price === "low" && m.price > 80) return false;
    if (matchFilters.price === "high" && m.price <= 80) return false;
    if (matchFilters.dist === "near" && m.dist > 3) return false;
    if (matchFilters.dist === "mid" && m.dist > 10) return false;
    return true;
  });
}

function rerenderMatchList() {
  const wrap = $("#match-list");
  if (!wrap) return;
  const list = filterMatches();
  wrap.innerHTML = list.length
    ? list.map(matchCard).join("")
    : emptyState(Icons.ball, "Maç bulunamadı", "Filtreleri değiştirerek tekrar dene.");
  applyStagger(wrap);
}

Pages.matches = {
  title: "Maçlar",

  render() {
    return `
      <div class="page-head stagger">
        <h1>Maçlar</h1>
        <p>Eksik oyuncu arayan maçlara katıl</p>
      </div>

      <!-- FİLTRE ÇUBUĞU -->
      <div class="filters stagger">
        <select id="f-city" aria-label="Şehir filtresi">
          <option value="">Tüm Şehirler</option>
          ${DB.cities.map((c) => `<option ${matchFilters.city === c ? "selected" : ""}>${c}</option>`).join("")}
        </select>
        <select id="f-pos" aria-label="Pozisyon filtresi">
          <option value="">Tüm Pozisyonlar</option>
          ${DB.positions.map((p) => `<option ${matchFilters.position === p ? "selected" : ""}>${p}</option>`).join("")}
        </select>
        <select id="f-time" aria-label="Saat filtresi">
          <option value="">Tüm Saatler</option>
          <option value="early"   ${matchFilters.time === "early" ? "selected" : ""}>20:00 öncesi</option>
          <option value="evening" ${matchFilters.time === "evening" ? "selected" : ""}>20:00 – 22:00</option>
          <option value="night"   ${matchFilters.time === "night" ? "selected" : ""}>22:00 sonrası</option>
        </select>
        <select id="f-price" aria-label="Ücret filtresi">
          <option value="">Tüm Ücretler</option>
          <option value="low"  ${matchFilters.price === "low" ? "selected" : ""}>80₺ ve altı</option>
          <option value="high" ${matchFilters.price === "high" ? "selected" : ""}>80₺ üzeri</option>
        </select>
        <select id="f-dist" aria-label="Mesafe filtresi">
          <option value="">Tüm Mesafeler</option>
          <option value="near" ${matchFilters.dist === "near" ? "selected" : ""}>3 km içinde</option>
          <option value="mid"  ${matchFilters.dist === "mid" ? "selected" : ""}>10 km içinde</option>
        </select>
      </div>

      <!-- Maç listesi -->
      <div class="stack" id="match-list">
        ${filterMatches().map(matchCard).join("")}
      </div>

      <!-- Halı sahalara kısayol -->
      ${sectionTitle(Icons.map, "Sahaları Keşfet", "venues")}
      <div class="stack">
        ${DB.venues.slice(0, 2).map(venueCard).join("")}
      </div>`;
  },

  after(root) {
    const bind = (id, key) =>
      $(id, root)?.addEventListener("change", (e) => {
        matchFilters[key] = e.target.value;
        rerenderMatchList();
      });
    bind("#f-city", "city");
    bind("#f-pos", "position");
    bind("#f-time", "time");
    bind("#f-price", "price");
    bind("#f-dist", "dist");
  }
};

Object.assign(Actions, {
  "join-match"(data, btn) {
    const joined = Store.get("joinedMatches", []);
    if (joined.includes(data.id)) return;

    joined.push(data.id);
    Store.set("joinedMatches", joined);

    btn.classList.remove("btn--primary");
    btn.classList.add("btn--done");
    btn.innerHTML = `${Icons.check} Katıldın`;

    const m = DB.matches.find((x) => x.id === data.id);
    Toast.success(`Maça katıldın: ${m ? m.team : ""} ⚽`);
  }
});
