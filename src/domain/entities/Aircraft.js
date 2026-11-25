export class Aircraft {
  constructor({ id, type, team, x, y, direction }) {
    this.id = id;
    this.type = type;
    this.team = team;
    this.position = { x, y };
    this.direction = direction || { dx: 0, dy: team === "RED" ? 1 : -1 };
    this.isAirborne = false;
    this.isDestroyed = false;
  }
}
