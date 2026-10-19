import test from 'node:test';
import assert from 'node:assert/strict';
import { newGame, takeTurn, GEESE } from '../src/game';

test('every starting square and die obeys the documented single-effect rules', () => {
  for (let position = 0; position < 63; position++) {
    for (let die = 1; die <= 6; die++) {
      const original = newGame();
      original.players[0].position = position;
      const snapshot = structuredClone(original);
      const result = takeTurn(original, die);
      const raw = position + die;
      const landing = raw <= 63 ? raw : 126 - raw;
      let expected = landing;
      let repeats = false;
      if (GEESE.includes(landing)) {
        expected = GEESE[GEESE.indexOf(landing) + 1] ?? 63;
        repeats = true;
      } else if (landing === 6) {
        expected = 12;
        repeats = true;
      } else if (landing === 42) expected = 30;
      else if (landing === 58) expected = 0;
      assert.equal(result.game.players[0].position, expected, `${position} + ${die}`);
      assert.equal(result.game.players[0].skip, landing === 19 ? 1 : [31, 52].includes(landing) ? 2 : 0);
      assert.equal(result.game.winner, expected === 63 ? 0 : null);
      assert.equal(result.game.turn, repeats || expected === 63 ? 0 : 1);
      assert.equal(result.path.at(-1), expected);
      assert.deepEqual(original, snapshot, 'engine must preserve caller state');
      assert.deepEqual(result.game.players.slice(1), original.players.slice(1));
    }
  }
});

test('bot victory keeps the actual winner and terminal state', () => {
  for (const index of [1, 2]) {
    const state = newGame();
    state.turn = index;
    state.players[index].position = 62;
    const { game } = takeTurn(state, 1);
    assert.equal(game.winner, index);
    assert.equal(game.turn, index);
    assert.deepEqual(takeTurn(game, 6).path, []);
    assert.equal(takeTurn(game, 6).game, game);
  }
});

test('all players can wait without deadlock and only completed cycles advance rounds', () => {
  let state = newGame();
  state.players.forEach(player => { player.position = 31; player.skip = 2; });
  for (let turn = 0; turn < 6; turn++) {
    const { game, path } = takeTurn(state, 6);
    assert.equal(game.turn, (turn + 1) % 3);
    assert.equal(game.round, 1 + Math.floor((turn + 1) / 3));
    assert.equal(game.roll, null);
    assert.deepEqual(path, []);
    state = game;
  }
  assert(state.players.every(player => player.skip === 0));
  assert.equal(takeTurn(state, 2).game.players[0].position, 33);
});

test('shared squares never capture or release another player', () => {
  const state = newGame();
  state.players[0].position = 29;
  state.players[1].position = 31;
  state.players[1].skip = 2;
  const { game } = takeTurn(state, 2);
  assert.equal(game.players[0].position, 31);
  assert.equal(game.players[0].skip, 2);
  assert.deepEqual(game.players[1], state.players[1]);
});
