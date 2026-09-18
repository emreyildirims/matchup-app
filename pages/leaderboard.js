
window.Pages = window.Pages || {};

const LB_TABS = {
  goals:   { label: "⚽ Gol",      unit: "gol" },
  assists: { label: "🅰️ Asist",   unit: "asist" },
  keepers: { label: "🧤 Kaleci",  unit: "CS" },
  active:  { label: "🔥 Aktif",   unit: "puan" },
  matches: { label: "📅 Maç",     unit: "maç" }
};

let lbTab = "goals";

function lbData() {
  const P = DB.players, G = DB.goalkeepers;
  switch (lbTab) {
    case "goals":
      return [...P].sort((a, b) => b.wg - a.wg).slice(0, 10)
        .map((p) => ({ p, val: p.wg, sub: `${p.pos} • ${p.city}`, route: "player/" + p.id }));
    case "assists":
      return [...P].sort((a, b) => b.wa - a.wa).slice(0, 10)
        .map((p) => ({ p, val: p.wa, sub: `${p.pos} • ${p.city}`, route: "player/" + p.id }));
    case "keepers":
      return [...G].sort((a, b) => b.cs - a.cs).slice(0, 10)
        .map((g) => ({ p: g, val: g.cs, sub: `${g.matches} maç • ${g.city}`, route: "goalkeepers" }));
    case "active":
      return [...P].sort((a, b) => (b.wg + b.wa + (b.online ? 3 : 0) + b.trust) - (a.wg + a.wa + (a.online ? 3 : 0) + a.trust))
        .slice(0, 10)
        .map((p) => ({ p, val: p.wg + p.wa + (p.online ? 3 : 0), sub: `${p.pos} • ${p.city}`, route: "player/" + p.id }));
    case "matches":
      return [...P].sort((a, b) => b.matches - a.matches).slice(0, 10)
        .map((p) => ({ p, val: p.matches, sub: `${p.pos} • ${p.city}`, route: "player/" + p.id }));
  }
  return [];
}

function lbListHTML() {
  const unit = LB_TABS[lbTab].unit;
  return lbData().map((row, i) => `
    <div class="lb-row" data-action="go" data-route="${row.route}">
      <span class="lb-rank">${i + 1}</span>
      ${avatar(row.p.name, "sm")}
      <div style="flex:1; min-width:0">
        <div class="card__title" style="font-size:13.5px">${esc(row.p.name)} ${badges(row.p)}</div>
        <div class="card__sub">${esc(row.sub)}</div>
      </div>
      <div class="lb-val"><b>${row.val}</b><span>${unit}</span></div>
    </div>`).join("");
}

Pages.leaderboard = {
  title: "Sıralama",

  render() {
    return `
      <div class="page-head stagger">
        <h1>Liderlik Tablosu</h1>
        <p>Bu haftanın en iyileri — sen neredesin?</p>
      </div>

      <!-- Sekmeler -->
      <div class="tabs stagger">
        ${Object.entries(LB_TABS).map(([key, t]) => `
          <button class="tab ${lbTab === key ? "active" : ""}" data-action="lb-tab" data-tab="${key}">
            ${t.label}
          </button>`).join("")}
      </div>

      <div class="card stagger" style="padding:0; overflow:hidden" id="lb-list">
        ${lbListHTML()}
      </div>

      <!-- Kullanıcının kendi durumu -->
      <div class="card stagger" style="margin-top:14px; border-color:rgba(46,204,113,0.35)">
        <div class="lb-row" style="padding:2px 0" data-action="go" data-route="profile">
          <span class="lb-rank" style="color:var(--primary)">•</span>
          ${avatar(DB.user.name, "sm", "", "#1f8a4d")}
          <div style="flex:1">
            <div class="card__title" style="font-size:13.5px">${esc(DB.user.name)} (Sen)</div>
            <div class="card__sub">Bu hafta 4 gol, 2 asist — golde 3. sıradasın 🔥</div>
          </div>
          <span style="color:var(--text-3)">${Icons.chevron}</span>
        </div>
      </div>`;
  }
};

Object.assign(Actions, {
  "lb-tab"(data, btn) {
    lbTab = data.tab;
    $$(".tab").forEach((t) => t.classList.toggle("active", t === btn));
    const list = $("#lb-list");
    if (list) {
      list.innerHTML = lbListHTML();
      applyStagger(list);
    }
  }
});
