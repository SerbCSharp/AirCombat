import { COLS, ROWS } from './initialAircraftPosition';

export const AP_LIMIT = {
  fighter: 3,
  bomber: 2,
};

// Векторы направлений под нашу систему координат:
// 0 = Вверх (y - 1), 1 = Вправо (x + 1), 2 = Вниз (y + 1), 3 = Влево (x - 1)
const DIR_VECTORS = [
  { dx: 0, dy: -1 },
  { dx: 1, dy: 0 },
  { dx: 0, dy: 1 },
  { dx: -1, dy: 0 },
];

function rotateDir(dir, delta) {
  return (dir + delta + 4) % 4;
}

function stepForward(x, y, dir) {
  const vec = DIR_VECTORS[dir];
  return { x: x + vec.dx, y: y + vec.dy };
}

function isInsideBoard(x, y) {
  return x >= 0 && x < COLS && y >= 0 && y < ROWS;
}

function isNodeOccupied(x, y, allUnits, ignoreUnitId) {
  return allUnits.some((u) => u.id !== ignoreUnitId && u.x === x && u.y === y);
}

// Главная функция: возвращает список уникальных точек { x, y, moves: [...] }
export const MAX_TURNS_PER_MOVE = 2; // Любой самолет может сделать максимум 2 поворота по 90°

export function getAvailableTargets(unit, allUnits) {
  if (!unit) return [];

  const maxAp = AP_LIMIT[unit.type];
  const targetsByCell = new Map();

  // Добавляем параметр turnsLeft (оставшиеся повороты на 90°)
  function search(x, y, dir, apLeft, turnsLeft, path) {
    if (apLeft < maxAp) {
      const cellKey = `${x},${y}`;
      if (!targetsByCell.has(cellKey)) {
        targetsByCell.set(cellKey, { x, y, options: [] });
      }
      const existing = targetsByCell.get(cellKey).options;
      if (!existing.some((opt) => opt.dir === dir)) {
        existing.push({ dir, path });
      }
    }

    if (apLeft === 0) return;

    // 1. Поворот налево (-1) и направо (+1) — только если еще остались повороты (turnsLeft > 0)
    if (turnsLeft > 0) {
      [-1, 1].forEach((turn) => {
        const nextDir = rotateDir(dir, turn);
        search(
          x,
          y,
          nextDir,
          apLeft - 1,
          turnsLeft - 1, // уменьшаем счетчик доступных поворотов
          [...path, { type: 'TURN', dir: nextDir }]
        );
      });
    }

    // 2. Шаг вперед на 1 узел — тратит 1 очко хода, повороты не трогает
    const nextPos = stepForward(x, y, dir);
    if (
      isInsideBoard(nextPos.x, nextPos.y) &&
      !isNodeOccupied(nextPos.x, nextPos.y, allUnits, unit.id)
    ) {
      search(
        nextPos.x,
        nextPos.y,
        dir,
        apLeft - 1,
        turnsLeft,
        [...path, { type: 'MOVE', x: nextPos.x, y: nextPos.y }]
      );
    }
  }

  // Запускаем поиск с лимитом 2 поворота
  search(unit.x, unit.y, unit.dir, maxAp, MAX_TURNS_PER_MOVE, []);
  return Array.from(targetsByCell.values());
}