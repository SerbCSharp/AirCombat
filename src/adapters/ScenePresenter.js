export class ScenePresenter {
  constructor(step = 2) {
    this.step = step;
    this.ALTITUDE = {
      GROUND: 0.55, // Стоит на аэродроме
      AIR: 1.5, // В воздухе
    };
  }

  toWorld(x, y, w, h, isAirborne = false) {
    return {
      x: (x - (w - 1) / 2) * this.step,
      y: isAirborne ? this.ALTITUDE.AIR : this.ALTITUDE.GROUND,
      z: (y - (h - 1) / 2) * this.step,
    };
  }

  present(gameState) {
    const { board } = gameState;
    const aliveUnits = gameState.getAliveAircrafts();
    return {
      turn: {
        current: gameState.currentTurn,
        canMoveFighter: !gameState.turnActions.FIGHTER,
        canMoveBomber: !gameState.turnActions.BOMBER,
        selectedUnitId: gameState.selectedUnitId,
      },
      board: {
        width: board.width,
        height: board.height,
        step: this.step,
      },
      units: aliveUnits.map((u) => ({
        id: u.id,
        type: u.type,
        team: u.team,
        isAirborne: u.isAirborne,
        isSelected: u.id === gameState.selectedUnitId,
        canAct: gameState.canUnitAct(u),
        worldPos: this.toWorld(
          u.position.x,
          u.position.y,
          board.width,
          board.height,
          u.isAirborne,
        ),
        rotationY: Math.atan2(u.direction.dx, u.direction.dy),
      })),
    };
  }
}
