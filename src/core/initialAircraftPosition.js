export const COLS = 23;
export const ROWS = 13;

function createSquadron(team, type, coords, dir) {
  return coords.map((pos, idx) => ({
    id: `${team}-${type}-${idx}`,
    team,
    type,
    x: pos.x,
    y: pos.y,
    dir,
  }));
}

export function initialAircraftPosition() {
  const blueFighters = createSquadron(
    "blue",
    "fighter",
    [
      { x: -0.5, y: 0.4 },
      { x: 0.5, y: 0.4 },
      { x: 1.5, y: 0.4 },
      { x: -0.5, y: 1.4 },
      { x: 0.5, y: 1.4 },
      { x: 1.5, y: 1.4 },
      { x: -0.5, y: 2.4 },
      { x: 0.5, y: 2.4 },
      { x: 1.5, y: 2.4 },
      { x: 0.5, y: 3.4 },
    ],
    1,
  );

  const blueBombers = createSquadron(
    "blue",
    "bomber",
    [
      { x: 0.4, y: 9.55 },
      { x: 1.4, y: 9.55 },
      { x: 0.4, y: 10.55 },
      { x: 1.4, y: 10.55 },
      { x: 0.4, y: 11.55 },
      { x: 1.4, y: 11.55 },
    ],
    1,
  );

  const redBombers = createSquadron(
    "yellow",
    "bomber",
    [
      { x: 20.5, y: 0.4 },
      { x: 21.5, y: 0.4 },
      { x: 20.5, y: 1.4 },
      { x: 21.5, y: 1.4 },
      { x: 20.5, y: 2.4 },
      { x: 21.5, y: 2.4 },
    ],
    3,
  );

  const redFighters = createSquadron(
    "yellow",
    "fighter",
    [
      { x: 20.5, y: 9.53 },
      { x: 21.5, y: 9.53 },
      { x: 22.5, y: 9.53 },
      { x: 20.5, y: 10.53 },
      { x: 21.5, y: 10.53 },
      { x: 22.5, y: 10.53 },
      { x: 20.5, y: 11.53 },
      { x: 21.5, y: 11.53 },
      { x: 22.5, y: 11.53 },
      { x: 21.5, y: 8.53 },
    ],
    3,
  );

  return [...blueFighters, ...blueBombers, ...redBombers, ...redFighters];
}
