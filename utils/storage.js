
window.Store = {
  PREFIX: "matchup_",

  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(this.PREFIX + key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch {
      return fallback;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(this.PREFIX + key, JSON.stringify(value));
    } catch {
    }
  },

  remove(key) {
    try { localStorage.removeItem(this.PREFIX + key); } catch { }
  },

  clearAll() {
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith(this.PREFIX))
        .forEach((k) => localStorage.removeItem(k));
    } catch { }
  }
};
