export class GameState {
  constructor({ board, aircrafts }) {
    this.board = board;
    this.aircrafts = aircrafts;

    // Чей сейчас ход ('RED' или 'BLUE')
    this.currentTurn = "RED";

    // По правилу Югина за 1 ход можно походить 1 истребителем и 1 бомбардировщиком
    this.turnActions = {
      FIGHTER: false,
      BOMBER: false,
    };

    this.selectedUnitId = null;
    this.winner = null;
  }

  getUnitById(id) {
    return this.aircrafts.find((u) => u.id === id) || null;
  }

  getAliveAircrafts() {
    return this.aircrafts.filter((u) => !u.isDestroyed);
  }

  canUnitAct(unit) {
    if (!unit || unit.isDestroyed) return false;
    if (unit.team !== this.currentTurn) return false;
    // Проверяем, не ходил ли уже игрок этим типом самолета в текущем ходу
    return !this.turnActions[unit.type];
  }

  registerUnitAction(unitType) {
    this.turnActions[unitType] = true;
    this.selectedUnitId = null;

    // Если оба типа самолетов походили (или одного из типов больше нет в живых) — передаем ход
    const hasFighters = this.getAliveAircrafts().some(
      (u) => u.team === this.currentTurn && u.type === "FIGHTER"
    );
    const hasBombers = this.getAliveAircrafts().some(
      (u) => u.team === this.currentTurn && u.type === "BOMBER"
    );

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