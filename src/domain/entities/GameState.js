export class GameState {
  constructor({ board, aircrafts }) {
    this.board = board;
    this.aircrafts = [];
    aircrafts.forEach((u) => {
      if (!this.board.isInside(u.position.x, u.position.y)) {
        throw new Error(
          `Координаты (${u.position.x}, ${u.position.y}) вне поля`,
        );
      }
      if (this.getUnitAt(u.position.x, u.position.y)) {
        throw new Error(`Клетка (${u.position.x}, ${u.position.y}) уже занята`);
      }
      this.aircrafts.push(u);
    });

    this.currentTurn = "RED";
    this.turnActions = { FIGHTER: false, BOMBER: false };
    this.selectedUnitId = null;
    this.winner = null;
  }

  getUnitById(id) {
    return this.aircrafts.find((u) => u.id === id) || null;
  }

  getUnitAt(x, y) {
    return (
      this.aircrafts.find(
        (u) => !u.isDestroyed && u.position.x === x && u.position.y === y,
      ) || null
    );
  }

  getAliveAircrafts() {
    return this.aircrafts.filter((u) => !u.isDestroyed);
  }

  canUnitAct(unit) {
    if (!unit || unit.isDestroyed || this.winner) return false;
    if (unit.team !== this.currentTurn) return false;
    return !this.turnActions[unit.type];
  }

  selectUnit(unitId) {
    if (unitId === null) {
      this.selectedUnitId = null;
      return true;
    }
    const unit = this.getUnitById(unitId);
    if (!this.canUnitAct(unit)) return false;

    this.selectedUnitId = unit.id;
    return true;
  }

  applyMove(unitId, { x, y, direction, isAirborne, destroyedTargetIds = [] }) {
    const unit = this.getUnitById(unitId);
    if (!this.canUnitAct(unit)) return false;
    if (!this.board.isInside(x, y)) return false;

    // Сначала помечаем сбитые цели (на случай если летим на клетку сбитого врага)
    destroyedTargetIds.forEach((targetId) => {
      const target = this.getUnitById(targetId);
      if (target) target.isDestroyed = true;
    });

    const occupant = this.getUnitAt(x, y);
    if (occupant && occupant.id !== unit.id) return false;

    unit.position = { x, y };
    if (direction) unit.direction = { ...direction };
    if (typeof isAirborne === "boolean") unit.isAirborne = isAirborne;

    this.registerUnitAction(unit.type);
    return true;
  }

  registerUnitAction(unitType) {
    this.turnActions[unitType] = true;
    this.selectedUnitId = null;

    const aliveTeamUnits = this.getAliveAircrafts().filter(
      (u) => u.team === this.currentTurn,
    );
    const hasFighters = aliveTeamUnits.some((u) => u.type === "FIGHTER");
    const hasBombers = aliveTeamUnits.some((u) => u.type === "BOMBER");

    const fighterDone = this.turnActions.FIGHTER || !hasFighters;
    const bomberDone = this.turnActions.BOMBER || !hasBombers;

    if (fighterDone && bomberDone) {
      this.endTurn();
    }
  }

  endTurn() {
    this.currentTurn = this.currentTurn === "RED" ? "BLUE" : "RED";
    this.turnActions = { FIGHTER: false, BOMBER: false };
    this.selectedUnitId = null;
  }
}
