
window.Pages = window.Pages || {};

function rosterRow(p, extra = "") {
  return `
    <div class="roster-row" data-action="go" data-route="player/${p.id}">
      ${avatar(p.name, "sm")}
      <div class="grow">
        <div class="card__title" style="font-size:13.5px">${esc(p.name)} ${badges(p)}</div>
        <div class="card__sub">${esc(p.pos)} • ${p.ovr} OVR</div>
      </div>
      ${extra || `<span style="color:var(--text-3)">${Icons.chevron}</span>`}
    </div>`;
}

Pages.match = {
  title: "Maç Detayı",

  render() {
    const m = DB.matches.find((x) => x.id === App.param);
    if (!m) return emptyState(Icons.ball, "Maç bulunamadı", "Bu maç kaldırılmış olabilir.");

    const team = DB.teams.find((t) => t.id === m.teamId);
    const venue = DB.venues.find((v) => v.id === m.venueId);
    const joined = Store.get("joinedMatches", []).includes(m.id);
    const squad = (m.squad || []).map((id) => DB.players.find((p) => p.id === id)).filter(Boolean);
    const comments = [...(m.comments || []), ...Store.get("comments_" + m.id, [])];
    const result = Store.get("results", {})[m.id];

    return `
      <div class="detail-head stagger">
        <button class="icon-btn" data-action="back" aria-label="Geri">${Icons.back}</button>
        <h1>${m.missing} ${esc(m.position)} Aranıyor</h1>
        ${favBtn("match", m.id)}
      </div>

      <!-- Maç özeti -->
      <div class="card stagger">
        <div class="card__head">
          ${avatar(m.team, "", "avatar--team", team?.colors?.[0] || "", team?.logo || "")}
          <div style="flex:1; min-width:0">
            <div class="card__title">${esc(m.team)} ${team ? badges(team) : ""}</div>
            <div class="card__sub" data-action="go" data-route="venue/${m.venueId}" style="cursor:pointer; text-decoration:underline dotted">
              ${esc(m.venue)} • ${esc(m.district)}, ${esc(m.city)}
            </div>
          </div>
          ${team ? `<button class="btn btn--sm btn--ghost" data-action="go" data-route="team/${team.id}">Takım</button>` : ""}
        </div>
        <div class="stat-grid" style="margin:8px 0 4px">
          <div><b>${m.time}</b><span>${dayLabel(m)}</span></div>
          <div><b>${m.price}₺</b><span>Kişi Başı</span></div>
          <div><b>${m.dist}</b><span>km</span></div>
          <div><b>${venue ? venue.rating.toFixed(1) : "—"}</b><span>Saha Puanı</span></div>
        </div>
      </div>

      <!-- Eksik pozisyonlar -->
      ${sectionTitle(Icons.whistle, "Eksik Pozisyonlar")}
      <div class="need-row stagger">
        ${Array.from({ length: m.missing }, () =>
          `<span class="chip chip--red">${Icons.target} 1 ${esc(m.position)}</span>`).join("")}
        ${joined ? `<span class="chip">${Icons.check} Sen katıldın</span>` : ""}
      </div>

      <!-- Katılımcılar -->
      ${sectionTitle(Icons.users, `Katılımcılar (${squad.length + (joined ? 1 : 0)})`)}
      <div class="card stagger" style="padding:0; overflow:hidden">
        ${squad.map((p) => rosterRow(p)).join("")}
        ${joined ? `
          <div class="roster-row">
            ${avatar(DB.user.name, "sm", "", "#1f8a4d")}
            <div class="grow">
              <div class="card__title" style="font-size:13.5px">${esc(DB.user.name)} (Sen)</div>
              <div class="card__sub">${esc(DB.user.position)}</div>
            </div>
            <span class="chip">${Icons.check} Katıldın</span>
          </div>` : ""}
      </div>

      <!-- Maç sonrası (demo) -->
      ${sectionTitle(Icons.trophy, "Maç Sonrası")}
      ${result ? `
        <div class="result-banner stagger">
          <div class="score-big">${result.us} - ${result.them}</div>
          <p>
            ${result.scorers.length ? "⚽ " + result.scorers.map(esc).join(", ") : ""}
            ${result.assists.length ? "<br>🅰️ " + result.assists.map(esc).join(", ") : ""}
            ${result.motm ? `<br>⭐ Maçın oyuncusu: <b>${esc(result.motm)}</b>` : ""}
          </p>
        </div>` : `
        <div class="card stagger" style="text-align:center; padding:20px">
          <p class="muted" style="margin-bottom:12px">Maç bitince skoru, gol atanları ve maçın oyuncusunu gir.</p>
          <button class="btn btn--ghost" data-action="open-result" data-id="${m.id}">
            ${Icons.plus} Skor Gir (Demo)
          </button>
        </div>`}

      <!-- Yorumlar -->
      ${sectionTitle(Icons.chat, `Yorumlar (${comments.length})`)}
      <div class="card stagger" style="padding:0; overflow:hidden" id="comment-list">
        ${comments.map((c) => `
          <div class="comment">
            ${avatar(c.who, "sm")}
            <div class="comment__body">
              <div class="comment__who">${esc(c.who)}</div>
              <div class="comment__text">${esc(c.text)}</div>
              <div class="comment__time">${esc(c.time)}</div>
            </div>
          </div>`).join("")}
      </div>
      <div class="comment-box stagger">
        <input id="comment-input" type="text" maxlength="140" placeholder="Soru sor veya yorum yaz..." />
        <button class="icon-btn" data-action="send-comment" data-id="${m.id}" aria-label="Gönder">${Icons.send}</button>
      </div>

      <!-- Katıl CTA -->
      <div class="sticky-cta stagger">
        <button class="btn ${joined ? "btn--done" : "btn--primary"} btn--block"
                data-action="join-match" data-id="${m.id}">
          ${joined ? `${Icons.check} Bu maça katıldın` : `Maça Katıl — ${m.price}₺/kişi`}
        </button>
      </div>`;
  },

  after(root) {
    $("#comment-input", root)?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") Actions["send-comment"]({ id: App.param }, e.target);
    });
  }
};

