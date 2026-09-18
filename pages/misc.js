
window.Pages = window.Pages || {};

Pages.login = {
  title: "Giriş",
  bare: true,

  render() {
    return `
      <div class="login page-enter">
        <div class="login__logo">${brandLogo(84)}</div>
        <h1>Match<span>Up</span></h1>
        <p>Türkiye'nin Amatör Futbol Platformu</p>

        <div class="stack">
          <button class="btn btn--ghost btn--block" data-action="login" data-method="google">
            ${Icons.google} Google ile Giriş Yap
          </button>
          <button class="btn btn--ghost btn--block" data-action="login" data-method="phone">
            ${Icons.phone} Telefon ile Giriş Yap
          </button>
          <button class="btn btn--primary btn--block" data-action="login" data-method="guest">
            Misafir Olarak Devam Et
          </button>
        </div>

        <p class="login__foot">Devam ederek Kullanım Koşulları'nı kabul etmiş olursun.<br>Demo sürüm — gerçek giriş yapılmaz.</p>
      </div>`;
  }
};

Pages.notifications = {
  title: "Bildirimler",

  render() {
    const list = DB.notifications;
    if (!list.length) {
      return emptyState(Icons.bell, "Bildirim yok", "Yeni bir şey olunca burada görürsün.");
    }
    const iconOf = (type) => ({
      success: `<div class="tile-icon">${Icons.check}</div>`,
      warn:    `<div class="tile-icon tile-icon--yellow">${Icons.clock}</div>`,
      info:    `<div class="tile-icon tile-icon--red">${Icons.info}</div>`
    }[type] || `<div class="tile-icon">${Icons.bell}</div>`);

    return `
      <div class="page-head stagger">
        <h1>Bildirimler</h1>
        <p>Son gelişmeleri kaçırma</p>
      </div>
      <div class="card stagger" style="padding:0; overflow:hidden">
        ${list.map((n) => `
          <div class="notif ${n.unread ? "unread" : ""}">
            ${iconOf(n.type)}
            <div>
              <div class="notif__text">${esc(n.text)}</div>
              <div class="notif__time">${esc(n.time)}</div>
            </div>
          </div>`).join("")}
      </div>`;
  },

  after() {
    Store.set("notifsRead", true);
    const badge = $("#bell-badge");
    if (badge) badge.hidden = true;
  }
};

Pages.tournaments = {
  title: "Turnuvalar",

  render() {
    const cdSegs = (iso) => {
      const diff = Math.max(0, new Date(iso) - new Date());
      const d = Math.floor(diff / 864e5);
      const h = Math.floor((diff % 864e5) / 36e5);
      const min = Math.floor((diff % 36e5) / 6e4);
      return `
        <div class="countdown" data-deadline="${iso}">
          <div class="cd-seg"><b data-u="d">${d}</b><span>Gün</span></div>
          <div class="cd-seg"><b data-u="h">${String(h).padStart(2, "0")}</b><span>Saat</span></div>
          <div class="cd-seg"><b data-u="m">${String(min).padStart(2, "0")}</b><span>Dakika</span></div>
        </div>`;
    };

    return `
      <div class="page-head stagger">
        <h1>Turnuvalar</h1>
        <p>Şehrin en iyisi kim, yakında belli olacak 🏆</p>
      </div>

      <div class="stack">
        ${DB.tournaments.map((t) => `
          <article class="tour-card stagger">
            <div class="tour-card__head">
              <div class="tile-icon tile-icon--yellow">${Icons.trophy}</div>
              <div style="flex:1; min-width:0">
                <div class="card__title">${esc(t.name)}</div>
                <div class="card__sub">${esc(t.city)} • ${esc(t.venue)}</div>
              </div>
              <span class="chip chip--yellow">Yakında</span>
            </div>

            <div class="meta-row" style="margin:0 0 4px">
              <span class="meta">${Icons.users} ${t.teams} takım</span>
              <span class="meta">${Icons.trophy} ${esc(t.prize)}</span>
              <span class="meta">${Icons.target} ${esc(t.format)}</span>
            </div>

            ${cdSegs(t.startsAt)}

            <button class="btn btn--ghost btn--block" disabled>
              ${Icons.timer} Kayıtlar Yakında Açılıyor
            </button>
          </article>`).join("")}
      </div>

      <p class="muted stagger" style="text-align:center; margin-top:18px; font-size:12px">
        Turnuva kayıtları açıldığında bildirim alacaksın 🔔
      </p>`;
  },

  after(root) {
    App._pageTimer = setInterval(() => {
      $$(".countdown", root).forEach((el) => {
        const diff = Math.max(0, new Date(el.dataset.deadline) - new Date());
        $("[data-u='d']", el).textContent = Math.floor(diff / 864e5);
        $("[data-u='h']", el).textContent = String(Math.floor((diff % 864e5) / 36e5)).padStart(2, "0");
        $("[data-u='m']", el).textContent = String(Math.floor((diff % 36e5) / 6e4)).padStart(2, "0");
      });
    }, 30000);
  }
};

