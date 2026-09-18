
window.Modal = {
  open(title, html, onMount = null) {
    this._destroy();

    const root = $("#modal-root");
    root.innerHTML = `
      <div class="modal-backdrop" id="modal-backdrop">
        <div class="modal" role="dialog" aria-modal="true" aria-label="${esc(title)}">
          <div class="modal__head">
            <h3>${esc(title)}</h3>
            <button class="icon-btn" data-modal-close aria-label="Kapat">${Icons.x}</button>
          </div>
          <div class="modal__body">${html}</div>
        </div>
      </div>`;

    const backdrop = $("#modal-backdrop");

    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) this.close();
    });
    $("[data-modal-close]", backdrop).addEventListener("click", () => this.close());

    document.body.style.overflow = "hidden";

    if (typeof onMount === "function") onMount(backdrop);
  },

  close() {
    const backdrop = $("#modal-backdrop");
    if (!backdrop) return;
    backdrop.classList.add("closing");
    backdrop.addEventListener("animationend", () => this._destroy(), { once: true });
    setTimeout(() => this._destroy(), 400);
  },

  _destroy() {
    $("#modal-root").innerHTML = "";
    document.body.style.overflow = "";
  }
};
