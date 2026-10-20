export const GEESE = [5, 9, 14, 18, 23, 27, 32, 36, 41, 45, 50, 54, 59];
export const SPECIAL: Record<number, { icon: string; name: string }> = Object.fromEntries([
  ...GEESE.map(n => [n, { icon: '🪿', name: 'Goose' }]),
  [6, { icon: '🌉', name: 'Bridge' }], [12, { icon: '🌉', name: 'Bridge landing' }],
  [19, { icon: '🏡', name: 'Inn' }], [31, { icon: '🪣', name: 'Well' }],
  [42, { icon: '🌀', name: 'Maze' }], [52, { icon: '🔒', name: 'Prison' }],
  [58, { icon: '💀', name: 'Death' }], [63, { icon: '🏁', name: 'Goose Garden' }],
] as [number, { icon: string; name: string }][]);
export type Player = { name: string; position: number; skip: number };
export type Game = { players: Player[]; turn: number; winner: number | null; roll: number | null; message: string; round: number };
export type Move = { game: Game; path: number[] };
export function newGame(): Game {
  return { players: [{ name: 'You', position: 0, skip: 0 }, { name: 'Lola', position: 0, skip: 0 }, { name: 'Bruno', position: 0, skip: 0 }], turn: 0, winner: null, roll: null, message: 'Your adventure starts here. Roll the die!', round: 1 };
}
export function takeTurn(state: Game, die: number): Move {
  if (!Number.isInteger(die) || die < 1 || die > 6) throw new Error('The die must be an integer from 1 to 6.');
  if (state.winner !== null) return { game: state, path: [] };
  const game: Game = structuredClone(state), index = game.turn, player = game.players[index];
  const next = () => { game.turn = (index + 1) % game.players.length; if (game.turn === 0) game.round++; };
  if (player.skip > 0) {
    player.skip--; game.roll = null;
    game.message = `${player.name} ${player.name === 'You' ? 'miss' : 'misses'} this turn. ${player.skip} ${player.skip === 1 ? 'turn' : 'turns'} left to wait.`;
    next(); return { game, path: [] };
  }
  game.roll = die;
  const path: number[] = []; let direction = 1;
  for (let step = 0; step < die; step++) { if (player.position === 63) direction = -1; player.position += direction; path.push(player.position); }
  let extra = false, effect = '';
  if (GEESE.includes(player.position)) { player.position = GEESE.find(n => n > player.position) ?? 63; extra = true; effect = 'Goose to goose! Jump ahead and roll again.'; }
  else if (player.position === 6) { player.position = 12; extra = true; effect = 'Cross the bridge to 12 and roll again.'; }
  else if (player.position === 19) { player.skip = 1; effect = 'A night at the inn: miss 1 turn.'; }
  else if (player.position === 31 || player.position === 52) { player.skip = 2; effect = player.position === 31 ? 'The well: miss 2 turns.' : 'The prison: miss 2 turns.'; }
  else if (player.position === 42) { player.position = 30; effect = 'The maze sends you back to 30.'; }
  else if (player.position === 58) { player.position = 0; effect = 'Back to the start! There is still time to catch up.'; }
  if (path.at(-1) !== player.position) path.push(player.position);
  game.message = `${player.name} ${player.name === 'You' ? 'roll' : 'rolls'} ${die} and ${player.name === 'You' ? 'reach' : 'reaches'} ${player.position === 0 ? 'the start' : `square ${player.position}`}.${effect ? ` ${effect}` : ''}`;
  if (player.position === 63) { game.winner = index; game.message = `${player.name === 'You' ? 'You win' : `${player.name} wins`}! Welcome to the Goose Garden.`; }
  else if (!extra) next();
  return { game, path };
}
export function randomDie(): number {
  const values = new Uint32Array(1); let value: number;
  do { crypto.getRandomValues(values); value = values[0]; } while (value >= 4294967292);
  return value % 6 + 1;
}
