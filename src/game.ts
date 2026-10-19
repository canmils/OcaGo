export const GEESE = [5,9,14,18,23,27,32,36,41,45,50,54,59];
export const SPECIAL: Record<number,{icon:string;name:string}> = Object.fromEntries([
 ...GEESE.map(n=>[n,{icon:'🪿',name:'Oca'}]),
 [6,{icon:'🌉',name:'Puente'}],[12,{icon:'🌉',name:'Puente de llegada'}],[19,{icon:'🏡',name:'Posada'}],
 [31,{icon:'🪣',name:'Pozo'}],[42,{icon:'🌀',name:'Laberinto'}],[52,{icon:'🔒',name:'Cárcel'}],[58,{icon:'💀',name:'Muerte'}],[63,{icon:'🏁',name:'Jardín de las ocas'}]
] as [number,{icon:string;name:string}][]);
export type Player = {name:string;position:number;skip:number};
export type Game = {players:Player[];turn:number;winner:number|null;roll:number|null;message:string;round:number};
export type Move = {game:Game;path:number[]};
export function newGame():Game {return {players:[{name:'Tú',position:0,skip:0},{name:'Lola',position:0,skip:0},{name:'Bruno',position:0,skip:0}],turn:0,winner:null,roll:null,message:'Tu aventura empieza aquí. ¡Lanza el dado!',round:1};}
export function takeTurn(state:Game, die:number):Move {
 if (!Number.isInteger(die)||die<1||die>6) throw new Error('El dado debe estar entre 1 y 6');
 if(state.winner!==null) return {game:state,path:[]};
 const game:Game=structuredClone(state), index=game.turn, p=game.players[index];
 const next=()=>{game.turn=(index+1)%game.players.length;if(game.turn===0)game.round++;};
 if(p.skip>0){p.skip--;game.roll=null;game.message=`${p.name} descansa este turno. Quedan ${p.skip} turnos de espera.`;next();return {game,path:[]};}
 game.roll=die;
 const path:number[]=[];let direction=1;
 for(let i=0;i<die;i++){if(p.position===63) direction=-1;p.position+=direction;path.push(p.position);}
 let extra=false;let effect='';
 if(GEESE.includes(p.position)){p.position=GEESE.find(n=>n>p.position)??63;extra=true;effect='¡De oca a oca y tiro porque me toca!';}
 else if(p.position===6){p.position=12;extra=true;effect='¡Cruzas el puente y vuelves a tirar!';}
 else if(p.position===19){p.skip=1;effect='Una noche en la posada: descansas 1 turno.';}
 else if(p.position===31||p.position===52){p.skip=2;effect=p.position===31?'Caes en el pozo: esperas 2 turnos.':'La cárcel te retiene 2 turnos.';}
 else if(p.position===42){p.position=30;effect='El laberinto te devuelve a la casilla 30.';}
 else if(p.position===58){p.position=0;effect='¡Vuelta al inicio! Una nueva oportunidad.';}
 if(path.at(-1)!==p.position)path.push(p.position);
 game.message=`${p.name} saca ${die} y llega a ${p.position===0?'la salida':`la casilla ${p.position}`}. ${effect}`;
 if(p.position===63){game.winner=index;game.message=`¡${p.name==='Tú'?'Has ganado':`${p.name} ha ganado`}! El jardín de las ocas te espera.`;}
 else if(!extra)next();
 return {game,path};
}
export function randomDie():number {const n=new Uint32Array(1);let value:number;do{crypto.getRandomValues(n);value=n[0];}while(value>=4294967292);return value%6+1;}
