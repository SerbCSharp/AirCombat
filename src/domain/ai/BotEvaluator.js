import { MovementRules } from "../rules/MovementRules.js";
import { AirDefenseRules } from "../rules/AirDefenseRules.js";
import { VictoryRules } from "../rules/VictoryRules.js";

const MAX_DEPTH = 4; // 2 полных хода вперёд (4 полухода)

export class BotEvaluator {
  static chooseBestMove(gameState, botTeam) {
    const rootActions = this._getRankedActions(gameState, botTeam, 16);
    if (rootActions.length === 0) return null;

    let bestAction = rootActions.at(0);
    let bestScore = -Infinity;

    for (const action of rootActions) {
      const nextState = this._simulateAction(
        gameState,
        action.unit.id,
        action.move,
      );
      const score = this._minimax(
        nextState,
        MAX_DEPTH - 1,
        -Infinity,
        Infinity,
        botTeam,
      );

      const totalScore = score + Math.random() * 4;
      if (totalScore > bestScore) {
        bestScore = totalScore;
        bestAction = action;
      }
    }

    return { unit: bestAction.unit, move: bestAction.move };
  }

  static _minimax(state, depth, alpha, beta, botTeam) {
    if (depth === 0 || state.winner) {
      const winBonus = state.winner
        ? state.winner === botTeam
          ? depth * 3000
          : -depth * 3000
        : 0;
      return this._evaluateBoard(state, botTeam) + winBonus;
    }

    const activeTeam = state.currentTurn;
    const isMaximizing = activeTeam === botTeam;
    const beamWidth = depth >= 2 ? 9 : 6;
    const actions = this._getRankedActions(state, activeTeam, beamWidth);

    if (actions.length === 0) {
      return this._evaluateBoard(state, botTeam);
    }

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const action of actions) {
        const nextState = this._simulateAction(
          state,
          action.unit.id,
          action.move,
        );
        const ev = this._minimax(nextState, depth - 1, alpha, beta, botTeam);
        if (ev > maxEval) maxEval = ev;
        if (ev > alpha) alpha = ev;
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const action of actions) {
        const nextState = this._simulateAction(
          state,
          action.unit.id,
          action.move,
        );
        const ev = this._minimax(nextState, depth - 1, alpha, beta, botTeam);
        if (ev < minEval) minEval = ev;
        if (ev < beta) beta = ev;
        if (beta <= alpha) break;
      }
      return minEval;
    }
  }

  // Назначаем 1 бомбардировщик Стражем штаба до конца игры (пока жив хотя бы 1 бомбардировщик)
  static _getBaseGuardId(state, team, ownHQ) {
    if (!ownHQ) return null;
    const bombers = state.aircrafts.filter(
      (u) => u.team === team && u.type === "BOMBER",
    );
    if (bombers.length === 0) return null;

    let closest = null;
    let minDist = Infinity;
    for (const b of bombers) {
      const d =
        Math.abs(b.position.x - ownHQ.x) + Math.abs(b.position.y - ownHQ.y);
      if (d < minDist) {
        minDist = d;
        closest = b;
      }
    }
    return closest ? closest.id : null;
  }

  static _isEnemyHQFortified(state, enemyTeam, enemyHQ) {
    if (!enemyHQ) return false;
    const occupant = state.getUnitAt(enemyHQ.x, enemyHQ.y);
    return (
      Boolean(occupant) &&
      occupant.team === enemyTeam &&
      occupant.type === "BOMBER" &&
      occupant.isAirborne
    );
  }

  static _getRankedActions(state, team, limit) {
    const enemyTeam = team === "RED" ? "BLUE" : "RED";
    const enemyHQ = state.board.structures.find(
      (s) => s.type === "HQ" && s.team === enemyTeam,
    );
    const ownHQ = state.board.structures.find(
      (s) => s.type === "HQ" && s.team === team,
    );
    const enemies = state.aircrafts.filter((u) => u.team === enemyTeam);
    const guardId = this._getBaseGuardId(state, team, ownHQ);
    const enemyHQFortified = this._isEnemyHQFortified(
      state,
      enemyTeam,
      enemyHQ,
    );

    const list = [];

    for (const unit of state.aircrafts) {
      if (!state.canUnitAct(unit) || unit.team !== team) continue;

      const moves = MovementRules.getValidMoves(state, unit);
      for (const move of moves) {
        const quickScore = this._quickMoveScore(
          state,
          unit,
          move,
          enemyHQ,
          ownHQ,
          enemies,
          guardId,
          enemyHQFortified,
        );
        list.push({ unit, move, quickScore });
      }
    }

    list.sort((a, b) => b.quickScore - a.quickScore);
    return list.slice(0, limit);
  }

  static _quickMoveScore(
    state,
    unit,
    move,
    enemyHQ,
    ownHQ,
    enemies,
    guardId,
    enemyHQFortified,
  ) {
    let score = 0;

    // 1. Смертельное ПВО и победа по штабу
    for (const cell of move.path) {
      const structure = state.board.getStructureAt(cell.x, cell.y);
      if (!structure) continue;
      if (AirDefenseRules.isShotDownByAA(unit, move.direction, structure)) {
        return -50000;
      }
      if (AirDefenseRules.isHQDestroyed(unit, structure)) {
        return 50000;
      }
    }

    // 2. Любое сбитие врага (особенно бомбардировщика) — главный приоритет
    if (move.targetId) {
      const target = state.getUnitById(move.targetId);
      score += target?.type === "BOMBER" ? 8000 : 5000;
    }

    // 3. Взлёт с аэродрома
    if (!unit.isAirborne && move.isAirborne) {
      score += 180;
    }

    // 4. Страж штаба летит на свой штаб и держит оборону
    if (unit.id === guardId && ownHQ) {
      const oldDist =
        Math.abs(unit.position.x - ownHQ.x) +
        Math.abs(unit.position.y - ownHQ.y);
      const newDist = Math.abs(move.x - ownHQ.x) + Math.abs(move.y - ownHQ.y);
      score += (oldDist - newDist) * 40;
      if (newDist === 0) score += 300;
      return score;
    }

    // 5. Если вражеский штаб закрыт крепостью — все силы переключаются на охоту за авиацией врага
    if (enemyHQFortified && enemies.length > 0) {
      let bestGain = -Infinity;
      for (const e of enemies) {
        const weight = e.type === "BOMBER" ? 18 : 12;
        const oldDist =
          Math.abs(unit.position.x - e.position.x) +
          Math.abs(unit.position.y - e.position.y);
        const newDist =
          Math.abs(move.x - e.position.x) + Math.abs(move.y - e.position.y);
        const gain = (oldDist - newDist) * weight;
        if (gain > bestGain) bestGain = gain;
      }
      return score + bestGain;
    }

    // 6. Обычный режим: бомбардировщик идёт к вражескому штабу, истребитель — перехватывает угрозы
    if (unit.type === "BOMBER" && enemyHQ) {
      const oldDist =
        Math.abs(unit.position.x - enemyHQ.x) +
        Math.abs(unit.position.y - enemyHQ.y);
      const newDist =
        Math.abs(move.x - enemyHQ.x) + Math.abs(move.y - enemyHQ.y);
      score += (oldDist - newDist) * 14;
    } else if (unit.type === "FIGHTER" && enemies.length > 0) {
      let bestGain = -Infinity;
      for (const e of enemies) {
        let weight = e.type === "BOMBER" ? 14 : 6;

        if (e.type === "BOMBER" && ownHQ) {
          const threatDist =
            Math.abs(e.position.x - ownHQ.x) + Math.abs(e.position.y - ownHQ.y);
          if (threatDist <= 14) {
            weight = 50;
          }
        }

        const oldDist =
          Math.abs(unit.position.x - e.position.x) +
          Math.abs(unit.position.y - e.position.y);
        const newDist =
          Math.abs(move.x - e.position.x) + Math.abs(move.y - e.position.y);
        const gain = (oldDist - newDist) * weight;
        if (gain > bestGain) bestGain = gain;
      }
      score += bestGain;
    }

    return score;
  }

  static _simulateAction(state, unitId, move) {
    const next = state.clone();
    const unit = next.getUnitById(unitId);
    if (!unit) return next;

    if (move.targetId) {
      next.removeUnit(move.targetId);
    }

    next.applyMove(unit, move);

    for (const cell of move.path) {
      const structure = next.board.getStructureAt(cell.x, cell.y);
      if (!structure) continue;

      if (AirDefenseRules.isShotDownByAA(unit, move.direction, structure)) {
        next.removeUnit(unit.id);
        break;
      }

      if (AirDefenseRules.isHQDestroyed(unit, structure)) {
        next.setWinner(unit.team, "HQ_DESTROYED");
        break;
      }
    }

    const victory = VictoryRules.evaluate(next);
    if (victory) {
      next.setWinner(victory.winner, victory.reason);
      return next;
    }

    const hasMore = next.aircrafts.some(
      (u) =>
        next.canUnitAct(u) && MovementRules.getValidMoves(next, u).length > 0,
    );
    if (!hasMore) {
      next.switchTurn();
    }

    return next;
  }

  static _evaluateBoard(state, botTeam) {
    if (state.winner) {
      return state.winner === botTeam ? 100000 : -100000;
    }

    const enemyTeam = botTeam === "RED" ? "BLUE" : "RED";
    const enemyHQ = state.board.structures.find(
      (s) => s.type === "HQ" && s.team === enemyTeam,
    );
    const ownHQ = state.board.structures.find(
      (s) => s.type === "HQ" && s.team === botTeam,
    );
    const guardId = this._getBaseGuardId(state, botTeam, ownHQ);
    const enemyHQFortified = this._isEnemyHQFortified(
      state,
      enemyTeam,
      enemyHQ,
    );

    let score = 0;
    const botUnits = [];
    const enemyUnits = [];

    for (const u of state.aircrafts) {
      if (u.team === botTeam) botUnits.push(u);
      else enemyUnits.push(u);
    }

    const threatenedBotIds = new Set();
    for (const e of enemyUnits) {
      const enemyMoves = MovementRules.getValidMoves(state, e);
      for (const m of enemyMoves) {
        if (m.targetId) threatenedBotIds.add(m.targetId);
      }

      score -= e.type === "BOMBER" ? 1500 : 1000;
      if (e.isAirborne) score -= 120;

      if (e.type === "BOMBER" && ownHQ) {
        const dist =
          Math.abs(e.position.x - ownHQ.x) + Math.abs(e.position.y - ownHQ.y);
        const closeness = Math.max(0, 36 - dist);
        score -= closeness * 25 + closeness * closeness * 2.5;
      }
    }
    for (const u of botUnits) {
      score += u.type === "BOMBER" ? 1500 : 1000;
      if (u.isAirborne) score += 120;
      if (threatenedBotIds.has(u.id)) {
        score -= u.type === "BOMBER" ? 1400 : 950;
      }
      // Оценка Стража штаба
      if (u.id === guardId && ownHQ) {
        const distToHome =
          Math.abs(u.position.x - ownHQ.x) + Math.abs(u.position.y - ownHQ.y);
        score += (20 - distToHome) * 50;
        if (distToHome === 0 && u.isAirborne) {
          score += 700;
        }
        continue;
      }
      if (u.type === "BOMBER" && enemyHQ && !enemyHQFortified) {
        const dist =
          Math.abs(u.position.x - enemyHQ.x) +
          Math.abs(u.position.y - enemyHQ.y);
        score += (36 - dist) * 14;
      }
      if ((u.type === "FIGHTER" || enemyHQFortified) && enemyUnits.length > 0) {
        let minWeightedDist = Infinity;
        for (const e of enemyUnits) {
          const d =
            Math.abs(u.position.x - e.position.x) +
            Math.abs(u.position.y - e.position.y);
          const weighted = e.type === "BOMBER" ? d * 0.75 : d;
          if (weighted < minWeightedDist) minWeightedDist = weighted;
        }
        score += (36 - minWeightedDist) * 7;
      }
      if (!threatenedBotIds.has(u.id)) {
        const moves = MovementRules.getValidMoves(state, u);
        if (moves.some((m) => m.targetId)) {
          score += 220;
        }
      }
    }
    return score;
  }
}
