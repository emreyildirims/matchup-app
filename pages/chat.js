
window.Pages = window.Pages || {};

function chatMessages(c) {
  return [...c.messages, ...Store.get("chatlog_" + c.id, [])];
}

function bubble(msg, isTeam) {
  return `
    <div class="bubble ${msg.me ? "bubble--me" : "bubble--them"}">
      ${!msg.me && isTeam ? `<div class="who">${esc(msg.who)}</div>` : ""}
      ${esc(msg.text)}
      <span class="t">${esc(msg.time)}</span>
    </div>`;
}

Pages.chat = {
  title: "Mesajlar",

  render() {
    if (App.param) {
      const c = DB.chats.find((x) => x.id === App.param);
      if (!c) return emptyState(Icons.chat, "Sohbet bulunamadı", "Bu sohbet silinmiş olabilir.");
      const isTeam = c.type === "team";

      return `
        <div class="detail-head stagger">
          <button class="icon-btn" data-action="back" aria-label="Geri">${Icons.back}</button>
          ${isTeam
            ? avatar(c.name, "", "avatar--team", c.color, c.logo)
            : avatar(c.name)}
          <div style="flex:1; min-width:0">
            <h1 style="font-size:16px">${esc(c.name)}</h1>
            <div class="card__sub">${isTeam ? "Takım sohbeti" : "Özel mesaj"}</div>
          </div>
        </div>

        <div class="chat-screen" id="chat-screen">
          ${chatMessages(c).map((m) => bubble(m, isTeam)).join("")}
        </div>

        <!-- Yazma çubuğu (bottom nav üstüne sabit) -->
        <div class="chat-input">
          <input id="chat-msg" type="text" maxlength="200" placeholder="Mesaj yaz..." autocomplete="off" />
          <button class="icon-btn" data-action="send-chat" data-id="${c.id}" aria-label="Gönder">${Icons.send}</button>
        </div>`;
    }

    const teams = DB.chats.filter((c) => c.type === "team");
    const dms = DB.chats.filter((c) => c.type === "dm");

    const row = (c) => `
      <div class="chat-row" data-action="go" data-route="chat/${c.id}">
        ${c.type === "team"
          ? avatar(c.name, "", "avatar--team", c.color, c.logo)
          : avatar(c.name)}
        <div class="grow">
          <div class="card__title" style="font-size:14px">${esc(c.name)}</div>
          <div class="last">${esc(c.last)}</div>
        </div>
        <div style="display:flex; flex-direction:column; align-items:flex-end; gap:5px">
          <span class="when">${esc(c.time)}</span>
          ${c.unread ? `<span class="chat-unread">${c.unread}</span>` : ""}
        </div>
      </div>`;

    return `
      <div class="page-head stagger">
        <h1>Mesajlar</h1>
        <p>Takım sohbetleri ve özel mesajlar</p>
      </div>

      ${sectionTitle(Icons.users, "Takım Sohbetleri")}
      <div class="card stagger" style="padding:0; overflow:hidden">${teams.map(row).join("")}</div>

      ${sectionTitle(Icons.user, "Özel Mesajlar")}
      <div class="card stagger" style="padding:0; overflow:hidden">${dms.map(row).join("")}</div>`;
  },

  after(root) {
    if (App.param) {
      window.scrollTo({ top: document.body.scrollHeight });
      $("#chat-msg", root)?.addEventListener("keydown", (e) => {
        if (e.key === "Enter") Actions["send-chat"]({ id: App.param }, e.target);
      });
      $("#chat-msg", root)?.focus();
    }
  }
};

Object.assign(Actions, {

  "send-chat"(data) {
    const input = $("#chat-msg");
    const text = input?.value.trim();
    if (!text) return;

    const c = DB.chats.find((x) => x.id === data.id);
    if (!c) return;

    const now = new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
    const log = Store.get("chatlog_" + c.id, []);
    log.push({ me: true, who: "Sen", text, time: now });
    Store.set("chatlog_" + c.id, log);

    const screen = $("#chat-screen");
    screen?.insertAdjacentHTML("beforeend", `
      <div class="bubble bubble--me">${esc(text)}<span class="t">${now}</span></div>`);
    input.value = "";
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });

    const REPLIES = ["Tamamdır 👍", "Süper, görüşürüz o zaman ⚽", "Ben de öyle düşünüyorum.", "Haber verirım, sağol!", "🔥🔥"];
    setTimeout(() => {
      if (App.routeFromHash() !== "chat" || App.param !== c.id) return;
      const reply = {
        me: false,
        who: c.type === "team" ? "Kerem Aslan" : c.name,
        text: REPLIES[Math.floor(Math.random() * REPLIES.length)],
        time: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })
      };
      const log2 = Store.get("chatlog_" + c.id, []);
      log2.push(reply);
      Store.set("chatlog_" + c.id, log2);
      $("#chat-screen")?.insertAdjacentHTML("beforeend", `
        <div class="bubble bubble--them">
          ${c.type === "team" ? `<div class="who">${esc(reply.who)}</div>` : ""}
          ${esc(reply.text)}<span class="t">${reply.time}</span>
        </div>`);
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 1400);
  }
});
