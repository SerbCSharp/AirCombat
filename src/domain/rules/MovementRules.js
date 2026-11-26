import { Directions } from "./Directions.js";

const ACTION_BUDGET = {
  BOMBER: 2,
  FIGHTER: 3,
};

export class MovementRules {
  static getValidMoves(gameState, aircraft) {
    if (!aircraft) return [];

    const budget = ACTION_BUDGET[aircraft.type];
    if (!budget) return [];

    if (!aircraft.isAirborne) {
      const takeoff = this._traceStraightMove(
        gameState,
        aircraft.position,
        aircraft.direction,
        budget,
      );
      return takeoff ? [takeoff] : [];
    }

    const moves = [];

    // а) Полёт прямо на весь бюджет
    const straightMove = this._traceStraightMove(
      gameState,
      aircraft.position,
      aircraft.direction,
      budget,
    );
    if (straightMove) moves.push(straightMove);

    // б) Поворот на месте
     const inPlaceTurns = aircraft.type === "BOMBER" ? [2] : [-1, 1];
    for (const turn of inPlaceTurns) {
      moves.push({
        x: aircraft.position.x,
        y: aircraft.position.y,
        direction: Directions.rotate90(aircraft.direction, turn),
        isAirborne: true,
        path: [],
      });
    }

    // в, г) Поворот(ы) на 90° + движение вперёд
    const moveTurns = aircraft.type === "BOMBER" ? [-1, 1] : [-1, 1, 2];
    for (const turn of moveTurns) {
      const dir = Directions.rotate90(aircraft.direction, turn);
      const steps = budget - Math.abs(turn);
      const move = this._traceStraightMove(
        gameState,
        aircraft.position,
        dir,
        steps,
      );
      if (move) moves.push(move);
    }

    return moves;
  }

  static _traceStraightMove(gameState, origin, direction, steps) {
    const path = [];
    let x = origin.x;
    let y = origin.y;

    for (let i = 1; i <= steps; i++) {
      x += direction.dx;
      y += direction.dy;

      if (!gameState.board.isInside(x, y)) return null;

      const occupant = gameState.getUnitAt(x, y);
      // Промежуточные клетки должны быть свободны; конечная пока тоже (до добавления правил боя)
      if (occupant) return null;

      path.push({ x, y });
    }

    return {
      x,
      y,
      direction,
      isAirborne: true,
      path,
    };
  }
}
