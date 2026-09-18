
window.Pages = window.Pages || {};

window.matchCard = (m) => {
  const joined = Store.get("joinedMatches", []).includes(m.id);
  return `
  <article class="card card--hover match-card stagger" data-action="go" data-route="match/${m.id}">
    <div class="match-card__row">
      <div class="match-card__when"><b>${m.time}</b><span>${dayLabel(m)}</span></div>
      <div class="match-card__body">
        <div class="card__head" style="margin-bottom:6px">
          <div style="flex:1; min-width:0">
            <div class="card__title">${m.missing} ${esc(m.position)} Aranıyor</div>
            <div class="card__sub">${esc(m.team)} • ${esc(m.venue)}</div>
          </div>
          ${favBtn("match", m.id)}
        </div>
        <div class="meta-row" style="margin:6px 0 10px">
          <span class="meta">${Icons.pin} ${esc(m.district)} • ${m.dist} km</span>
          <span class="meta">${Icons.money} ${m.price}₺/kişi</span>
        </div>
        <div style="display:flex; align-items:center; justify-content:space-between; gap:10px">
          <span class="chip ${m.missing >= 3 ? "chip--red" : ""}">${m.missing} eksik</span>
          <button class="btn btn--sm ${joined ? "btn--done" : "btn--primary"}"
                  data-action="join-match" data-id="${m.id}">
            ${joined ? `${Icons.check} Katıldın` : "Katıl"}
          </button>
        </div>
      </div>
    </div>
  </article>`;
};

window.urgentCard = (m) => {
  const joined = Store.get("joinedMatches", []).includes(m.id);
  return `
  <article class="urgent-card stagger" data-action="go" data-route="match/${m.id}">
    <div class="urgent-card__top">
      <span class="urgent-card__need">${Icons.fire} ${m.missing} ${esc(m.position).toUpperCase()} ARANIYOR</span>
      ${favBtn("match", m.id)}
    </div>
    <div class="urgent-card__time">${m.time}</div>
    <div class="urgent-card__place">${esc(m.district)} • ${esc(m.venue)}</div>
    <div class="urgent-card__meta">
      <span class="chip chip--gray">${Icons.money} ${m.price}₺</span>
      ${kmChip(m.dist)}
    </div>
    <button class="btn btn--sm btn--block ${joined ? "btn--done" : "btn--primary"}"
            data-action="join-match" data-id="${m.id}">
      ${joined ? `${Icons.check} Katıldın` : "Katıl"}
    </button>
  </article>`;
};

window.listingCard = (l) => `
  <article class="card card--hover stagger">
    <div class="card__head">
      <div class="tile-icon tile-icon--red">${Icons.whistle}</div>
      <div style="flex:1">
        <div class="card__title">${esc(l.count)} ${esc(l.position)} Aranıyor</div>
        <div class="card__sub">${esc(l.author)}</div>
      </div>
      <span class="chip chip--gray">${esc(l.city)}</span>
    </div>
    <p class="muted" style="margin:4px 0 10px">${esc(l.note)}</p>
    <div style="display:flex; align-items:center; justify-content:space-between; gap:10px">
      <span class="meta">${Icons.calendar} ${esc(l.date)} • ${esc(l.time)}</span>
      <button class="btn btn--sm btn--ghost" data-action="apply-listing" data-id="${l.id}">Başvur</button>
    </div>
  </article>`;

const feedFilters = { city: "", pos: "", time: "", price: "", dist: "" };

function filterFeed(list) {
  return list.filter((m) => {
    if (feedFilters.city && m.city !== feedFilters.city) return false;
    if (feedFilters.pos && m.position !== feedFilters.pos) return false;
    if (feedFilters.time) {
      const h = parseInt(m.time, 10);
      if (feedFilters.time === "early" && h >= 20) return false;
      if (feedFilters.time === "evening" && (h < 20 || h >= 22)) return false;
      if (feedFilters.time === "night" && h < 22) return false;
    }
    if (feedFilters.price === "low" && m.price > 80) return false;
    if (feedFilters.price === "high" && m.price <= 80) return false;
    if (feedFilters.dist === "near" && m.dist > 3) return false;
    if (feedFilters.dist === "mid" && m.dist > 10) return false;
    return true;
  });
}

