/** Reference-inspired picturebook route; all geometry is in a 1000-unit square. */
export type BoardTile = { number: number; x: number; y: number; width: number; height: number; direction: 'right'|'up'|'left'|'down'|'finish' };
export const BOARD_SIZE = 1000;
export function boardLayout(): BoardTile[] {
 const tiles: BoardTile[] = [];
 const add=(number:number,x:number,y:number,width:number,height:number,direction:BoardTile['direction'])=>tiles.push({number,x,y,width,height,direction});
 add(1,20,820,300,160,'right');
 for(let n=2;n<=9;n++)add(n,320+(n-2)*82.5,820,82.5,160,n===9?'up':'right');
 for(let n=10;n<=18;n++)add(n,850,820-(n-9)*640/9,130,640/9,n===18?'left':'up');
 for(let n=19;n<=27;n++){const x=20+(27-n)*830/9;add(n,x,20,n===19?980-x:830/9,160,n===27?'down':'left');}
 for(let n=28;n<=36;n++)add(n,20,180+(n-28)*640/9,130,640/9,n===36?'right':'down');
 for(let n=37;n<=44;n++)add(n,160+(n-37)*85,660,85,150,n===44?'up':'right');
 for(let n=45;n<=50;n++)add(n,695,660-(n-44)*470/6,145,470/6,n===50?'left':'up');
 for(let n=51;n<=56;n++)add(n,160+(56-n)*535/6,190,535/6,140,n===56?'down':'left');
 for(let n=57;n<=62;n++)add(n,160,330+(n-57)*55,145,55,n===62?'right':'down');
 add(63,320,345,365,300,'finish');
 return tiles;
}
