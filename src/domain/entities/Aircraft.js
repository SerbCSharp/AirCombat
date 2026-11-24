export class Aircraft {
  constructor({ id, type, team, x, y }) {
    this.id = id;
    this.type = type;
    this.team = team;
    this.position = { x, y };
  }
}