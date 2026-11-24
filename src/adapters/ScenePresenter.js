export class ScenePresenter {
  constructor(step = 2) {
    this.step = step;
  }

  toWorld(x, y, w, h) {
    return {
      x: (x - (w - 1) / 2) * this.step,
      z: (y - (h - 1) / 2) * this.step,
    };
  }

  present({ board, aircrafts }) {
    return {
      cells: board.grid.flat().map((c) => ({ ...c, ...this.toWorld(c.x, c.y, board.width, board.height) })),
      units: aircrafts.map((u) => ({ ...u, ...this.toWorld(u.position.x, u.position.y, board.width, board.height) })),
    };
  }
}