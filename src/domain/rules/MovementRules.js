import { Directions } from "./Directions.js";
import { CombatRules } from "./CombatRules.js";

const ACTION_BUDGET = {
  BOMBER: 2,
  FIGHTER: 3,
};

export class MovementRules {
  static getValidMoves(gameState, aircraft) {
    if (!aircraft) return [];

    const budget = ACTION_BUDGET[aircraft.type];
    if (!budget) return [];

    // Пункт 11: Взлёт самолёта идёт только по прямой
    if (!aircraft.isAirborne) {
      const takeoff = this._traceStraightMove(
        gameState,
        aircraft,
        aircraft.direction,
        budget,
      );
      return takeoff ? [takeoff] : [];
    }

    const moves = [];

    // а) Полёт прямо на весь бюджет
    const straightMove = this._traceStraightMove(
      gameState,
      aircraft,
      aircraft.direction,
      budget,
    );
    if (straightMove) moves.push(straightMove);

    // б) Поворот на месте (180° для бомбардировщика, ±90° для истребителя)
    const inPlaceTurns = aircraft.type === "BOMBER" ? [2] : [-1, 1];
    for (const turn of inPlaceTurns) {
      moves.push({
        x: aircraft.position.x,
        y: aircraft.position.y,
        direction: Directions.rotate90(aircraft.direction, turn),
        isAirborne: true,
        path: [],
        targetId: null,
      });
    }

    // в, г) Поворот(ы) на 90° + движение вперёд
    const moveTurns = aircraft.type === "BOMBER" ? [-1, 1] : [-1, 1, 2];
    for (const turn of moveTurns) {
      const dir = Directions.rotate90(aircraft.direction, turn);
      const steps = budget - Math.abs(turn);
      const move = this._traceStraightMove(gameState, aircraft, dir, steps);
      if (move) moves.push(move);
    }

    return moves;
  }

  static _traceStraightMove(gameState, aircraft, direction, steps) {
    const path = [];
    let x = aircraft.position.x;
    let y = aircraft.position.y;

    for (let i = 1; i <= steps; i++) {
      x += direction.dx;
      y += direction.dy;

      if (!gameState.board.isInside(x, y)) return null;

      path.push({ x, y });

      const occupant = gameState.getUnitAt(x, y);
      if (occupant) {
        // Пункт 5: Сбивший самолёт становится на место сбитого и теряет дальнейший ход
        if (CombatRules.canAircraftDestroy(aircraft, occupant, direction)) {
          return {
            x,
            y,
            direction,
            isAirborne: true,
            path,
            targetId: occupant.id,
          };
        }
        return null;
      }
    }

    return {
      x,
      y,
      direction,
      isAirborne: true,
      path,
      targetId: null,
    };
  }
}