Pages.team = {
  title: "Takım Profili",

  render() {
    const t = allTeams().find((x) => x.id === App.param);
    if (!t) return emptyState(Icons.users, "Takım bulunamadı", "Bu takım kaldırılmış olabilir.");

    const joined = Store.get("joinedTeams", []).includes(t.id);
    const c1 = (t.colors && t.colors[0]) || "#2ECC71";
    const c2 = (t.colors && t.colors[1]) || "#0B0F0D";
    const squad = (t.squad || []).map((id) => DB.players.find((p) => p.id === id)).filter(Boolean);
    const total = (t.w ?? 0) + (t.l ?? 0) + (t.d ?? 0);
    const winPct = total ? Math.round((t.w / total) * 100) : 0;

    return `
      <div class="detail-head stagger">
        <button class="icon-btn" data-action="back" aria-label="Geri">${Icons.back}</button>
        <h1>${esc(t.name)}</h1>
      </div>

      <!-- Kapak + logo -->
      <div class="cover stagger" style="background:linear-gradient(130deg, ${c1}66, ${c1}22 55%, var(--surface-2))">
        <div class="cover__pattern"></div>
        <div class="cover__logo">${t.logo}</div>
        <span class="cover__fav">${favBtn("team", t.id)}</span>
      </div>

      <div class="card__head stagger" style="margin-bottom:2px">
        <div style="flex:1">
          <div class="card__title" style="font-size:17px">${esc(t.name)} ${badges(t)}</div>
          <div class="card__sub">${esc(t.city)}${t.district ? " • " + esc(t.district) : ""} • ${t.founded}'den beri</div>
        </div>
        <span class="kit-dots" title="Forma renkleri">
          <i style="background:${c1}"></i><i style="background:${c2}"></i>
        </span>
      </div>
      <p class="muted stagger" style="margin:8px 0 4px; line-height:1.6">${esc(t.desc || "")}</p>

      <!-- İstatistikler -->
      <div class="stat-grid stagger">
        <div><b>${t.players}</b><span>Oyuncu</span></div>
        <div><b style="color:var(--primary)">${t.w ?? 0}</b><span>Galibiyet</span></div>
        <div><b style="color:var(--danger)">${t.l ?? 0}</b><span>Mağlubiyet</span></div>
        <div><b>%${winPct}</b><span>Kazanma</span></div>
      </div>
      <div class="stat-grid stagger" style="grid-template-columns:repeat(3,1fr)">
        <div><b>${t.gf ?? 0}</b><span>Attığı Gol</span></div>
        <div><b>${t.ga ?? 0}</b><span>Yediği Gol</span></div>
        <div><b>${(t.gf ?? 0) - (t.ga ?? 0) > 0 ? "+" : ""}${(t.gf ?? 0) - (t.ga ?? 0)}</b><span>Averaj</span></div>
      </div>

      <!-- Son maçlar -->
      ${(t.recent || []).length ? sectionTitle(Icons.ball, "Son Maçlar") + `
      <div style="display:flex; justify-content:flex-end; margin:-6px 0 8px">
        <div class="form-row">
          ${t.recent.map((r) => {
            const cls = r.gf > r.ga ? "w" : r.gf < r.ga ? "l" : "d";
            return `<span class="form-pill ${cls}">${cls === "w" ? "G" : cls === "l" ? "M" : "B"}</span>`;
          }).join("")}
        </div>
      </div>
      <div class="card stagger" style="padding:0; overflow:hidden">
        ${t.recent.map((r) => `
          <div class="recent-row">
            <span style="font-size:18px">${r.oppLogo}</span>
            <span style="flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap">${esc(r.opp)}</span>
            <span class="score ${r.gf > r.ga ? "w" : r.gf < r.ga ? "l" : ""}">${r.gf} - ${r.ga}</span>
          </div>`).join("")}
      </div>` : ""}

      <!-- Kadro -->
      ${squad.length ? sectionTitle(Icons.users, "Kadro") + `
      <div class="card stagger" style="padding:0; overflow:hidden">
        ${squad.map((p) => rosterRow(p)).join("")}
      </div>` : ""}

      <!-- Katıl CTA -->
      <div class="sticky-cta stagger">
        ${t.mine
          ? `<button class="btn btn--done btn--block">${Icons.check} Bu takımın kaptanısın</button>`
          : `<button class="btn ${joined ? "btn--done" : "btn--primary"} btn--block"
                     data-action="join-team" data-id="${t.id}">
               ${joined ? `${Icons.check} Üyelik isteğin gönderildi` : "Takıma Katıl"}
             </button>`}
      </div>`;
  }
};

