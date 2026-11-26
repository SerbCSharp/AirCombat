import { Directions } from "./Directions.js";

export class CombatRules {
  static canAircraftDestroy(attacker, defender, attackDir) {
    if (!attacker || !defender) return false;
    if (attacker.team === defender.team) return false;

    // Пункт 9: Не взлетевшие самолёты на аэродроме сбиваются с любого направления
    if (!defender.isAirborne) {
      return true;
    }

    const aspect = Directions.getAttackAspect(attackDir, defender.direction);

    // Пункт 3: Каждый самолёт бьёт противника в БОК и в ХВОСТ
    if (aspect === "SIDE" || aspect === "REAR") {
      return true;
    }

    // Пункты 3 и 4: В ЛОБ бьёт только бомбардировщик истребителя
    return attacker.type === "BOMBER" && defender.type === "FIGHTER";
  }
}
