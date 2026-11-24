export class Aircraft {
  constructor({ id, type, team, x, y, direction }) {
    this.id = id;
    this.type = type;
    this.team = team;
    this.position = { x, y };
    // Направление носа по сетке: dx (-1, 0, 1), dy (-1, 0, 1)
    this.direction = direction || { dx: 0, dy: team === "RED" ? 1 : -1 };
  }
}