function rerenderFeed() {
  const urgent = filterFeed(DB.matches.filter((m) => m.off === 0));
  const nearby = filterFeed([...DB.matches].sort((a, b) => a.dist - b.dist)).slice(0, 4);

  const uWrap = $("#urgent-list");
  if (uWrap) {
    uWrap.innerHTML = urgent.length
      ? urgent.map(urgentCard).join("")
      : `<div class="card" style="flex:1; text-align:center; color:var(--text-2); font-size:13px; padding:26px">
           Bu filtrelerde bugün acil maç yok. Filtreleri gevşetmeyi dene.</div>`;
    applyStagger(uWrap);
  }
  const nWrap = $("#nearby-list");
  if (nWrap) {
    nWrap.innerHTML = nearby.length
      ? nearby.map(matchCard).join("")
      : emptyState(Icons.ball, "Maç bulunamadı", "Filtreleri değiştirerek tekrar dene.");
    applyStagger(nWrap);
  }
}

Pages.home = {
  title: "Ana Sayfa",

  render() {
    const urgent = filterFeed(DB.matches.filter((m) => m.off === 0));
    const nearby = filterFeed([...DB.matches].sort((a, b) => a.dist - b.dist)).slice(0, 4);
    const featured = DB.players.filter((p) => p.premium || p.verified).slice(0, 4);
    const premiumTeams = DB.teams.filter((t) => t.premium).slice(0, 2);
    const keepers = DB.goalkeepers.filter((g) => g.available).slice(0, 4);
    const scorers = [...DB.players].sort((a, b) => b.wg - a.wg).slice(0, 3);
    const tour = DB.tournaments[0];
    const liveCount = DB.players.filter((p) => p.online).length + DB.goalkeepers.filter((g) => g.online).length;

    const sel = (id, label, options) => `
      <select id="${id}" aria-label="${label}">
        <option value="">${label}</option>
        ${options.map(([v, t]) => `<option value="${v}" ${feedFilters[id.replace("ff-", "")] === v ? "selected" : ""}>${t}</option>`).join("")}
      </select>`;

    return `
      <!-- HERO: büyük arama -->
      <div class="hero stagger">
        <h1>Bugün sahada mısın, ${esc(DB.user.name.split(" ")[0])}? ⚽</h1>
        <p>Maç bul, takıma katıl, kaleci kirala — hepsi tek yerde.</p>
        <div class="search-bar">
          <span class="search-bar__icon">${Icons.search}</span>
          <input id="hero-search" type="search" placeholder="Maç, takım, oyuncu veya saha ara..."
                 autocomplete="off" aria-label="Arama" />
        </div>
        <div class="live-strip">
          <span><span class="dot-live"></span><b>${urgent.length || DB.matches.filter(m => m.off === 0).length}</b> maç bugün oyuncu arıyor</span>
          <span><b>${liveCount}</b> oyuncu şu an aktif</span>
          <span><b>${DB.goalkeepers.filter(g => g.today).length}</b> kaleci bugün müsait</span>
        </div>
      </div>

      <!-- FİLTRELER -->
      <div class="filters stagger">
        ${sel("ff-city", "Şehir", DB.cities.map((c) => [c, c]))}
        ${sel("ff-pos", "Pozisyon", DB.positions.map((p) => [p, p]))}
        ${sel("ff-time", "Saat", [["early", "20:00 öncesi"], ["evening", "20:00–22:00"], ["night", "22:00 sonrası"]])}
        ${sel("ff-price", "Ücret", [["low", "80₺ ve altı"], ["high", "80₺ üzeri"]])}
        ${sel("ff-dist", "Mesafe", [["near", "3 km içinde"], ["mid", "10 km içinde"]])}
      </div>

      <!-- 🔥 ACİL MAÇLAR -->
      ${sectionTitle(Icons.fire, "🔥 Acil Maçlar", "matches")}
      <div class="hscroll" id="urgent-list">${urgent.map(urgentCard).join("")}</div>

      <!-- YAKINDAKİ MAÇLAR -->
      ${sectionTitle(Icons.pin, "Yakındaki Maçlar", "matches")}
      <div class="stack" id="nearby-list">${nearby.map(matchCard).join("")}</div>

      <!-- SPONSOR ALANI (premium altyapısı) -->
      <div class="sponsor-card stagger" style="position:relative; margin-top:22px">
        <div class="tile-icon tile-icon--yellow">${Icons.bolt}</div>
        <div style="flex:1">
          <div class="sponsor-card__label">Sponsorlu</div>
          <h4>Krampon %20 indirim — SporMax</h4>
          <p>MatchUp üyelerine özel: MATCHUP20 koduyla tüm kramponlarda.</p>
        </div>
      </div>

      <!-- ÖNE ÇIKAN OYUNCULAR (premium vitrini) -->
      ${sectionTitle(Icons.star, "Öne Çıkan Oyuncular", "players")}
      <div class="player-grid">
        ${featured.map(playerMiniCard).join("")}
      </div>

      <!-- ÖNE ÇIKAN TAKIMLAR -->
      ${sectionTitle(Icons.users, "Öne Çıkan Takımlar", "teams")}
      <div class="stack">${premiumTeams.map(teamCard).join("")}</div>

      <!-- KALECİLER: yatay şerit -->
      ${sectionTitle(Icons.glove, "Bugün Müsait Kaleciler", "goalkeepers")}
      <div class="hscroll">
        ${keepers.map((g) => `
          <article class="card card--hover stagger" data-action="go" data-route="goalkeepers"
                   style="flex-basis:200px; cursor:pointer">
            <div style="display:flex; flex-direction:column; align-items:center; text-align:center; gap:8px">
              ${avatar(g.name, "lg")}
              <div>
                <div class="card__title">${esc(g.name)} ${badges(g)}</div>
                <div class="card__sub">${esc(g.city)} • ${g.cs} CS</div>
              </div>
              ${trustStars(g.trust)}
              <button class="btn btn--sm btn--primary btn--block" data-action="reserve-keeper" data-id="${g.id}">
                ${g.fee}₺/saat • Rezerve Et
              </button>
            </div>
          </article>`).join("")}
      </div>

      <!-- LİDERLİK ÖNİZLEME -->
      ${sectionTitle(Icons.medal, "Haftanın Golcüleri", "leaderboard")}
      <div class="card stagger" style="padding:0; overflow:hidden">
        ${scorers.map((p, i) => `
          <div class="lb-row" data-action="go" data-route="player/${p.id}">
            <span class="lb-rank">${i + 1}</span>
            ${avatar(p.name, "sm")}
            <div style="flex:1; min-width:0">
              <div class="card__title" style="font-size:13.5px">${esc(p.name)} ${badges(p)}</div>
              <div class="card__sub">${esc(p.pos)} • ${esc(p.city)}</div>
            </div>
            <div class="lb-val"><b>${p.wg}</b><span>gol</span></div>
          </div>`).join("")}
      </div>

      <!-- TURNUVA TEASER (countdown) -->
      ${sectionTitle(Icons.trophy, "Turnuvalar", "tournaments")}
      <div class="tour-card stagger" data-action="go" data-route="tournaments" style="cursor:pointer">
        <div class="tour-card__head">
          <div class="tile-icon tile-icon--yellow">${Icons.trophy}</div>
          <div style="flex:1">
            <div class="card__title">${esc(tour.name)}</div>
            <div class="card__sub">${esc(tour.city)} • ${tour.teams} takım • ${esc(tour.prize)}</div>
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:8px; font-size:12px; color:var(--text-2)">
          ${Icons.timer} Başlamasına <b class="cd-inline" data-deadline="${tour.startsAt}" style="color:var(--warning)">${countdownText(tour.startsAt)}</b>
        </div>
      </div>

      <!-- HALI SAHALAR -->
      ${sectionTitle(Icons.map, "Yakınındaki Sahalar", "venues")}
      <div class="stack">
        ${DB.venues.slice(0, 2).map(venueCard).join("")}
      </div>`;
  },

  after(root) {
    let t;
    $("#hero-search", root)?.addEventListener("input", (e) => {
      clearTimeout(t);
      t = setTimeout(() => {
        App.searchQuery = e.target.value.trim();
        if (App.searchQuery.length >= 2) App.navigate("search");
      }, 350);
    });

    [["#ff-city", "city"], ["#ff-pos", "pos"], ["#ff-time", "time"], ["#ff-price", "price"], ["#ff-dist", "dist"]]
      .forEach(([id, key]) => {
        $(id, root)?.addEventListener("change", (e) => {
          feedFilters[key] = e.target.value;
          rerenderFeed();
        });
      });

    App._pageTimer = setInterval(() => {
      $$(".cd-inline", root).forEach((el) => {
        el.textContent = countdownText(el.dataset.deadline);
      });
    }, 30000);
  }
};
