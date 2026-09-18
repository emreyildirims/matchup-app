
window.$  = (sel, root = document) => root.querySelector(sel);
window.$$ = (sel, root = document) => [...root.querySelectorAll(sel)];

window.Actions = {};

window.esc = (str) =>
  String(str ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

window.initials = (name) =>
  name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

window.nameColor = (name) => {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) % 360;
  return `hsl(${hash}, 55%, 42%)`;
};

window.avatar = (name, size = "", extra = "", bg = "", emoji = "") => {
  const cls = ["avatar", size ? `avatar--${size}` : "", extra].join(" ").trim();
  const color = bg || nameColor(name);
  const content = emoji || initials(name);
  return `<div class="${cls}" style="background:linear-gradient(135deg, ${color}, ${color}cc)">${content}</div>`;
};

window.ratingChip = (rating) =>
  `<span class="chip chip--yellow">${Icons.star} ${rating.toFixed(1)}</span>`;

window.skeletonHTML = (cards = 4) => `
  <div class="skeleton skeleton--title"></div>
  ${'<div class="skeleton skeleton--card"></div>'.repeat(cards)}
  <div class="skeleton skeleton--title"></div>
  ${'<div class="skeleton skeleton--row"></div>'.repeat(2)}
`;

window.applyStagger = (root) => {
  $$(".stagger", root).forEach((elm, i) => {
    elm.style.animationDelay = `${Math.min(i * 60, 480)}ms`;
  });
};

window.emptyState = (icon, title, desc) => `
  <div class="empty">
    <div class="empty__icon">${icon}</div>
    <h3>${title}</h3>
    <p>${desc}</p>
  </div>`;

window.sectionTitle = (icon, text, route = "") => `
  <div class="section-title">
    <h2>${icon} ${text}</h2>
    ${route ? `<button class="link" data-action="go" data-route="${route}">Tümü ›</button>` : ""}
  </div>`;

const FAV_KEYS = { player: "favPlayers", team: "favTeams", keeper: "favKeepers", match: "favMatches" };

window.isFav = (type, id) => Store.get(FAV_KEYS[type], []).includes(id);

window.favBtn = (type, id) =>
  `<button class="fav-btn ${isFav(type, id) ? "active" : ""}"
           data-action="toggle-fav" data-type="${type}" data-id="${id}"
           aria-label="Favorilere ekle">${Icons.heart}</button>`;

Object.assign(Actions, {
  "toggle-fav"(data, btn) {
    const key = FAV_KEYS[data.type];
    let list = Store.get(key, []);
    const adding = !list.includes(data.id);
    list = adding ? [...list, data.id] : list.filter((x) => x !== data.id);
    Store.set(key, list);
    btn.classList.toggle("active", adding);
    Toast.show(adding ? "Favorilere eklendi ❤️" : "Favorilerden çıkarıldı", adding ? "success" : "info", 1600);
  }
});

window.trustStars = (score, showValue = true) => {
  const full = Math.round(score);
  const stars = [1, 2, 3, 4, 5]
    .map((i) => `<span class="tstar ${i <= full ? "on" : ""}">★</span>`).join("");
  return `<span class="trust" title="Güven puanı">${stars}${showValue ? `<b>${score.toFixed(1)}</b>` : ""}</span>`;
};

window.badges = (entity) => `
  ${entity.verified ? `<span class="vbadge" title="Doğrulanmış">${Icons.verified}</span>` : ""}
  ${entity.premium ? `<span class="pbadge" title="Premium üye">${Icons.crown}</span>` : ""}`;

window.onlineDot = (online) =>
  `<span class="odot ${online ? "on" : ""}" title="${online ? "Çevrimiçi" : "Çevrimdışı"}"></span>`;

window.posShort = (pos) => ({
  "Kaleci": "KL", "Defans": "DEF", "Stoper": "STP",
  "Orta Saha": "OS", "Kanat": "KNT", "Forvet": "FV", "Fark Etmez": "—"
}[pos] || pos.slice(0, 3).toUpperCase());

window.futCard = (p) => `
  <div class="fifa-card stagger">
    <div class="fifa-card__top">
      <div class="fifa-card__ovr">
        <b>${p.ovr}</b><span>OVR</span>
        <div class="fifa-card__pos">${posShort(p.pos)}</div>
      </div>
      ${avatar(p.name, "lg", "", "#1f8a4d")}
      <div class="fifa-card__side">
        <div class="fifa-side"><span>${Icons.pin}</span>${esc(p.city)}</div>
        <div class="fifa-side"><span>${Icons.bolt}</span>${esc(p.foot)} ayak</div>
        <div class="fifa-side"><span>${Icons.user}</span>${p.h} cm • ${p.wt} kg</div>
      </div>
    </div>
    <div class="fifa-card__name">${esc(p.name)} ${badges(p)}</div>
    <div class="fifa-card__trust">${trustStars(p.trust)}</div>
    <div class="fifa-card__divider"></div>
    <div class="fifa-card__stats">
      <div class="fifa-stat"><span>MAÇ</span><b>${p.matches}</b></div>
      <div class="fifa-stat"><span>GOL</span><b>${p.g}</b></div>
      <div class="fifa-stat"><span>ASİST</span><b>${p.a}</b></div>
      <div class="fifa-stat"><span>GLB</span><b>${p.w}</b></div>
    </div>
  </div>`;

window.kmChip = (dist) => `<span class="chip chip--gray">${Icons.pin} ${dist} km</span>`;

window.dayLabel = (m) =>
  m.off === 0 ? "Bugün" : m.off === 1 ? "Yarın" : m.date.split(" ").slice(0, 2).join(" ");

window.countdownText = (iso) => {
  const diff = new Date(iso) - new Date();
  if (diff <= 0) return "Başladı!";
  const d = Math.floor(diff / 864e5);
  const h = Math.floor((diff % 864e5) / 36e5);
  const min = Math.floor((diff % 36e5) / 6e4);
  return `${d}g ${String(h).padStart(2, "0")}s ${String(min).padStart(2, "0")}d`;
};

window.debugLog = () => { };
