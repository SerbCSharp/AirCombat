import { Board } from '../domain/entities/Board.js';
import { Airfield } from '../domain/entities/Airfield.js';
import { Aircraft } from '../domain/entities/Aircraft.js';

export class InitGame {
  build() {
    const board = new Board(13, 23);

    const redCells = [...this._rect(1, 3, 1, 2), ...this._rect(7, 11, 1, 2)];
    const blueCells = [...this._rect(1, 3, 20, 21), ...this._rect(7, 11, 20, 21)];

    redCells.forEach(({ x, y }) => board.setAirfieldCell(x, y, 'RED'));
    blueCells.forEach(({ x, y }) => board.setAirfieldCell(x, y, 'BLUE'));

    return {
      board,
      airfields: [
        new Airfield({ team: 'RED', cells: redCells }),
        new Airfield({ team: 'BLUE', cells: blueCells }),
      ],
      aircrafts: [
        ...this._spawn('RED', redCells),
        ...this._spawn('BLUE', blueCells),
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
    const p = team === 'RED' ? 'r' : 'b';
    const types = [...Array(6).fill('BOMBER'), ...Array(10).fill('FIGHTER')];
    return cells.map((c, i) => new Aircraft({ id: `${p}${i + 1}`, type: types[i], team, x: c.x, y: c.y }));
  }
}