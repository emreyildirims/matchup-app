
window.Pages = window.Pages || {};

const TEAM_COLORS = ["#2ECC71", "#E74C3C", "#3498DB", "#F1C40F", "#9B59B6", "#E67E22", "#1ABC9C", "#95A5A6"];
const TEAM_LOGOS  = ["⚽", "🦅", "🐺", "🔥", "⚡", "🦁", "🌊", "⭐", "👑", "🐆"];

let teamCityFilter = "";

window.allTeams = () => [...Store.get("myTeams", []), ...DB.teams];

window.teamCard = (t) => {
  const joined = Store.get("joinedTeams", []).includes(t.id);
  const c1 = (t.colors && t.colors[0]) || t.color || "#2ECC71";
  const c2 = (t.colors && t.colors[1]) || "#0B0F0D";
  return `
  <article class="card card--hover team-card stagger" data-action="go" data-route="team/${t.id}">
    <div class="team-card__banner" style="background:linear-gradient(120deg, ${c1}55, ${c1}22 60%, transparent)">
      <div class="team-card__logo">${t.logo}</div>
    </div>
    <div class="team-card__body">
      <div class="card__head" style="margin-bottom:2px">
        <div style="flex:1; min-width:0">
          <div class="card__title">${esc(t.name)} ${badges(t)} ${t.mine ? `<span class="chip">${Icons.star} Takımın</span>` : ""}</div>
          <div class="card__sub">${esc(t.city)}${t.district ? " • " + esc(t.district) : ""} • ${t.founded || ""}</div>
        </div>
        ${favBtn("team", t.id)}
      </div>
      <div class="team-card__stats">
        <div class="team-card__stat"><b>${t.players}</b><span>Oyuncu</span></div>
        <div class="team-card__stat"><b class="win">${t.w ?? t.wins ?? 0}</b><span>Galibiyet</span></div>
        <div class="team-card__stat"><b class="loss">${t.l ?? 0}</b><span>Mağlubiyet</span></div>
        <div class="team-card__stat"><b>${t.gf ?? 0}</b><span>Gol</span></div>
      </div>
      <div class="team-card__foot">
        <span class="kit-dots" title="Forma renkleri">
          <i style="background:${c1}"></i><i style="background:${c2}"></i>
        </span>
        ${t.mine ? `<button class="btn btn--sm btn--done btn--block">${Icons.check} Kaptanısın</button>` : `
          <button class="btn btn--sm ${joined ? "btn--done" : "btn--primary"} btn--block"
                  data-action="join-team" data-id="${t.id}">
            ${joined ? `${Icons.check} Üyesin` : "Takıma Katıl"}
          </button>`}
      </div>
    </div>
  </article>`;
};

function teamListHTML() {
  const list = allTeams().filter((t) => !teamCityFilter || t.city === teamCityFilter);
  return list.length
    ? list.map(teamCard).join("")
    : emptyState(Icons.users, "Takım bulunamadı", "Bu şehirde takım yok — ilk takımı sen kur!");
}

Pages.teams = {
  title: "Takımlar",

  render() {
    return `
      <div class="page-head stagger">
        <h1>Takımlar</h1>
        <p>Bir takıma katıl veya kendi takımını kur</p>
      </div>

      <!-- Takım oluştur butonu -->
      <button class="btn btn--primary btn--block stagger" data-action="open-create-team" style="margin-bottom:14px">
        ${Icons.plus} Takım Oluştur
      </button>

      <!-- Şehir filtresi -->
      <div class="filters stagger">
        <select id="tf-city" aria-label="Şehir filtresi">
          <option value="">Tüm Şehirler</option>
          ${DB.cities.map((c) => `<option ${teamCityFilter === c ? "selected" : ""}>${c}</option>`).join("")}
        </select>
      </div>

      <!-- Takım listesi -->
      <div class="stack" id="team-list">${teamListHTML()}</div>`;
  },

  after(root) {
    $("#tf-city", root)?.addEventListener("change", (e) => {
      teamCityFilter = e.target.value;
      const list = $("#team-list");
      list.innerHTML = teamListHTML();
      applyStagger(list);
    });
  }
};

