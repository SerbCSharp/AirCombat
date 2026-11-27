import { Aircraft } from "../domain/entities/Aircraft.js";
import { GameState } from "../domain/entities/GameState.js";

const STORAGE_KEY = "air_combat_save_v1";

export class GameStorage {
  static save(gameState, vsBot = true) {
    try {
      const payload = {
        vsBot,
        currentTurn: gameState.currentTurn,
        movedTypes: [...gameState.movedTypes],
        winner: gameState.winner,
        winReason: gameState.winReason,
        aircrafts: gameState.aircrafts.map((u) => ({
          id: u.id,
          type: u.type,
          team: u.team,
          x: u.position.x,
          y: u.position.y,
          direction: { ...u.direction },
          isAirborne: u.isAirborne,
        })),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Игнорируем ошибки квоты или приватного режима браузера
    }
  }

  static load(board) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;

      const data = JSON.parse(raw);
      if (!Array.isArray(data.aircrafts) || !data.currentTurn) return null;

      const aircrafts = data.aircrafts.map((u) => {
        const aircraft = new Aircraft({
          id: u.id,
          type: u.type,
          team: u.team,
          x: u.x,
          y: u.y,
          direction: { ...u.direction },
        });
        aircraft.isAirborne = Boolean(u.isAirborne);
        return aircraft;
      });

      const gameState = new GameState({
        board,
        aircrafts,
        currentTurn: data.currentTurn,
      });
      gameState.movedTypes = new Set(data.movedTypes || []);
      gameState.winner = data.winner || null;
      gameState.winReason = data.winReason || null;

      return {
        gameState,
        vsBot: data.vsBot !== undefined ? Boolean(data.vsBot) : true,
      };
    } catch {
      return null;
    }
  }

  static clear() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Игнорируем
    }
  }
}
