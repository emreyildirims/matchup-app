
window.Pages = window.Pages || {};

Pages.profile = {
  title: "Profil",

  render() {
    const u = DB.user;
    const c = u.card;

    const fut = futCard({
      name: u.name, pos: u.position, ovr: c.overall, city: u.city,
      foot: u.foot, h: u.height, wt: u.weight, trust: u.trust,
      g: u.stats.goals, a: u.stats.assists, w: u.stats.wins,
      matches: u.stats.matches, premium: u.premium, verified: u.verified
    });

    const joinedIds = Store.get("joinedTeams", []);
    const joinedNames = DB.teams.filter((t) => joinedIds.includes(t.id)).map((t) => t.name);
    const teams = [...new Set([...u.teams, ...joinedNames])];

    return `
      <!-- PROFİL BAŞLIĞI -->
      <div class="card stagger" style="text-align:center; padding:26px 16px">
        ${avatar(u.name, "lg", "", "#1f8a4d")}
        <h1 style="font-size:21px; margin:12px 0 2px">${esc(u.name)} ${badges(u)}</h1>
        <p class="muted">${esc(u.city)} • ${esc(u.position)} • ${esc(u.memberSince)}'ten beri üye</p>
        <div style="margin-top:8px">${trustStars(u.trust)}</div>
        <div style="display:flex; gap:8px; justify-content:center; margin-top:12px; flex-wrap:wrap">
          <span class="chip">${Icons.target} ${esc(u.position)}</span>
          <span class="chip chip--gray">${Icons.pin} ${esc(u.city)}</span>
          <span class="chip chip--gray">${Icons.bolt} ${esc(u.foot)} ayak</span>
          <span class="chip chip--gray">${u.height} cm • ${u.weight} kg</span>
        </div>
      </div>

      <!-- HAKKINDA -->
      <div class="card stagger" style="margin-top:12px">
        <p class="muted" style="line-height:1.65">${esc(u.about)}</p>
      </div>

      <!-- FUT KARTI -->
      ${sectionTitle(Icons.star, "Oyuncu Kartın")}
      ${fut}

      <!-- SEZON İSTATİSTİKLERİ -->
      ${sectionTitle(Icons.bolt, "Sezon İstatistikleri")}
      <div class="stat-grid stagger">
        <div><b>${u.stats.matches}</b><span>Maç</span></div>
        <div><b>${u.stats.goals}</b><span>Gol</span></div>
        <div><b>${u.stats.assists}</b><span>Asist</span></div>
        <div><b>${u.stats.wins}</b><span>Galibiyet</span></div>
      </div>

      <!-- YETENEK BARLARI -->
      <div class="card stagger" style="margin-top:2px">
        ${[
          ["Hız", c.pace], ["Şut", c.shooting], ["Pas", c.passing],
          ["Dayanıklılık", c.stamina], ["Defans", c.defense], ["Fizik", c.physical]
        ].map(([label, val]) => `
          <div class="statbar">
            <div class="statbar__label"><span>${label}</span><span>${val}</span></div>
            <div class="statbar__track">
              <div class="statbar__fill" style="width:${val}%"></div>
            </div>
          </div>`).join("")}
      </div>

      <!-- GÜVEN PUANI KIRILIMI -->
      ${sectionTitle(Icons.shieldIcon, "Güven Puanı")}
      <div class="card stagger">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px">
          ${trustStars(u.trust)}
          <span class="chip">Çok Güvenilir</span>
        </div>
        ${[
          ["Maça gelme", u.trustDetail.attendance, u.trustDetail.attendance + "%"],
          ["Dakiklik", u.trustDetail.punctuality, u.trustDetail.punctuality + "%"],
          ["Fair-play", u.trustDetail.fairplay * 20, u.trustDetail.fairplay + "/5"],
          ["Son dk. iptal", 100 - u.trustDetail.cancels * 10, u.trustDetail.cancels + " kez"]
        ].map(([label, pct, val]) => `
          <div class="statbar">
            <div class="statbar__label"><span>${label}</span><span>${val}</span></div>
            <div class="statbar__track">
              <div class="statbar__fill" style="width:${pct}%"></div>
            </div>
          </div>`).join("")}
      </div>

      <!-- KATILDIĞI TAKIMLAR -->
      ${sectionTitle(Icons.users, "Takımların")}
      <div class="stack">
        ${teams.map((name) => {
          const t = DB.teams.find((x) => x.name === name);
          return `
          <div class="card card--hover stagger" ${t ? `data-action="go" data-route="team/${t.id}" style="cursor:pointer"` : ""}>
            <div class="card__head" style="margin-bottom:0">
              ${avatar(name, "", "avatar--team", (t?.colors && t.colors[0]) || "", t?.logo || "")}
              <div style="flex:1">
                <div class="card__title">${esc(name)}</div>
                <div class="card__sub">${esc(t?.city || DB.user.city)}</div>
              </div>
              <span style="color:var(--text-3)">${Icons.chevron}</span>
            </div>
          </div>`;
        }).join("")}
      </div>

      <!-- PREMIUM TEASER (altyapı hazır, ödeme yok) -->
      <div class="premium-banner stagger" data-action="show-premium" style="margin-top:20px">
        <div class="tile-icon">${Icons.crown}</div>
        <div style="flex:1">
          <h4>MatchUp Premium</h4>
          <p>Rozetler, öne çıkan profil ve öncelikli eşleşme — yakında</p>
        </div>
        <span style="color:var(--text-3)">${Icons.chevron}</span>
      </div>

      <!-- KISAYOLLAR -->
      <div class="grid-2" style="margin-top:12px">
        <button class="btn btn--ghost stagger" data-action="go" data-route="favorites">
          ${Icons.heart} Favoriler
        </button>
        <button class="btn btn--ghost stagger" data-action="go" data-route="settings">
          ${Icons.settings} Ayarlar
        </button>
      </div>`;
  }
};