Object.assign(Actions, {

  "join-team"(data, btn) {
    const joined = Store.get("joinedTeams", []);
    if (joined.includes(data.id)) return;

    joined.push(data.id);
    Store.set("joinedTeams", joined);

    btn.classList.remove("btn--primary", "btn--ghost");
    btn.classList.add("btn--done");
    btn.innerHTML = `${Icons.check} Üyesin`;

    const t = allTeams().find((x) => x.id === data.id);
    Toast.success(`Katılma isteğin gönderildi: ${t ? t.name : ""} 🤝`);
  },

  "open-create-team"() {
    let selColor = TEAM_COLORS[0];
    let selLogo = TEAM_LOGOS[0];

    Modal.open("Takım Oluştur", `
      <div class="field">
        <label for="ct-name">Takım Adı</label>
        <input id="ct-name" type="text" maxlength="30" placeholder="ör. Gece Kartalları" />
      </div>
      <div class="field">
        <label for="ct-city">Şehir</label>
        <select id="ct-city">
          ${DB.cities.map((c) => `<option>${c}</option>`).join("")}
        </select>
      </div>
      <div class="field">
        <label for="ct-desc">Takım Açıklaması</label>
        <textarea id="ct-desc" maxlength="160" placeholder="ör. Haftada 2 maç yaparız, pas oyunu severiz..."></textarea>
      </div>
      <div class="field">
        <label>Forma Rengi</label>
        <div class="color-row" id="ct-colors">
          ${TEAM_COLORS.map((c, i) => `
            <button type="button" class="color-dot ${i === 0 ? "selected" : ""}"
                    data-color="${c}" style="background:${c}" aria-label="Renk ${c}"></button>`).join("")}
        </div>
      </div>
      <div class="field">
        <label>Logo Seç</label>
        <div class="emoji-row" id="ct-logos">
          ${TEAM_LOGOS.map((l, i) => `
            <button type="button" class="emoji-pick ${i === 0 ? "selected" : ""}" data-logo="${l}">${l}</button>`).join("")}
        </div>
      </div>
      <button class="btn btn--primary btn--block" id="ct-save">${Icons.check} Takımı Kur</button>
    `, (modal) => {
      $("#ct-colors", modal).addEventListener("click", (e) => {
        const dot = e.target.closest(".color-dot");
        if (!dot) return;
        $$(".color-dot", modal).forEach((d) => d.classList.remove("selected"));
        dot.classList.add("selected");
        selColor = dot.dataset.color;
      });

      $("#ct-logos", modal).addEventListener("click", (e) => {
        const pick = e.target.closest(".emoji-pick");
        if (!pick) return;
        $$(".emoji-pick", modal).forEach((p) => p.classList.remove("selected"));
        pick.classList.add("selected");
        selLogo = pick.dataset.logo;
      });

      $("#ct-save", modal).addEventListener("click", () => {
        const name = $("#ct-name", modal).value.trim();
        if (name.length < 3) {
          Toast.error("Takım adı en az 3 karakter olmalı");
          return;
        }

        const myTeams = Store.get("myTeams", []);
        myTeams.unshift({
          id: "my-" + Date.now(),
          name,
          city: $("#ct-city", modal).value,
          desc: $("#ct-desc", modal).value.trim() || "Yeni kurulmuş, hırslı bir ekip.",
          colors: [selColor, "#0B0F0D"],
          logo: selLogo,
          players: 1, w: 0, l: 0, d: 0, gf: 0, ga: 0,
          founded: new Date().getFullYear(),
          squad: [DB.user.id],
          recent: [],
          mine: true
        });
        Store.set("myTeams", myTeams);

        Modal.close();
        Toast.success(`Takım kuruldu: ${name} 🎉`);

        const list = $("#team-list");
        if (list) {
          list.innerHTML = teamListHTML();
          applyStagger(list);
        }
      });
    });
  }
});
