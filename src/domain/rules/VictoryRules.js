export class VictoryRules {
  static evaluate(gameState) {
    // 1. Проверка уничтожения штаба (если уже зафиксировано при пролёте бомбардировщика)
    if (gameState.winner) {
      return {
        winner: gameState.winner,
        reason: gameState.winReason || "HQ_DESTROYED",
      };
    }

    // 2. Проверка потери боеспособной авиации (0 бомбардировщиков и <= 2 истребителей)
    for (const team of ["RED", "BLUE"]) {
      const alive = gameState.aircrafts.filter((u) => u.team === team);
      const bombersLeft = alive.filter((u) => u.type === "BOMBER").length;
      const fightersLeft = alive.filter((u) => u.type === "FIGHTER").length;

      if (bombersLeft === 0 && fightersLeft <= 2) {
        return {
          winner: team === "RED" ? "BLUE" : "RED",
          reason: "AIR_FLEET_DESTROYED",
        };
      }
    }

    return null;
  }
}
