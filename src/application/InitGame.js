import { Board } from "../domain/entities/Board.js";
import { Aircraft } from "../domain/entities/Aircraft.js";
import { GameState } from "../domain/entities/GameState.js";

export class InitGame {
  build() {
    const board = new Board(14, 24);

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

    const aircrafts = [
      ...this._spawn("RED", redSlots),
      ...this._spawn("BLUE", blueSlots),
    ];

    return new GameState({ board, aircrafts });
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
    const p = team === "RED" ? "r" : "b";
    const initialDirection =
      team === "RED" ? { dx: 0, dy: 1 } : { dx: 0, dy: -1 };

    return slots.map(
      (c, i) =>
        new Aircraft({
          id: `${p}${i + 1}`,
          type: c.type,
          team,
          x: c.x,
          y: c.y,
          direction: { ...initialDirection },
        }),
    );
  }
}
