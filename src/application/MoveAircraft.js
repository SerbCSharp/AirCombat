import { MovementRules } from "../domain/rules/MovementRules.js";

export class MoveAircraft {
  constructor(gameState) {
    this.gameState = gameState;
  }

  execute(move) {
    const unit = this.gameState.getUnitById(this.gameState.selectedUnitId);
    if (!unit || !move) return false;

    const validMoves = MovementRules.getValidMoves(this.gameState, unit);
    const matchedMove = validMoves.find(
      (m) =>
        m.x === move.x &&
        m.y === move.y &&
        m.direction.dx === move.direction.dx &&
        m.direction.dy === move.direction.dy,
    );

    if (!matchedMove) return false;

    this.gameState.applyMove(unit, matchedMove);
    return true;
  }
}
