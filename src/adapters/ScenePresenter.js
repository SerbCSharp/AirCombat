export class ScenePresenter {
  constructor(step = 2) {
    this.step = step;
  }

  toWorld(x, y, w, h) {
    return {
      x: (x - (w - 2) / 2) * this.step,
      z: (y - h / 2) * this.step,
    };
  }

  present({ board, aircrafts }) {
    return {
      // Передаем данные доски и вычисленные мировые размеры
      board: {
        width: board.width,
        height: board.height,
        step: this.step,
      },
      units: aircrafts.map((u) => ({
        ...u,
        ...this.toWorld(u.position.x, u.position.y, board.width, board.height),
        rotationY: Math.atan2(u.direction.dx, u.direction.dy),
      })),
    };
  }
}
