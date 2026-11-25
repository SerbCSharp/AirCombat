import { Board } from "../domain/entities/Board.js";
import { Aircraft } from "../domain/entities/Aircraft.js";
import { GameState } from "../domain/entities/GameState.js";

export class InitGame {
  build() {
    const board = new Board(14, 24);

    const redCells = [
      ...this._rect(1, 3, 1, 2),
      ...this._rect(10, 12, 0, 2),
      { x: 9, y: 1 },
    ];
    const blueCells = [
      ...this._rect(10, 12, 21, 22),
      ...this._rect(1, 3, 21, 23),
      { x: 4, y: 22 },
    ];

    const aircrafts = [
      ...this._spawn("RED", redCells),
      ...this._spawn("BLUE", blueCells),
    ];

    return new GameState({ board, aircrafts });
  }

  _rect(x1, x2, y1, y2) {
    const res = [];
    for (let y = y1; y <= y2; y++)
      for (let x = x1; x <= x2; x++) res.push({ x, y });
    return res;
  }

  _spawn(team, cells) {
    const p = team === "RED" ? "r" : "b";
    const types = [...Array(6).fill("BOMBER"), ...Array(10).fill("FIGHTER")];
    // Красные смотрят вниз по сетке (+Y), синие — вверх (-Y)
    const initialDirection =
      team === "RED" ? { dx: 0, dy: 1 } : { dx: 0, dy: -1 };
    return cells.map(
      (c, i) =>
        new Aircraft({
          id: `${p}${i + 1}`,
          type: types[i],
          team,
          x: c.x,
          y: c.y,
          direction: { ...initialDirection },
        }),
    );
  }
}
