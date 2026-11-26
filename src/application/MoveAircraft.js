import { MovementRules } from "../domain/rules/MovementRules.js";
import { AirDefenseRules } from "../domain/rules/AirDefenseRules.js";
import { VictoryRules } from "../domain/rules/VictoryRules.js";

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

    for (const cell of matchedMove.path) {
      const structure = this.gameState.board.getStructureAt(cell.x, cell.y);
      if (!structure) continue;

      if (AirDefenseRules.isShotDownByAA(unit, matchedMove.direction, structure)) {
        this.gameState.removeUnit(unit.id);
        break;
      }

      if (AirDefenseRules.isHQDestroyed(unit, structure)) {
        this.gameState.setWinner(unit.team, "HQ_DESTROYED");
        break;
      }
    }

    const victory = VictoryRules.evaluate(this.gameState);
    if (victory) {
      this.gameState.setWinner(victory.winner, victory.reason);
      return true;
    }

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