Pages.settings = {
  title: "Ayarlar",

  render() {
    const dark = Store.get("darkMode", true);
    const notif = Store.get("notifEnabled", true);
    const lang = Store.get("lang", "tr");

    return `
      <div class="page-head stagger">
        <h1>Ayarlar</h1>
        <p>Uygulama tercihlerini yönet</p>
      </div>

      <div class="card stagger" style="padding:0; overflow:hidden">
        <div class="setting-row">
          <div class="tile-icon">${Icons.moon}</div>
          <div class="grow">
            <div class="title">Dark Mode</div>
            <div class="desc">Koyu tema kullan</div>
          </div>
          <button class="switch ${dark ? "on" : ""}" data-action="toggle-dark" aria-label="Dark mode"></button>
        </div>

        <div class="setting-row">
          <div class="tile-icon tile-icon--yellow">${Icons.bell}</div>
          <div class="grow">
            <div class="title">Bildirimler</div>
            <div class="desc">Maç ve takım bildirimleri</div>
          </div>
          <button class="switch ${notif ? "on" : ""}" data-action="toggle-notif" aria-label="Bildirimler"></button>
        </div>

        <div class="setting-row">
          <div class="tile-icon">${Icons.globe}</div>
          <div class="grow">
            <div class="title">Dil</div>
            <div class="desc">Uygulama dili</div>
          </div>
          <select id="set-lang" class="chip chip--gray" style="border:none; outline:none; padding:8px 12px; cursor:pointer">
            <option value="tr" ${lang === "tr" ? "selected" : ""}>Türkçe</option>
            <option value="en" ${lang === "en" ? "selected" : ""}>English</option>
          </select>
        </div>

        <div class="setting-row" data-action="show-about" style="cursor:pointer">
          <div class="tile-icon">${Icons.info}</div>
          <div class="grow">
            <div class="title">Hakkında</div>
            <div class="desc">MatchUp v2.0.0 — MVP</div>
          </div>
          <span style="color:var(--text-3)">${Icons.chevron}</span>
        </div>
      </div>

      <button class="btn btn--danger btn--block stagger" data-action="logout" style="margin-top:18px">
        ${Icons.logout} Çıkış Yap
      </button>`;
  },

  after(root) {
    $("#set-lang", root)?.addEventListener("change", (e) => {
      Store.set("lang", e.target.value);
      Toast.info(e.target.value === "tr" ? "Dil: Türkçe" : "Language: English (demo)");
    });
  }
};

Pages.search = {
  title: "Arama",

  render() {
    const q = (window.App?.searchQuery || "").toLocaleLowerCase("tr");

    if (q.length < 2) {
      return emptyState(Icons.search, "Aramaya başla",
        "Üstteki arama çubuğuna takım, oyuncu, kaleci, maç veya saha yaz.");
    }

    const has = (...fields) => fields.some((f) => String(f).toLocaleLowerCase("tr").includes(q));

    const teams   = allTeams().filter((t) => has(t.name, t.city, t.district));
    const players = DB.players.filter((p) => has(p.name, p.pos, p.city));
    const keepers = DB.goalkeepers.filter((g) => has(g.name, g.city));
    const matches = DB.matches.filter((m) => has(m.team, m.venue, m.city, m.district, m.position));
    const venues  = DB.venues.filter((v) => has(v.name, v.city, v.district));

    const total = teams.length + players.length + keepers.length + matches.length + venues.length;
    if (!total) {
      return emptyState(Icons.search, "Sonuç bulunamadı", `"${esc(q)}" için eşleşme yok.`);
    }

    const row = (av, title, sub, chip, route) => `
      <div class="card card--hover stagger" ${route ? `data-action="go" data-route="${route}" style="cursor:pointer"` : ""}>
        <div class="card__head" style="margin-bottom:0">
          ${av}
          <div style="flex:1; min-width:0">
            <div class="card__title">${title}</div>
            <div class="card__sub">${sub}</div>
          </div>
          ${chip}
        </div>
      </div>`;

    return `
      <div class="page-head stagger">
        <h1>Arama</h1>
        <p>"${esc(window.App.searchQuery)}" için ${total} sonuç</p>
      </div>

      ${teams.length ? sectionTitle(Icons.users, "Takımlar") + `<div class="stack">` +
        teams.map((t) => row(
          avatar(t.name, "", "avatar--team", (t.colors && t.colors[0]) || "", t.logo),
          esc(t.name), `${esc(t.city)} • ${t.players} oyuncu`,
          `<span style="color:var(--text-3)">${Icons.chevron}</span>`, `team/${t.id}`
        )).join("") + `</div>` : ""}

      ${players.length ? sectionTitle(Icons.user, "Oyuncular") + `<div class="stack">` +
        players.map((p) => row(
          avatar(p.name),
          esc(p.name), `${esc(p.pos)} • ${esc(p.city)} • ${p.matches} maç`,
          `<span class="chip">${p.ovr} OVR</span>`, `player/${p.id}`
        )).join("") + `</div>` : ""}

      ${keepers.length ? sectionTitle(Icons.glove, "Kaleciler") + `<div class="stack">` +
        keepers.map((g) => row(
          avatar(g.name),
          esc(g.name), `${esc(g.city)} • ${g.fee}₺/saat`,
          trustStars(g.trust), "goalkeepers"
        )).join("") + `</div>` : ""}

      ${venues.length ? sectionTitle(Icons.map, "Halı Sahalar") + `<div class="stack">` +
        venues.map((v) => row(
          `<div class="tile-icon" style="font-size:20px">${v.photo}</div>`,
          esc(v.name), `${esc(v.district)}, ${esc(v.city)} • ${v.hourly}₺/saat`,
          `<span class="chip chip--yellow">${Icons.star} ${v.rating.toFixed(1)}</span>`, `venue/${v.id}`
        )).join("") + `</div>` : ""}

      ${matches.length ? sectionTitle(Icons.ball, "Maçlar") + `<div class="stack">` +
        matches.map(matchCard).join("") + `</div>` : ""}`;
  }
};

