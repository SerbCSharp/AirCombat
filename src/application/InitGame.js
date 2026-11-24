import { Board } from "../domain/entities/Board.js";
import { Aircraft } from "../domain/entities/Aircraft.js";

export class InitGame {
  build() {
    const board = new Board(13, 23);

    const redCells = [
      ...this._rect(0, 2, 1, 2),
      ...this._rect(9, 11, 1, 3),
      { x: 8, y: 2 },
    ];
    const blueCells = [
      ...this._rect(9, 11, 21, 22),
      ...this._rect(0, 2, 20, 22),
      { x: 3, y: 21 },
    ];

    return {
      board,
      aircrafts: [
        ...this._spawn("RED", redCells),
        ...this._spawn("BLUE", blueCells),
      ],
    };
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
