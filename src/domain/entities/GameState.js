export class GameState {
  constructor({ board, aircrafts = [], currentTurn = "RED" }) {
    this.board = board;
    this.aircrafts = [...aircrafts];
    this.currentTurn = currentTurn;
    this.movedTypes = new Set();
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

  removeUnit(id) {
    this.aircrafts = this.aircrafts.filter((u) => u.id !== id);
  }

  canUnitAct(unit) {
    return (
      Boolean(unit) &&
      unit.team === this.currentTurn &&
      !this.movedTypes.has(unit.type)
    );
  }

  selectUnit(unitId) {
    if (this.selectedUnitId === unitId) {
      this.selectedUnitId = null;
      return true;
    }

    const unit = this.getUnitById(unitId);
    if (!this.canUnitAct(unit)) return false;

    this.selectedUnitId = unit.id;
    return true;
  }

  applyMove(unit, { x, y, direction, isAirborne }) {
    unit.position = { x, y };
    unit.direction = { ...direction };
    unit.isAirborne = isAirborne;
    this.movedTypes.add(unit.type);
    this.selectedUnitId = null;
  }

  switchTurn() {
    this.currentTurn = this.currentTurn === "RED" ? "BLUE" : "RED";
    this.movedTypes.clear();
  }
}


