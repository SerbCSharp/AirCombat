export class MovementRules {
  static getValidMoves(aircraft, board, allAircrafts) {
    const maxAP = aircraft.type === "BOMBER" ? 2 : 3;
    const moves = [];

    const dirs = [
      { dx: 0, dy: -1 }, // Север
      { dx: 1, dy: 0 },  // Восток
      { dx: 0, dy: 1 },  // Юг
      { dx: -1, dy: 0 }, // Запад
    ];

    const getDirIndex = (d) => dirs.findIndex((item) => item.dx === d.dx && item.dy === d.dy);

    const dfs = (x, y, dirIdx, apLeft, path) => {
      if (path.length > 0) {
        moves.push({ x, y, direction: { ...dirs[dirIdx] }, path: [...path] });
      }
      if (apLeft === 0) return;

      // 1. Шаг вперед (1 ОД)
      const nx = x + dirs[dirIdx].dx;
      const ny = y + dirs[dirIdx].dy;

      if (board.isInside(nx, ny)) {
        const blocker = allAircrafts.find(
          (u) => u.id !== aircraft.id && u.position.x === nx && u.position.y === ny
        );

        if (!blocker) {
          dfs(nx, ny, dirIdx, apLeft - 1, [...path, "MOVE"]);
        } else if (blocker.team !== aircraft.team) {
          // Сюда добавим проверку CombatRules.canAttack(aircraft, dirs[dirIdx], blocker)
          moves.push({
            x: nx,
            y: ny,
            direction: { ...dirs[dirIdx] },
            path: [...path, "MOVE"],
            targetId: blocker.id,
          });
        }
      }

      // Пока самолет на земле (не взлетел) — повороты на месте запрещены
      if (!aircraft.isAirborne && path.length === 0) return;

      // 2. Поворот налево (1 ОД)
      dfs(x, y, (dirIdx + 3) % 4, apLeft - 1, [...path, "LEFT"]);

      // 3. Поворот направо (1 ОД)
      dfs(x, y, (dirIdx + 1) % 4, apLeft - 1, [...path, "RIGHT"]);
    };

    dfs(aircraft.position.x, aircraft.position.y, getDirIndex(aircraft.direction), maxAP, []);
    return moves;
  }
}