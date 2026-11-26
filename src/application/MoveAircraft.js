import { MovementRules } from "../domain/rules/MovementRules.js";

export class MoveAircraft {
  constructor(gameState) {
    this.gameState = gameState;
  }

  execute(move) {
    const unit = this.gameState.getUnitById(this.gameState.selectedUnitId);
    if (!this.gameState.canUnitAct(unit) || !move) return false;

    const validMoves = MovementRules.getValidMoves(this.gameState, unit);
    const matchedMove = validMoves.find(
      (m) =>
        m.x === move.x &&
        m.y === move.y &&
        m.direction.dx === move.direction.dx &&
        m.direction.dy === move.direction.dy,
    );

    if (!matchedMove) return false;

    if (matchedMove.targetId) {
      this.gameState.removeUnit(matchedMove.targetId);
    }

    this.gameState.applyMove(unit, matchedMove);

    if (!this._hasMoreActionsInTurn()) {
      this.gameState.switchTurn();
    }

    return true;
  }

  _hasMoreActionsInTurn() {
    return this.gameState.aircrafts.some(
      (u) =>
        this.gameState.canUnitAct(u) &&
        MovementRules.getValidMoves(this.gameState, u).length > 0,
    );
  }
}

