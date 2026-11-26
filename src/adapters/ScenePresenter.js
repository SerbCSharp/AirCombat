import { MovementRules } from "../domain/rules/MovementRules.js";

export class ScenePresenter {
  constructor(step = 2) {
    this.step = step;
    this.ALTITUDE = {
      GROUND: 0.55,
      AIR: 1.4,
      SELECTED: 1.95,
      MARKER: 0.08,
    };
  }

  toWorld(x, y, width, height, altitudeY) {
    return {
      x: (x - (width - 1) / 2) * this.step,
      y: altitudeY,
      z: (y - (height - 1) / 2) * this.step,
    };
  }

  present(gameState) {
    const { board } = gameState;
    const selectedUnit = gameState.getUnitById(gameState.selectedUnitId);
    const rawMoves = selectedUnit
      ? MovementRules.getValidMoves(gameState, selectedUnit)
      : [];

    return {
      turn: {
        current: gameState.currentTurn,
        canMoveFighter: !gameState.movedTypes.has("FIGHTER"),
        canMoveBomber: !gameState.movedTypes.has("BOMBER"),
        winner: gameState.winner,
        winReason: gameState.winReason,
      },
      board: {
        width: board.width,
        height: board.height,
        step: this.step,
      },
      structures: board.structures.map((s, index) => ({
        index,
        type: s.type,
        team: s.team,
        worldPos: this.toWorld(s.x, s.y, board.width, board.height, 0.03),
        rotationY: s.direction
          ? Math.atan2(s.direction.dx, s.direction.dy)
          : 0,
      })),
      units: gameState.aircrafts.map((u) => {
        const isSelected = u.id === gameState.selectedUnitId;
        const altitudeY = isSelected
          ? this.ALTITUDE.SELECTED
          : u.isAirborne
            ? this.ALTITUDE.AIR
            : this.ALTITUDE.GROUND;

        return {
          id: u.id,
          type: u.type,
          team: u.team,
          worldPos: this.toWorld(
            u.position.x,
            u.position.y,
            board.width,
            board.height,
            altitudeY,
          ),
          rotationY: Math.atan2(u.direction.dx, u.direction.dy),
        };
      }),
      moveMarkers: rawMoves.map((move, index) => {
        const isTurnInPlace =
          selectedUnit &&
          move.x === selectedUnit.position.x &&
          move.y === selectedUnit.position.y;
        const isAttack = Boolean(move.targetId);

        const altitudeY = isTurnInPlace
          ? this.ALTITUDE.SELECTED
          : isAttack
            ? this.ALTITUDE.AIR
            : this.ALTITUDE.MARKER;
        const basePos = this.toWorld(
          move.x,
          move.y,
          board.width,
          board.height,
          altitudeY,
        );
        const offset = isTurnInPlace ? 0.85 : 0;

        return {
          index,
          move,
          isTurnInPlace,
          isAttack,
          worldPos: {
            x: basePos.x + move.direction.dx * offset,
            y: basePos.y,
            z: basePos.z + move.direction.dy * offset,
          },
          rotationY: Math.atan2(move.direction.dx, move.direction.dy),
        };
      }),
    };
  }
}
