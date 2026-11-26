export const ORTHO_DIRECTIONS = [
  { dx: 0, dy: -1 }, // 0: N
  { dx: 1, dy: 0 },  // 1: E
  { dx: 0, dy: 1 },  // 2: S
  { dx: -1, dy: 0 }, // 3: W
];

export class Directions {
  static getIndex({ dx, dy }) {
    return ORTHO_DIRECTIONS.findIndex((d) => d.dx === dx && d.dy === dy);
  }

  static rotate90(direction, steps) {
    const idx = this.getIndex(direction);
    if (idx === -1) return { ...direction };
    const len = ORTHO_DIRECTIONS.length;
    const nextIdx = (((idx + steps) % len) + len) % len;
    return { ...ORTHO_DIRECTIONS[nextIdx] };
  }

  // Ракурс атаки относительно курса цели: FRONT (лоб), REAR (хвост), SIDE (бок)
  static getAttackAspect(attackDir, targetDir) {
    const dot = attackDir.dx * targetDir.dx + attackDir.dy * targetDir.dy;
    if (dot === -1) return "FRONT";
    if (dot === 1) return "REAR";
    return "SIDE";
  }
}

