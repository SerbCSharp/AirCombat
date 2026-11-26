export class PlacementRules {
  static validatePlacement(board, existingAircrafts, candidate) {
    const { x, y } = candidate.position;

    if (!board.isInside(x, y)) {
      throw new Error(`Координаты (${x}, ${y}) вне поля`);
    }

    const isOccupied = existingAircrafts.some(
      (u) => u.position.x === x && u.position.y === y,
    );
    if (isOccupied) {
      throw new Error(`Клетка (${x}, ${y}) уже занята`);
    }
  }
}