Pages.player = {
  title: "Oyuncu Profili",

  render() {
    const p = DB.players.find((x) => x.id === App.param);
    if (!p) return emptyState(Icons.user, "Oyuncu bulunamadı", "Bu profil kaldırılmış olabilir.");

    const att = Math.min(99, Math.round(78 + p.trust * 4));
    const pun = Math.min(99, Math.round(74 + p.trust * 4.5));
    const cancels = Math.max(0, Math.round((5 - p.trust) * 2));

    return `
      <div class="detail-head stagger">
        <button class="icon-btn" data-action="back" aria-label="Geri">${Icons.back}</button>
        <h1>${esc(p.name)}</h1>
        ${favBtn("player", p.id)}
      </div>

      <!-- FUT KARTI -->
      ${futCard(p)}

      <!-- Hakkında -->
      ${sectionTitle(Icons.info, "Hakkında")}
      <div class="card stagger">
        <p class="muted" style="line-height:1.65">${esc(p.about)}</p>
        <div class="meta-row" style="margin:12px 0 0">
          <span class="meta">${Icons.pin} ${esc(p.city)}</span>
          <span class="meta">${Icons.target} Favori: ${esc(p.pos)}</span>
          <span class="meta">${onlineDot(p.online)} ${esc(p.last)}</span>
        </div>
      </div>

      <!-- Sezon istatistikleri -->
      ${sectionTitle(Icons.bolt, "Sezon İstatistikleri")}
      <div class="stat-grid stagger">
        <div><b>${p.matches}</b><span>Maç</span></div>
        <div><b>${p.g}</b><span>Gol</span></div>
        <div><b>${p.a}</b><span>Asist</span></div>
        <div><b>${p.w}</b><span>Galibiyet</span></div>
      </div>
      <div class="need-row stagger">
        <span class="chip">${Icons.fire} Bu hafta ${p.wg} gol</span>
        <span class="chip chip--gray">${Icons.bolt} Bu hafta ${p.wa} asist</span>
      </div>

      <!-- Güven puanı -->
      ${sectionTitle(Icons.shieldIcon, "Güven Puanı")}
      <div class="card stagger">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px">
          ${trustStars(p.trust)}
          <span class="chip">${p.trust >= 4.7 ? "Çok Güvenilir" : p.trust >= 4.3 ? "Güvenilir" : "Gelişiyor"}</span>
        </div>
        ${[["Maça gelme", att + "%"], ["Dakiklik", pun + "%"], ["Fair-play", p.trust.toFixed(1) + "/5"], ["Son dk. iptal", cancels + " kez"]]
          .map(([label, val]) => `
          <div class="statbar">
            <div class="statbar__label"><span>${label}</span><span>${val}</span></div>
            <div class="statbar__track">
              <div class="statbar__fill" style="width:${parseInt(val) || p.trust * 20}%"></div>
            </div>
          </div>`).join("")}
      </div>

      <!-- Aksiyonlar -->
      <div class="sticky-cta stagger" style="display:flex; gap:10px">
        <button class="btn btn--ghost" data-action="go" data-route="chat" style="flex:1">
          ${Icons.chat} Mesaj
        </button>
        <button class="btn btn--primary" data-action="invite-player" data-id="${p.id}" style="flex:2">
          ${Icons.plus} Takımına Davet Et
        </button>
      </div>`;
  }
};

