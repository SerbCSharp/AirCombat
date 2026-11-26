import { Board } from "../domain/entities/Board.js";
import { Aircraft } from "../domain/entities/Aircraft.js";
import { GameState } from "../domain/entities/GameState.js";
import { PlacementRules } from "../domain/rules/PlacementRules.js";

export class InitGame {
  build() {
    const structures = [
      // Штабы (HQ)
      { type: "HQ", team: "RED", x: 0, y: 0 },
      { type: "HQ", team: "BLUE", x: 13, y: 23 },

      { type: "SAM", team: "RED", x: 0, y: 1 },
      { type: "SAM", team: "RED", x: 6, y: 1 },
      { type: "SAM", team: "RED", x: 13, y: 2 },
      { type: "SAM", team: "RED", x: 6, y: 9 },
      { type: "AA_GUN", team: "RED", x: 1, y: 4, direction: { dx: 0, dy: 1 } },
      { type: "AA_GUN", team: "RED", x: 3, y: 3, direction: { dx: 0, dy: 1 } },
      { type: "AA_GUN", team: "RED", x: 4, y: 4, direction: { dx: 0, dy: 1 } },
      { type: "AA_GUN", team: "RED", x: 9, y: 4, direction: { dx: 0, dy: 1 } },
      { type: "AA_GUN", team: "RED", x: 11, y: 3, direction: { dx: 0, dy: 1 } },
      { type: "AA_GUN", team: "RED", x: 10, y: 6, direction: { dx: 0, dy: 1 } },
      { type: "AA_GUN", team: "RED", x: 8, y: 7, direction: { dx: 0, dy: 1 } },
      { type: "AA_GUN", team: "RED", x: 2, y: 7, direction: { dx: 0, dy: 1 } },

      { type: "SAM", team: "BLUE", x: 13, y: 22 },
      { type: "SAM", team: "BLUE", x: 7, y: 22 },
      { type: "SAM", team: "BLUE", x: 0, y: 21 },
      { type: "SAM", team: "BLUE", x: 5, y: 16 },
      { type: "AA_GUN", team: "BLUE", x: 2, y: 20, direction: { dx: 0, dy: -1 } },
      { type: "AA_GUN", team: "BLUE", x: 4, y: 19, direction: { dx: 0, dy: -1 } },
      { type: "AA_GUN", team: "BLUE", x: 3, y: 17, direction: { dx: 0, dy: -1 } },
      { type: "AA_GUN", team: "BLUE", x: 7, y: 14, direction: { dx: 0, dy: -1 } },
      { type: "AA_GUN", team: "BLUE", x: 9, y: 19, direction: { dx: 0, dy: -1 } },
      { type: "AA_GUN", team: "BLUE", x: 10, y: 20, direction: { dx: 0, dy: -1 } },
      { type: "AA_GUN", team: "BLUE", x: 11, y: 16, direction: { dx: 0, dy: -1 } },
      { type: "AA_GUN", team: "BLUE", x: 12, y: 19, direction: { dx: 0, dy: -1 } },
    ];




    const board = new Board(14, 24, structures);

    const redSlots = [
      ...this._rect(1, 3, 1, 2, "BOMBER"),
      ...this._rect(10, 12, 0, 2, "FIGHTER"),
      { x: 9, y: 1, type: "FIGHTER" },
    ];
    const blueSlots = [
      ...this._rect(10, 12, 21, 22, "BOMBER"),
      ...this._rect(1, 3, 21, 23, "FIGHTER"),
      { x: 4, y: 22, type: "FIGHTER" },
    ];

    const aircrafts = [];
    [...this._spawn("RED", redSlots), ...this._spawn("BLUE", blueSlots)].forEach(
      (unit) => {
        PlacementRules.validatePlacement(board, aircrafts, unit);
        aircrafts.push(unit);
      },
    );

    const firstTurn = Math.random() < 0.5 ? "RED" : "BLUE";
    return new GameState({ board, aircrafts, currentTurn: firstTurn });
  }

  _rect(x1, x2, y1, y2, type) {
    const res = [];
    for (let y = y1; y <= y2; y++) {
      for (let x = x1; x <= x2; x++) {
        res.push({ x, y, type });
      }
    }
    return res;
  }

  _spawn(team, slots) {
    const prefix = team === "RED" ? "r" : "b";
    const initialDirection =
      team === "RED" ? { dx: 0, dy: 1 } : { dx: 0, dy: -1 };

    return slots.map(
      (slot, i) =>
        new Aircraft({
          id: `${prefix}${i + 1}`,
          type: slot.type,
          team,
          x: slot.x,
          y: slot.y,
          direction: { ...initialDirection },
        }),
    );
  }
}

