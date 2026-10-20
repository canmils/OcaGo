import test from 'node:test';
import assert from 'node:assert/strict';
import { boardLayout, BOARD_SIZE } from '../src/board-layout';
test('illustrated route has 63 ordered, bounded nonoverlapping cells',()=>{
 const tiles=boardLayout();assert.equal(tiles.length,63);
 for(const [index,tile] of tiles.entries()){
  assert.equal(tile.number,index+1);assert(tile.x>=0&&tile.y>=0&&tile.x+tile.width<=BOARD_SIZE+.001&&tile.y+tile.height<=BOARD_SIZE+.001);
  for(const other of tiles.slice(index+1)){
   const overlapX=Math.min(tile.x+tile.width,other.x+other.width)-Math.max(tile.x,other.x);
   const overlapY=Math.min(tile.y+tile.height,other.y+other.height)-Math.max(tile.y,other.y);
   assert(overlapX<.001||overlapY<.001,`${tile.number} overlaps ${other.number}`);
  }
 }
});
test('large start is bottom left, travel begins right, and finish is central',()=>{
 const tiles=boardLayout(),start=tiles[0],finish=tiles[62];
 assert(start.y>800&&start.x<30);assert(start.width>tiles[1].width*3);
 assert.equal(start.direction,'right');assert(tiles[1].x>start.x);
 assert.equal(tiles[8].direction,'up');assert.equal(tiles[17].direction,'left');assert.equal(tiles[26].direction,'down');
 assert(finish.x>300&&finish.x+finish.width<700&&finish.y>300&&finish.y+finish.height<700);
});
