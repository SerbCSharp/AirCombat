export class Board {
  constructor(width = 14, height = 24, structures = []) {
    this.width = width;
    this.height = height;
    this.structures = [...structures];
  }

  isInside(x, y) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  getStructureAt(x, y) {
    return this.structures.find((s) => s.x === x && s.y === y) || null;
  }
}

