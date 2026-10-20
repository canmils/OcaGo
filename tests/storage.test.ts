import test from 'node:test';
import assert from 'node:assert/strict';
import { newGame, takeTurn } from '../src/game';
import { MATCH_STORAGE_KEY, clearMatch, isValidGame, loadMatch, saveMatch, type StorageLike } from '../src/storage';
function memory(): StorageLike {
  const items = new Map<string, string>();
  return { getItem: key => items.get(key) ?? null, setItem: (key, value) => { items.set(key, value); }, removeItem: key => { items.delete(key); } };
}
test('versioned match round trip resumes a completed bot turn without sharing objects', () => {
  const storage = memory();
  let game = takeTurn(newGame(), 3).game;
  game = takeTurn(game, 4).game;
  assert.equal(saveMatch(game, storage), true);
  const loaded = loadMatch(storage);
  assert.deepEqual(loaded, game);
  loaded!.players[0].position = 20;
  assert.equal(loadMatch(storage)!.players[0].position, 3);
  assert.equal(clearMatch(storage), true);
  assert.equal(loadMatch(storage), null);
});
test('malformed, old, oversized and structurally unsafe saves recover to an empty slot', () => {
  const storage = memory();
  const corrupt = ['{', JSON.stringify({version: 9, game: newGame()}), 'x'.repeat(20_000)];
  for (const mutate of [
    (game: any) => { game.players[0].position = 100; },
    (game: any) => { game.turn = 9; },
    (game: any) => { game.players = []; },
    (game: any) => { game.winner = 0; },
    (game: any) => { game.roll = 0; },
    (game: any) => { game.round = -1; },
    (game: any) => { game.players[1].position = 63; },
    (game: any) => { game.players[0].skip = 50; },
  ]) { const game = newGame(); mutate(game); corrupt.push(JSON.stringify({version: 1, game})); }
  for (const raw of corrupt) {
    storage.setItem(MATCH_STORAGE_KEY, raw);
    assert.equal(loadMatch(storage), null);
    assert.equal(storage.getItem(MATCH_STORAGE_KEY), null);
  }
});
test('denied reads, denied writes, quota exhaustion and unavailable browser storage never throw', () => {
  const denied: StorageLike = { getItem() { throw Error('denied'); }, setItem() { throw Error('quota'); }, removeItem() { throw Error('denied'); } };
  assert.equal(loadMatch(denied), null);
  assert.equal(saveMatch(newGame(), denied), false);
  assert.equal(clearMatch(denied), false);
  assert.doesNotThrow(() => loadMatch());
});
test('victory survives reload and invalid writes preserve the last valid match', () => {
  const storage = memory(), game = newGame();
  game.players[0].position = 62;
  const won = takeTurn(game, 1).game;
  assert.equal(isValidGame(won), true);
  assert.equal(saveMatch(won, storage), true);
  const invalid = newGame(); invalid.turn = -1;
  assert.equal(saveMatch(invalid, storage), false);
  assert.deepEqual(loadMatch(storage), won);
});

test('legacy Spanish saves migrate to English without losing position, turn or penalties', () => {
  const storage = memory(), game = newGame();
  game.players[0].name = 'Tú'; game.players[0].position = 19; game.players[0].skip = 1;
  game.players[1].position = 36; game.turn = 1; game.round = 4;
  game.message = 'Tu aventura empieza aquí.';
  storage.setItem(MATCH_STORAGE_KEY, JSON.stringify({ version: 1, game }));
  const migrated = loadMatch(storage)!;
  assert.equal(migrated.players[0].name, 'You');
  assert.equal(migrated.players[0].position, 19); assert.equal(migrated.players[0].skip, 1);
  assert.equal(migrated.turn, 1); assert.equal(migrated.round, 4);
  assert.equal(migrated.message, "Match resumed. Lola's turn.");
  assert.equal(JSON.parse(storage.getItem(MATCH_STORAGE_KEY)!).version, 2);
  assert.deepEqual(loadMatch(storage), migrated);
});
