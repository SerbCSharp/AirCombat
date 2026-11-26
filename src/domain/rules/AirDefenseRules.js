import { Directions } from "./Directions.js";

export class AirDefenseRules {
  // Пункт 6: Сбивает ли наземное ПВО пролетающий над ним самолёт
  static isShotDownByAA(aircraft, moveDir, structure) {
    if (!structure || structure.team === aircraft.team) return false;

    if (structure.type === "SAM") {
      // Ракетная зенитная установка бьёт с любой стороны
      return true;
    }

    if (structure.type === "AA_GUN") {
      // Зенитная точка бьёт спереди и сбоку, но не с тыла (REAR)
      const aspect = Directions.getAttackAspect(moveDir, structure.direction);
      return aspect !== "REAR";
    }

    return false;
  }

  // Пункт 7: Разбомбил ли самолёт вражеский штаб при пролёте над ним
  static isHQDestroyed(aircraft, structure) {
    if (!structure || structure.team === aircraft.team) return false;
    return aircraft.type === "BOMBER" && structure.type === "HQ";
  }
}
