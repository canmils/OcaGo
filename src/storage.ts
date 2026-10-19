import type { Game } from './game';

/** Minimal adapter permits deterministic tests and storage-free browser contexts. */
export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}
export const MATCH_STORAGE_KEY = 'ocago.match';
const VERSION = 1;
const MAX_BYTES = 16_384;
function browserStorage(): StorageLike | undefined {
  try { return globalThis.localStorage; } catch { return undefined; }
}
function integer(value: unknown, min: number, max: number): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= min && value <= max;
}
function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
/** Accept only states the current three-player engine can safely resume. */
export function isValidGame(value: unknown): value is Game {
  if (!record(value) || !Array.isArray(value.players) || value.players.length !== 3) return false;
  if (!value.players.every(player => record(player)
    && typeof player.name === 'string' && player.name.trim().length > 0 && player.name.length <= 40
    && integer(player.position, 0, 63) && integer(player.skip, 0, 2))) return false;
  if (!integer(value.turn, 0, 2) || !integer(value.round, 1, Number.MAX_SAFE_INTEGER)) return false;
  if (value.roll !== null && !integer(value.roll, 1, 6)) return false;
  if (typeof value.message !== 'string' || value.message.length > 2_000) return false;
  if (value.winner !== null && !integer(value.winner, 0, 2)) return false;
  const finishers = value.players.filter(player => player.position === 63);
  if (value.winner === null) return finishers.length === 0;
  return finishers.length === 1 && value.players[value.winner].position === 63 && value.turn === value.winner;
}
function cleanGame(game: Game): Game {
  return {
    players: game.players.map(({ name, position, skip }) => ({ name, position, skip })),
    turn: game.turn, winner: game.winner, roll: game.roll, message: game.message, round: game.round,
  };
}
export function clearMatch(storage: StorageLike | undefined = browserStorage()): boolean {
  try { if (!storage) return false; storage.removeItem(MATCH_STORAGE_KEY); return true; }
  catch { return false; }
}
/** Corrupt/obsolete data is discarded; storage restrictions never prevent play. */
export function loadMatch(storage: StorageLike | undefined = browserStorage()): Game | null {
  if (!storage) return null;
  try {
    const raw = storage.getItem(MATCH_STORAGE_KEY);
    if (raw === null) return null;
    if (raw.length > MAX_BYTES) { clearMatch(storage); return null; }
    const snapshot: unknown = JSON.parse(raw);
    if (!record(snapshot) || snapshot.version !== VERSION || !isValidGame(snapshot.game)) {
      clearMatch(storage); return null;
    }
    return cleanGame(snapshot.game);
  } catch { clearMatch(storage); return null; }
}
export function saveMatch(game: Game, storage: StorageLike | undefined = browserStorage()): boolean {
  if (!storage || !isValidGame(game)) return false;
  try {
    const raw = JSON.stringify({ version: VERSION, game: cleanGame(game) });
    if (raw.length > MAX_BYTES) return false;
    storage.setItem(MATCH_STORAGE_KEY, raw);
    return true;
  } catch { return false; }
}
