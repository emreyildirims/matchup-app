
window.Toast = {
  MAX: 3,

  show(message, type = "success", duration = 2800) {
    const root = $("#toast-root");
    if (!root) return;

    while (root.children.length >= this.MAX) root.firstChild.remove();

    const iconMap = {
      success: Icons.check,
      error:   Icons.alert,
      warn:    Icons.bell,
      info:    Icons.info
    };

    const el = document.createElement("div");
    el.className = `toast toast--${type}`;
    el.innerHTML = `${iconMap[type] || Icons.info}<span>${esc(message)}</span>`;
    root.appendChild(el);

    setTimeout(() => {
      el.classList.add("out");
      el.addEventListener("animationend", () => el.remove(), { once: true });
    }, duration);
  },

  success(msg) { this.show(msg, "success"); },
  error(msg)   { this.show(msg, "error"); },
  warn(msg)    { this.show(msg, "warn"); },
  info(msg)    { this.show(msg, "info"); }
};