Object.assign(Actions, {

  "send-comment"(data) {
    const input = $("#comment-input");
    const text = input?.value.trim();
    if (!text) return;

    const key = "comments_" + data.id;
    const mine = Store.get(key, []);
    mine.push({ who: DB.user.name, text, time: "Şimdi" });
    Store.set(key, mine);

    input.value = "";
    App.renderRoute();
    Toast.success("Yorumun eklendi 💬");
  },

  "open-result"(data) {
    const m = DB.matches.find((x) => x.id === data.id);
    if (!m) return;
    const squad = [DB.user, ...(m.squad || []).map((id) => DB.players.find((p) => p.id === id)).filter(Boolean)];

    const scorers = new Set();
    const assists = new Set();

    const pickRow = (group) => squad.map((p) =>
      `<button type="button" class="pick" data-group="${group}" data-name="${esc(p.name)}">${esc(p.name.split(" ")[0])}</button>`).join("");

    Modal.open("Maç Sonucu", `
      <div class="score-input">
        <input id="sc-us" type="number" min="0" max="99" value="0" aria-label="Bizim skor" />
        <span class="vs">VS</span>
        <input id="sc-them" type="number" min="0" max="99" value="0" aria-label="Rakip skor" />
      </div>
      <div class="field"><label>Gol Atanlar</label><div class="pick-row" id="pick-goals">${pickRow("goal")}</div></div>
      <div class="field"><label>Asist Yapanlar</label><div class="pick-row" id="pick-assists">${pickRow("assist")}</div></div>
      <div class="field">
        <label for="sc-motm">Maçın Oyuncusu</label>
        <select id="sc-motm">
          <option value="">Seç...</option>
          ${squad.map((p) => `<option>${esc(p.name)}</option>`).join("")}
        </select>
      </div>
      <button class="btn btn--primary btn--block" id="sc-save">${Icons.check} Sonucu Kaydet</button>
    `, (modal) => {
      modal.addEventListener("click", (e) => {
        const pick = e.target.closest(".pick");
        if (!pick) return;
        const set = pick.dataset.group === "goal" ? scorers : assists;
        const name = pick.dataset.name;
        set.has(name) ? set.delete(name) : set.add(name);
        pick.classList.toggle("selected", set.has(name));
      });

      $("#sc-save", modal).addEventListener("click", () => {
        const results = Store.get("results", {});
        results[m.id] = {
          us: parseInt($("#sc-us", modal).value, 10) || 0,
          them: parseInt($("#sc-them", modal).value, 10) || 0,
          scorers: [...scorers],
          assists: [...assists],
          motm: $("#sc-motm", modal).value
        };
        Store.set("results", results);
        Modal.close();
        Toast.success("Maç sonucu kaydedildi 🏆");
        App.renderRoute();
      });
    });
  },

  "invite-player"(data, btn) {
    const p = DB.players.find((x) => x.id === data.id);
    btn.classList.remove("btn--primary");
    btn.classList.add("btn--done");
    btn.innerHTML = `${Icons.check} Davet Gönderildi`;
    Toast.success(`Davet gönderildi: ${p ? p.name : ""} 🤝`);
  }
});
