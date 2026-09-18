
window.Pages = window.Pages || {};

Pages.favorites = {
  title: "Favoriler",

  render() {
    const favMatches = DB.matches.filter((m) => isFav("match", m.id));
    const favTeams   = allTeams().filter((t) => isFav("team", t.id));
    const favPlayers = DB.players.filter((p) => isFav("player", p.id));
    const favKeepers = DB.goalkeepers.filter((g) => isFav("keeper", g.id));
    const total = favMatches.length + favTeams.length + favPlayers.length + favKeepers.length;

    if (!total) {
      return `
        <div class="detail-head stagger">
          <button class="icon-btn" data-action="back" aria-label="Geri">${Icons.back}</button>
          <h1>Favoriler</h1>
        </div>
        ${emptyState(Icons.heart, "Henüz favorin yok",
          "Kartlardaki kalp ikonuna dokunarak maç, takım, oyuncu ve kalecileri buraya ekleyebilirsin.")}`;
    }

    return `
      <div class="detail-head stagger">
        <button class="icon-btn" data-action="back" aria-label="Geri">${Icons.back}</button>
        <h1>Favoriler</h1>
        <span class="chip">${total}</span>
      </div>

      ${favMatches.length ? sectionTitle(Icons.ball, `Maçlar (${favMatches.length})`) +
        `<div class="stack">${favMatches.map(matchCard).join("")}</div>` : ""}

      ${favTeams.length ? sectionTitle(Icons.users, `Takımlar (${favTeams.length})`) +
        `<div class="stack">${favTeams.map(teamCard).join("")}</div>` : ""}

      ${favPlayers.length ? sectionTitle(Icons.user, `Oyuncular (${favPlayers.length})`) +
        `<div class="player-grid">${favPlayers.map(playerMiniCard).join("")}</div>` : ""}

      ${favKeepers.length ? sectionTitle(Icons.glove, `Kaleciler (${favKeepers.length})`) +
        `<div class="stack">${favKeepers.map(keeperCard).join("")}</div>` : ""}`;
  }
};
