
window.Pages = window.Pages || {};

window.playerMiniCard = (p) => `
  <article class="player-card stagger" data-action="go" data-route="player/${p.id}">
    <div class="player-card__ovr">${p.ovr}<span>OVR</span></div>
    <span class="player-card__fav">${favBtn("player", p.id)}</span>
    <div style="position:relative; display:inline-block">
      ${avatar(p.name, "lg")}
      <span class="odot ${p.online ? "on" : ""}" style="position:absolute; bottom:5px; right:3px; border:2px solid var(--surface)"></span>
    </div>
    <div class="player-card__name">${esc(p.name)} ${badges(p)}</div>
    <div class="player-card__sub">${esc(p.pos)} • ${esc(p.city)}</div>
    ${trustStars(p.trust, false)}
    <div class="player-card__last">${esc(p.last)}</div>
  </article>`;

const plFilters = { city: "", pos: "" };

function filterPlayers() {
  return DB.players.filter((p) => {
    if (plFilters.city && p.city !== plFilters.city) return false;
    if (plFilters.pos && p.pos !== plFilters.pos) return false;
    return true;
  });
}

Pages.players = {
  title: "Oyuncular",

  render() {
    const online = DB.players.filter((p) => p.online).length;
    return `
      <div class="page-head stagger">
        <h1>Oyuncular</h1>
        <p>${online} oyuncu şu an aktif — kadronu güçlendir</p>
      </div>

      <div class="filters stagger">
        <select id="pl-city" aria-label="Şehir filtresi">
          <option value="">Tüm Şehirler</option>
          ${DB.cities.map((c) => `<option ${plFilters.city === c ? "selected" : ""}>${c}</option>`).join("")}
        </select>
        <select id="pl-pos" aria-label="Pozisyon filtresi">
          <option value="">Tüm Pozisyonlar</option>
          ${DB.positions.filter((p) => p !== "Fark Etmez").map((p) => `<option ${plFilters.pos === p ? "selected" : ""}>${p}</option>`).join("")}
        </select>
      </div>

      <div class="player-grid" id="pl-grid">
        ${filterPlayers().map(playerMiniCard).join("")}
      </div>`;
  },

  after(root) {
    const rerender = () => {
      const grid = $("#pl-grid");
      const list = filterPlayers();
      grid.innerHTML = list.length
        ? list.map(playerMiniCard).join("")
        : emptyState(Icons.user, "Oyuncu bulunamadı", "Filtreleri değiştirerek tekrar dene.");
      applyStagger(grid);
    };
    $("#pl-city", root)?.addEventListener("change", (e) => { plFilters.city = e.target.value; rerender(); });
    $("#pl-pos", root)?.addEventListener("change", (e) => { plFilters.pos = e.target.value; rerender(); });
  }
};

function allListings() {
  return [...Store.get("myListings", []), ...DB.listings];
}

Pages.findplayer = {
  title: "Oyuncu Bul",

  render() {
    return `
      <div class="page-head stagger">
        <h1>Oyuncu Bul</h1>
        <p>İlan aç, dakikalar içinde eksiğini tamamla</p>
      </div>

      <!-- İLAN FORMU -->
      <div class="card stagger" style="margin-bottom:20px">
        <div class="card__head">
          <div class="tile-icon">${Icons.plus}</div>
          <div>
            <div class="card__title">Yeni İlan Aç</div>
            <div class="card__sub">Hangi pozisyonda kaç oyuncuya ihtiyacın var?</div>
          </div>
        </div>

        <div class="field">
          <label for="fp-pos">Pozisyon</label>
          <select id="fp-pos">
            ${DB.positions.map((p) => `<option>${p}</option>`).join("")}
          </select>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px">
          <div class="field">
            <label for="fp-time">Saat</label>
            <input id="fp-time" type="time" value="21:00" />
          </div>
          <div class="field">
            <label for="fp-count">Kaç Kişi Lazım</label>
            <select id="fp-count">
              ${[1, 2, 3, 4, 5].map((n) => `<option>${n}</option>`).join("")}
            </select>
          </div>
        </div>

        <div class="field">
          <label for="fp-city">Şehir</label>
          <select id="fp-city">
            ${DB.cities.map((c) => `<option>${c}</option>`).join("")}
          </select>
        </div>

        <div class="field">
          <label for="fp-note">Not (opsiyonel)</label>
          <textarea id="fp-note" maxlength="140" placeholder="ör. Seviye orta, saha ücreti bölüşülür..."></textarea>
        </div>

        <button class="btn btn--primary btn--block" data-action="publish-listing">
          ${Icons.whistle} İlanı Yayınla
        </button>
      </div>

      <!-- İLAN LİSTESİ -->
      ${sectionTitle(Icons.whistle, "Açık İlanlar")}
      <div class="stack" id="listing-list">
        ${allListings().map(listingCard).join("")}
      </div>`;
  }
};

Object.assign(Actions, {

  "publish-listing"() {
    const time = $("#fp-time").value;
    if (!time) {
      Toast.error("Lütfen bir saat seç");
      return;
    }

    const listing = {
      id: "ml-" + Date.now(),
      position: $("#fp-pos").value,
      time,
      date: new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "long", weekday: "long" }),
      city: $("#fp-city").value,
      count: parseInt($("#fp-count").value, 10),
      note: $("#fp-note").value.trim() || "Detay için başvur.",
      author: DB.user.name
    };

    const mine = Store.get("myListings", []);
    mine.unshift(listing);
    Store.set("myListings", mine);

    const list = $("#listing-list");
    if (list) {
      list.innerHTML = allListings().map(listingCard).join("");
      applyStagger(list);
    }
    $("#fp-note").value = "";

    Toast.success("İlanın yayınlandı! 📢");
  },

  "apply-listing"(data, btn) {
    btn.classList.add("btn--done");
    btn.textContent = "Başvuruldu";
    Toast.success("Başvurun iletildi, takım seninle iletişime geçecek 🤝");
  }
});
