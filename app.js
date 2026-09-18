
window.App = {

  searchQuery: "",

  param: "",

  NAV: [
    { route: "home",        label: "Ana Sayfa", icon: "home" },
    { route: "matches",     label: "Maçlar",    icon: "ball" },
    { route: "teams",       label: "Takımlar",  icon: "users" },
    { route: "leaderboard", label: "Sıralama",  icon: "medal" },
    { route: "profile",     label: "Profil",    icon: "user" }
  ],

  init() {
    if (!Store.get("darkMode", true)) document.body.classList.add("light");

    $("#splash-logo").innerHTML = brandLogo(96);
    $("#header-logo").innerHTML = brandLogo(30);
    $("#bell-icon").innerHTML = Icons.bell;
    $("#chat-icon").innerHTML = Icons.chat;
    $("#search-icon").innerHTML = Icons.search;

    $("#bell-badge").hidden = Store.get("notifsRead", false);

    this.buildNav();
    this.bindGlobalEvents();

    setTimeout(() => {
      $("#splash").classList.add("splash--hide");
      $("#app").hidden = false;
      const target = Store.get("session") ? (this.routeFromHash() || "home") : "login";
      this.navigate(target, true);
    }, 2000);
  },

  buildNav() {
    $("#bottom-nav").innerHTML = this.NAV.map((n) => `
      <button class="bottom-nav__item" data-action="go" data-route="${n.route}" aria-label="${n.label}">
        ${Icons[n.icon]}
        <span>${n.label}</span>
      </button>`).join("");
  },

  updateNav(route) {
    $$(".bottom-nav__item").forEach((item) => {
      item.classList.toggle("active", item.dataset.route === route);
    });
  },

  routeFromHash() {
    const raw = location.hash.replace(/^#\/?/, "").trim();
    const [route, param = ""] = raw.split("/");
    this.param = param;
    return route;
  },

  navigate(route, replace = false) {
    const hash = "#/" + route;
    if (location.hash === hash) {
      this.renderRoute();
      return;
    }
    if (replace) location.replace(hash);
    else location.hash = hash;
  },

  renderRoute() {
    let route = this.routeFromHash() || "home";

    if (!Store.get("session") && route !== "login") {
      this.navigate("login", true);
      return;
    }
    if (Store.get("session") && route === "login") {
      this.navigate("home", true);
      return;
    }

    const page = Pages[route] || Pages.notfound;
    if (!Pages[route]) route = "notfound";

    const view = $("#view");
    const app = $("#app");

    app.classList.toggle("app--bare", !!page.bare);

    document.title = `${page.title} — MatchUp`;
    this.updateNav(route);

    if (route !== "search") {
      const input = $("#global-search");
      if (input && input.value) input.value = "";
    }

    clearInterval(this._pageTimer);
    this._pageTimer = null;

    if (!page.bare) {
      view.innerHTML = `<div class="page-enter">${skeletonHTML(3)}</div>`;
    }

    const delay = page.bare ? 0 : 350;
    clearTimeout(this._renderTimer);
    this._renderTimer = setTimeout(() => {
      view.innerHTML = `<div class="page-enter">${page.render()}</div>`;
      applyStagger(view);
      window.scrollTo({ top: 0 });
      if (typeof page.after === "function") page.after(view);
    }, delay);
  },

  bindGlobalEvents() {

    window.addEventListener("hashchange", () => this.renderRoute());

    document.addEventListener("click", (e) => {
      const target = e.target.closest("[data-action]");
      if (!target) return;
      const fn = Actions[target.dataset.action];
      if (typeof fn === "function") fn(target.dataset, target);
    });

    document.addEventListener("pointerdown", (e) => {
      const btn = e.target.closest(".btn");
      if (!btn || btn.disabled) return;

      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const ripple = document.createElement("span");
      ripple.className = "ripple";
      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = e.clientX - rect.left - size / 2 + "px";
      ripple.style.top = e.clientY - rect.top - size / 2 + "px";
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });

    let searchTimer;
    $("#global-search").addEventListener("input", (e) => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        this.searchQuery = e.target.value.trim();
        if (this.routeFromHash() === "search") {
          const view = $("#view");
          view.innerHTML = `<div class="page-enter">${Pages.search.render()}</div>`;
          applyStagger(view);
        } else if (this.searchQuery.length >= 2) {
          this.navigate("search");
        }
      }, 300);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") Modal.close();
    });
  }
};

Object.assign(Actions, {
  "go"(data) {
    App.navigate(data.route);
  },

  "back"() {
    if (history.length > 1) history.back();
    else App.navigate("home");
  }
});

App.init();
