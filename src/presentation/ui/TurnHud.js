export class TurnHud {
  constructor({ onToggleMode, onNewGame, onOpenRules } = {}) {
    this.container = document.createElement("div");
    Object.assign(this.container.style, {
      position: "fixed",
      top: "16px",
      left: "16px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      zIndex: "10",
      userSelect: "none",
      fontFamily: "system-ui, sans-serif",
    });

    this.statusEl = document.createElement("div");
    Object.assign(this.statusEl.style, {
      padding: "10px 16px",
      borderRadius: "8px",
      background: "rgba(24, 28, 36, 0.88)",
      color: "#ffffff",
      fontSize: "15px",
      fontWeight: "600",
      letterSpacing: "0.3px",
      borderLeft: "5px solid transparent",
    });

    this.modeBtn = this._createButton("Режим: Против ИИ", () => {
      onToggleMode?.();
    });

    this.newGameBtn = this._createButton("Новая игра", () => {
      onNewGame?.();
    });

    this.rulesBtn = this._createButton("Правила", () => {
      onOpenRules?.();
    });

    this.container.append(
      this.statusEl,
      this.modeBtn,
      this.newGameBtn,
      this.rulesBtn,
    );
    document.body.appendChild(this.container);
  }

  _createButton(text, onClick) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = text;
    Object.assign(btn.style, {
      padding: "10px 14px",
      borderRadius: "8px",
      border: "1px solid rgba(255, 255, 255, 0.18)",
      background: "rgba(24, 28, 36, 0.88)",
      color: "#f1f5f9",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "background 0.15s ease",
    });
    btn.addEventListener("mouseenter", () => {
      btn.style.background = "rgba(45, 53, 68, 0.95)";
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.background = "rgba(24, 28, 36, 0.88)";
    });
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      onClick();
    });
    return btn;
  }

  sync({ current, canMoveFighter, canMoveBomber, winner, winReason, vsBot }) {
    this.modeBtn.textContent = vsBot ? "Режим: Против ИИ" : "Режим: 2 игрока";

    if (winner) {
      const isRedWin = winner === "RED";
      const side = isRedWin ? "Красные" : "Синие";
      const reasonText =
        winReason === "HQ_DESTROYED"
          ? "Штаб уничтожен!"
          : "Авиация противника разгромлена!";

      this.statusEl.textContent = `Победа: ${side} (${reasonText})`;
      this.statusEl.style.borderLeftColor = isRedWin ? "#ff4d4d" : "#4da6ff";
      return;
    }

    const isRed = current === "RED";
    const side = isRed ? "Красные" : "Синие";

    const remaining = [];
    if (canMoveFighter) remaining.push("Истребитель");
    if (canMoveBomber) remaining.push("Бомбардировщик");

    this.statusEl.textContent = `Ход: ${side} (${remaining.join(" + ")})`;
    this.statusEl.style.borderLeftColor = isRed ? "#ff4d4d" : "#4da6ff";
  }

  dispose() {
    this.container.remove();
  }
}
