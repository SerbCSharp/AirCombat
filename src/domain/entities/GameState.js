export class GameState {
  constructor({ board, aircrafts = [] }) {
    this.board = board;
    this.aircrafts = [...aircrafts];
    this.selectedUnitId = null;
  }

  getUnitById(id) {
    return this.aircrafts.find((u) => u.id === id) || null;
  }

  getUnitAt(x, y) {
    return (
      this.aircrafts.find((u) => u.position.x === x && u.position.y === y) ||
      null
    );
  }

  selectUnit(unitId) {
    if (this.selectedUnitId === unitId) {
      this.selectedUnitId = null;
      return true;
    }

    const unit = this.getUnitById(unitId);
    if (!unit) return false;

    this.selectedUnitId = unit.id;
    return true;
  }

  applyMove(unit, { x, y, direction, isAirborne }) {
    unit.position = { x, y };
    unit.direction = { ...direction };
    unit.isAirborne = isAirborne;
    this.selectedUnitId = null;
  }
}




