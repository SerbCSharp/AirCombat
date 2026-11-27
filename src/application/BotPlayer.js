import { BotEvaluator } from "../domain/ai/BotEvaluator.js";

export class BotPlayer {
  constructor({
    gameState,
    moveAircraft,
    botTeam = "BLUE",
    enabled = true,
    onStateChanged,
  }) {
    this.gameState = gameState;
    this.moveAircraft = moveAircraft;
    this.botTeam = botTeam;
    this.enabled = enabled;
    this.onStateChanged = onStateChanged;
    this.isThinking = false;
    this.timers = [];
  }

  setEnabled(enabled) {
    this.enabled = enabled;
    if (!enabled) {
      this._clearTimers();
      this.isThinking = false;
    } else {
      this.scheduleIfBotTurn();
    }
  }

  reset(gameState, moveAircraft) {
    this._clearTimers();
    this.isThinking = false;
    this.gameState = gameState;
    this.moveAircraft = moveAircraft;
  }

  scheduleIfBotTurn() {
    if (
      !this.enabled ||
      this.isThinking ||
      this.gameState.winner ||
      this.gameState.currentTurn !== this.botTeam
    ) {
      return;
    }

    this.isThinking = true;

    const t1 = setTimeout(() => {
      const choice = BotEvaluator.chooseBestMove(this.gameState, this.botTeam);
      if (!choice) {
        this.isThinking = false;
        return;
      }

      this.gameState.selectUnit(choice.unit.id);
      this.onStateChanged?.();

      const t2 = setTimeout(() => {
        this.moveAircraft.execute(choice.move);
        this.isThinking = false;
        this.onStateChanged?.();

        this.scheduleIfBotTurn();
      }, 500);
      this.timers.push(t2);
    }, 550);

    this.timers.push(t1);
  }

  _clearTimers() {
    this.timers.forEach((id) => clearTimeout(id));
    this.timers = [];
  }
}


