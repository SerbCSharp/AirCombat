export class Board {
  constructor(width = 13, height = 23) {
    this.width = width;
    this.height = height;
    this.grid = Array.from({ length: height }, (_, y) =>
      Array.from({ length: width }, (_, x) => ({ x, y, type: 'SKY', team: null }))
    );
  }

  setAirfieldCell(x, y, team) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      Object.assign(this.grid[y][x], { type: 'AIRFIELD', team });
    }
  }
}