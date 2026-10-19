import test from 'node:test';
import assert from 'node:assert/strict';
import {newGame,takeTurn,GEESE} from '../src/game';
function at(position:number,die:number){const s=newGame();s.players[0].position=position;return takeTurn(s,die).game;}
test('ordinary movement advances turn and preserves input',()=>{const s=newGame();const {game,path}=takeTurn(s,3);assert.deepEqual(path,[1,2,3]);assert.equal(game.players[0].position,3);assert.equal(game.turn,1);assert.equal(s.players[0].position,0);});
test('every goose moves once to next goose, grants extra turn, and last wins',()=>{GEESE.forEach((n,i)=>{const s=at(n-1,1);assert.equal(s.players[0].position,GEESE[i+1]??63);assert.equal(s.turn,0);assert.equal(s.winner,n===59?0:null);});});
test('bridge only acts on six',()=>{assert.equal(at(0,6).players[0].position,12);assert.equal(at(0,6).turn,0);assert.equal(at(11,1).turn,1);});
test('inn, well and prison set finite skipped turns',()=>{for(const [position,skip] of [[19,1],[31,2],[52,2]]){let s=at(position-1,1);assert.equal(s.players[0].skip,skip);for(let i=skip;i>0;i--){s.turn=0;s=takeTurn(s,6).game;assert.equal(s.players[0].skip,i-1);assert.equal(s.players[0].position,position);assert.equal(s.roll,null);}s.turn=0;s=takeTurn(s,1).game;assert.notEqual(s.players[0].position,position);}});
test('maze and death transport without a chained effect',()=>{assert.equal(at(41,1).players[0].position,30);assert.equal(at(57,1).players[0].position,0);});
test('exact finish and overshoot reflect, including reflected goose',()=>{assert.equal(at(60,3).winner,0);assert.equal(at(62,3).players[0].position,61);assert.equal(at(62,5).winner,0);});
test('finished games cannot move and invalid dice are rejected',()=>{const s=at(62,1);assert.equal(takeTurn(s,1).game,s);for(const d of [0,7,1.5,NaN])assert.throws(()=>takeTurn(newGame(),d));});
test('three automatic players complete seeded simulation with valid positions',()=>{let seed=17,s=newGame();for(let i=0;i<10000&&s.winner===null;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;s=takeTurn(s,seed%6+1).game;assert(s.players.every(p=>p.position>=0&&p.position<=63&&p.skip>=0));}assert.notEqual(s.winner,null);});
