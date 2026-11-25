export class Board {
  constructor(width = 14, height = 24) {
    this.width = width;
    this.height = height;
  }

  isInside(x, y) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }
}