Pages.notfound = {
  title: "Bulunamadı",

  render() {
    return `
      <div class="notfound page-enter">
        <h1>404</h1>
        <h3 style="margin-bottom:6px">Saha Bulunamadı</h3>
        <p class="muted" style="margin-bottom:24px">Aradığın sayfa taca çıkmış olabilir. 🥅</p>
        <button class="btn btn--primary" data-action="go" data-route="home">
          ${Icons.home} Ana Sayfaya Dön
        </button>
      </div>`;
  }
};

Object.assign(Actions, {

  "login"(data) {
    Store.set("session", { method: data.method, at: Date.now() });
    const msgs = {
      google: "Google ile giriş yapıldı (demo)",
      phone:  "Telefon ile giriş yapıldı (demo)",
      guest:  "Misafir olarak devam ediyorsun"
    };
    App.navigate("home");
    Toast.success(msgs[data.method] || "Hoş geldin!");
  },

  "logout"() {
    Store.clearAll();
    document.body.classList.remove("light");
    App.navigate("login");
    Toast.info("Çıkış yapıldı. Görüşürüz! 👋");
  },

  "toggle-dark"(_, btn) {
    const on = !btn.classList.contains("on");
    btn.classList.toggle("on", on);
    Store.set("darkMode", on);
    document.body.classList.toggle("light", !on);
    Toast.info(on ? "Dark mode açık 🌙" : "Açık tema aktif ☀️");
  },

  "toggle-notif"(_, btn) {
    const on = !btn.classList.contains("on");
    btn.classList.toggle("on", on);
    Store.set("notifEnabled", on);
    Toast.info(on ? "Bildirimler açık 🔔" : "Bildirimler kapalı 🔕");
  },

  "show-about"() {
    Modal.open("Hakkında", `
      <div style="text-align:center; padding:8px 0 4px">
        ${brandLogo(64)}
        <h3 style="margin:12px 0 4px">MatchUp v2.0.0</h3>
        <p class="muted" style="margin-bottom:14px">Türkiye'nin Amatör Futbol Platformu</p>
        <p class="muted" style="font-size:12.5px; line-height:1.7">
          Takım kur, oyuncu bul, kaleci kirala, turnuvalara hazırlan.<br>
          Bu sürüm bir MVP demosudur; tüm veriler cihazında saklanır.<br>
          © ${new Date().getFullYear()} MatchUp
        </p>
      </div>`);
  },

  "show-premium"() {
    Modal.open("MatchUp Premium", `
      <div style="text-align:center; padding:4px 0 8px">
        <div class="tile-icon tile-icon--yellow" style="width:56px; height:56px; margin:0 auto 12px">${Icons.crown}</div>
        <h3 style="margin-bottom:4px">Çok Yakında</h3>
        <p class="muted" style="margin-bottom:16px">Premium üyelik ile öne çık:</p>
      </div>
      <div class="stack" style="margin-bottom:16px">
        ${[
          [Icons.crown,   "Premium rozeti", "Profilinde altın taç görünür"],
          [Icons.verified,"Verified rozeti", "Kimliği doğrulanmış oyuncu"],
          [Icons.star,    "Öne çıkan profil", "Ana sayfada vitrine çık"],
          [Icons.bolt,    "Öncelikli eşleşme", "Acil maçlarda önce sen görün"]
        ].map(([icon, title, desc]) => `
          <div style="display:flex; gap:12px; align-items:center">
            <div class="tile-icon tile-icon--yellow" style="width:36px; height:36px">${icon}</div>
            <div>
              <div class="card__title" style="font-size:13.5px">${title}</div>
              <div class="card__sub">${desc}</div>
            </div>
          </div>`).join("")}
      </div>
      <button class="btn btn--ghost btn--block" disabled>${Icons.timer} Yakında</button>`);
  }
});
