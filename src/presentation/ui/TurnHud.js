export class TurnHud {
  constructor() {
    this.el = document.createElement("div");
    Object.assign(this.el.style, {
      position: "fixed",
      top: "16px",
      left: "16px",
      padding: "10px 16px",
      borderRadius: "8px",
      background: "rgba(24, 28, 36, 0.85)",
      color: "#ffffff",
      fontFamily: "system-ui, sans-serif",
      fontSize: "15px",
      fontWeight: "600",
      letterSpacing: "0.3px",
      pointerEvents: "none",
      userSelect: "none",
      borderLeft: "5px solid transparent",
    });
    document.body.appendChild(this.el);
  }

  sync({ current, canMoveFighter, canMoveBomber, winner, winReason }) {
    if (winner) {
      const isRedWin = winner === "RED";
      const side = isRedWin ? "Красные" : "Синие";
      const reasonText =
        winReason === "HQ_DESTROYED"
          ? "Штаб уничтожен!"
          : "Авиация противника разгромлена!";

      this.el.textContent = `Победа: ${side} (${reasonText})`;
      this.el.style.borderLeftColor = isRedWin ? "#ff4d4d" : "#4da6ff";
      return;
    }

    const isRed = current === "RED";
    const side = isRed ? "Красные" : "Синие";

    const remaining = [];
    if (canMoveFighter) remaining.push("Истребитель");
    if (canMoveBomber) remaining.push("Бомбардировщик");

    this.el.textContent = `Ход: ${side} (${remaining.join(" + ")})`;
    this.el.style.borderLeftColor = isRed ? "#ff4d4d" : "#4da6ff";
  }


  dispose() {
    this.el.remove();
  }
}


