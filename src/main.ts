/// <reference types="vite/client" />
import './style.css';
import {newGame,takeTurn,randomDie,SPECIAL,GEESE,type Game} from './game';
import {animateDice,animateStep,animateEvent,celebrateVictory} from './animation';
import {loadMatch,saveMatch,clearMatch} from './storage';
import {createAudio} from './audio';
import {createBoardAtmosphere,type ArrivalKind} from './technical-art';
import {createIdleScene} from './idle';
import {tileArt,startArt,finishArt,tileArtLabel} from './tile-art';
import {dieFaceSVG,setDieFace} from './die-art';
import {boardLayout} from './board-layout';

let game:Game=loadMatch()??newGame();
let busy=false,generation=0,inspectedTile=1,presentationMessage:string|null=null;
let timer:ReturnType<typeof setTimeout>|undefined;
const turnLog:string[]=[];
const art=(name:string)=>`${import.meta.env.BASE_URL}art/${name}.svg`;
const escapeHTML=(value:string)=>value.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));

document.querySelector<HTMLDivElement>('#app')!.innerHTML=`
<header class="topbar">
 <a class="brand" href="./" aria-label="OcaGo home"><img src="${art('mascot-goose')}" alt=""><span>oca<b>go</b><small>THE STORYBOOK RACE</small></span></a>
 <div class="header-actions"><button class="utility-button" id="sound" aria-pressed="false" aria-label="Enable sound">Sound off</button><button class="utility-button" id="journal">Turns</button><button class="icon-button" id="help" aria-label="How to play">?</button></div>
</header>
<main>
 <div class="title-row"><div><p class="eyebrow">A LITTLE LUCK. A GRAND ADVENTURE.</p><h1>The Goose Garden</h1></div><span class="local-label">You + 2 computer players</span></div>
 <section class="players-card" aria-label="All players"><div id="players"></div></section>
 <div class="game-layout">
  <section class="board-card" aria-label="Illustrated Game of the Goose board">
   <div class="board-top"><span id="round">ROUND 1</span><span class="route-hint">START BELOW · FOLLOW THE NUMBERS</span><button class="text-button" id="zoom" aria-pressed="false">Zoom in</button></div>
   <div class="board-viewport" id="board-viewport"><div class="board" id="board" aria-label="Game board. Arrow keys follow the numbered route. Home and End jump to the ends. Press Enter to inspect a square."></div></div>
   <div class="board-bottom"><span>Every square tells a story.</span><button class="text-button" id="legend">Explore squares</button></div>
  </section>
  <aside>
   <section class="turn-card" aria-label="Turn controls">
    <div class="turn-top"><span class="eyebrow" id="turn-label">YOUR TURN</span><span class="live-dot"></span></div>
    <h2 id="turn-title">Where will you land?</h2>
    <div class="dice-scene"><div class="dice" id="dice" aria-label="Die not rolled yet" data-face="5">${dieFaceSVG(5)}</div></div>
    <button class="roll" id="roll">Roll the die <span>→</span></button>
    <p class="status" id="status" role="status" aria-live="polite"></p>
   </section>
   <p class="save-note">Your match saves in this browser.</p>
   <button class="restart text-button" id="restart">Start a new game</button>
   <div class="how-to"><strong>Goose to goose, and roll again.</strong><p>Reach the garden on square 63 with an exact roll. Too far? Bounce back!</p></div>
  </aside>
 </div>
</main>
<footer>Original storybook art. A classic race, made for another round.</footer>
<dialog id="rules"><button class="close icon-button" id="close" aria-label="Close rules">×</button><p class="eyebrow">YOUR POCKET GUIDE</p><h2>How to play</h2><p>Race Lola and Bruno to the Goose Garden. Roll one six-sided die and reach <strong>63 with an exact roll</strong>. Extra steps bounce back from the finish.</p><dl><dt>Goose · hop and roll again</dt><dd>On ${GEESE.join(', ')}, hop to the next goose and take another turn. Goose 59 takes you to 63. Only one goose hop applies per roll.</dd><dt>Bridge · 6 → 12</dt><dd>Cross to 12 and roll again. Landing directly on 12 has no extra effect.</dd><dt>Inn · 19</dt><dd>Rest for one turn.</dd><dt>Well · 31 / Prison · 52</dt><dd>Rest for two turns. No rescue is needed.</dd><dt>Maze · 42</dt><dd>Return to square 30.</dd><dt>Death · 58</dt><dd>Return to START. The race is not over yet!</dd></dl><p class="rules-note">OcaGo rules: sharing a square has no effect; there is no opening-roll exception. Special effects apply after a bounce too. Other drawings are storybook scenery. The illustrated START area holds players at position 0; the first numbered square is 1.</p></dialog>
<dialog id="welcome" class="welcome"><div class="welcome-art">${startArt()}</div><p class="eyebrow">WELCOME TO OCAGO</p><h2>A story in every square.</h2><p>Start in the bottom-left meadow. Follow the numbered path with Lola and Bruno, and be first to the garden at the heart of the board.</p><div class="welcome-facts"><span>1 die</span><span>63 illustrated squares</span><span>3 adventurers</span></div><button class="roll" id="start">Let's play <span>→</span></button><small>No account. No purchases. Just a good race.</small></dialog>
<dialog id="victory" class="welcome"><div class="winner-art">${finishArt()}</div><p class="eyebrow">THE GARDEN IS REACHED</p><h2 id="winner-title"></h2><p id="winner-copy"></p><button class="roll" id="again">Play again <span>→</span></button><button class="text-button" id="view-board">View the board</button></dialog>
<dialog id="journal-dialog"><button class="close icon-button" id="close-journal" aria-label="Close turn history">×</button><p class="eyebrow">THE PATH SO FAR</p><h2>Recent turns</h2><p>Results from this session, newest first.</p><ol id="turn-log"></ol></dialog>
<dialog id="tile-detail"><button class="close icon-button" id="close-tile" aria-label="Close square">×</button><div class="tile-preview" id="tile-preview"></div><p class="eyebrow">A PAGE OF THE ADVENTURE</p><h2 id="tile-title"></h2><p id="tile-copy"></p><p id="tile-players"></p><div class="tile-navigation"><button class="utility-button" id="previous-tile" aria-label="Previous square">Previous</button><label>Square <input id="tile-picker" type="number" min="1" max="63" inputmode="numeric" value="1"></label><button class="utility-button" id="next-tile" aria-label="Next square">Next</button></div></dialog>
<dialog id="confirm"><p class="eyebrow">A FRESH PAGE</p><h2>Start a new game?</h2><p>This will replace your current saved match.</p><button class="roll" id="confirm-restart">Yes, start again →</button><button class="text-button" id="cancel-restart">Keep playing</button></dialog>`;

const $=<T extends HTMLElement=HTMLElement>(selector:string)=>document.querySelector<T>(selector)!;
const board=$('#board'),audio=createAudio(),atmosphere=createBoardAtmosphere(board);
let controller=new AbortController(),cleanupVictory=()=>{};
const layouts=boardLayout();
for(const tile of layouts){
 const n=tile.number,el=document.createElement('div');
 el.id=`cell-${n}`;el.className=`cell ${SPECIAL[n]?'special':''} ${GEESE.includes(n)?'goose':''} ${n===1?'start-cell':''} ${n===63?'finish':''}`;
 el.dataset.square=String(n);el.dataset.direction=tile.direction;el.dataset.orientation=tile.height>tile.width?'portrait':'landscape';el.dataset.compact=String(tile.height<60);
 // A white gutter separates the full-bleed picture cards, as on a printed board.
 const inset=3;el.style.left=`${(tile.x+inset)/10}%`;el.style.top=`${(tile.y+inset)/10}%`;el.style.width=`${(tile.width-inset*2)/10}%`;el.style.height=`${(tile.height-inset*2)/10}%`;
 el.setAttribute('role','button');el.setAttribute('aria-label',`Square ${n}: ${SPECIAL[n]?.name??tileArtLabel(n)}`);el.tabIndex=n===1?0:-1;
 el.innerHTML=`<div class="tile-illustration">${n===1?startArt():n===63?finishArt():tileArt(n,(tile.width-inset*2)/(tile.height-inset*2))}</div><span class="number">${n}</span>${n===1?'<div class="start-dock"><span>START</span><div id="start-tokens"></div><span class="start-arrow" aria-hidden="true">→</span></div>':''}${n===63?'<span class="finish-label">THE GOOSE GARDEN</span>':''}<div class="tokens"></div><span class="route-arrow" aria-hidden="true">${tile.direction==='right'?'›':tile.direction==='up'?'⌃':tile.direction==='left'?'‹':tile.direction==='down'?'⌄':''}</span>`;
 el.addEventListener('click',()=>inspect(n));
 el.addEventListener('keydown',event=>{
  if(event.key==='Enter'||event.key===' '){event.preventDefault();inspect(n);}
  else if(['ArrowRight','ArrowDown','ArrowLeft','ArrowUp','Home','End'].includes(event.key)){
   event.preventDefault();const target=event.key==='Home'?1:event.key==='End'?63:Math.max(1,Math.min(63,n+(['ArrowRight','ArrowDown'].includes(event.key)?1:-1)));
   board.querySelectorAll<HTMLElement>('.cell').forEach(cell=>cell.tabIndex=-1);const cell=$(`#cell-${target}`);cell.tabIndex=0;cell.focus({preventScroll:true});
  }
 });
 board.append(el);
}
const idle=createIdleScene(board);
function inspect(n:number){
 inspectedTile=n;$<HTMLInputElement>('#tile-picker').value=String(n);$<HTMLButtonElement>('#previous-tile').disabled=n===1;$<HTMLButtonElement>('#next-tile').disabled=n===63;
 $('#tile-preview').innerHTML=n===1?startArt():n===63?finishArt():tileArt(n);
 $('#tile-title').textContent=`${n} · ${SPECIAL[n]?.name??tileArtLabel(n)}`;
 const rules:Record<number,string>={6:'Cross to square 12 and roll again.',12:'The far side of the bridge. Landing here does not trigger another jump.',19:'Rest for one turn at the inn.',31:'Rest for two turns in the well.',42:'The maze sends you back to square 30.',52:'Rest for two turns in prison.',58:'Return to START. There is still time to catch up!',63:'The garden: reach this square with an exact roll to win.'};
 $('#tile-copy').textContent=GEESE.includes(n)?`Goose to goose: hop to ${GEESE.find(p=>p>n)??63} and roll again.`:rules[n]??(n===1?'Your story begins here. Players at position 0 wait in the START meadow before their first roll.':'A picture along the path. This square has no special effect; follow the numbers toward the garden.');
 $('#tile-players').textContent=game.players.filter(player=>player.position===n||(n===1&&player.position===0)).map(player=>`${player.name}${player.position===0?' (at START)':''}`).join(' · ')||'No adventurers are here yet.';
 if(!$<HTMLDialogElement>('#tile-detail').open)$<HTMLDialogElement>('#tile-detail').showModal();
}
function render(){
 const status=presentationMessage??game.message;if($('#status').textContent!==status)$('#status').textContent=status;
 $('#round').textContent=`ROUND ${game.round}`;
 $('#turn-label').textContent=game.winner!==null?'THE FINISH IS REACHED':game.turn===0?'YOUR TURN':`${game.players[game.turn].name.toUpperCase()}'S TURN`;
 $('#turn-title').textContent=game.winner!==null?(game.winner===0?'Your garden moment!':'What a race!'):game.turn===0?'Where will you land?':'The story continues.';
 const roll=$<HTMLButtonElement>('#roll');roll.disabled=busy||game.turn!==0||game.winner!==null;roll.innerHTML=game.winner!==null?'Game finished ✓':busy?'On the move…':game.turn!==0?'Computer player moving…':game.players[0].skip?'Rest this turn →':'Roll the die <span>→</span>';
 if(!busy){setDieFace($('#dice'),game.roll??5);$('#dice').setAttribute('aria-label',game.roll?`Die: ${game.roll}`:'Die not rolled yet');}
 $('#players').innerHTML=game.players.map((player,index)=>`<div class="player ${game.turn===index&&game.winner===null?'active':''}" data-player="${index}" aria-label="${escapeHTML(player.name)}, position ${player.position}${game.turn===index&&game.winner===null?', current turn':''}"><span class="avatar p${index}"><img src="${art(index===0?'mascot-goose':index===1?'atmosphere-lola':'atmosphere-bruno')}" alt=""></span><div class="player-info"><strong>${escapeHTML(player.name)}</strong><small>${player.skip?`Rest ${player.skip}`:game.turn===index&&game.winner===null?'Current turn':index===0?'Your goose':'Computer'}</small></div><b>${player.position}<small>/63</small></b></div>`).join('');
 $('#start-tokens').innerHTML=game.players.map((player,index)=>player.position===0?`<span class="token p${index} ${game.turn===index?'current-token':''}" title="${escapeHTML(player.name)} at START">${index===0?'Y':escapeHTML(player.name[0])}</span>`:'').join('');
 board.querySelectorAll<HTMLElement>('.cell').forEach(cell=>cell.dataset.occupants='0');
 board.querySelectorAll('.tokens').forEach(element=>element.replaceChildren());board.querySelectorAll('.occupied').forEach(element=>element.classList.remove('occupied'));
 game.players.forEach((player,index)=>{
  if(player.position>0){const token=document.createElement('span');token.className=`token p${index} ${game.turn===index?'current-token':''}`;token.textContent=index===0?'Y':player.name[0];token.title=`${player.name}: square ${player.position}`;const cell=$(`#cell-${player.position}`);cell.classList.add('occupied');cell.dataset.occupants=String(Number(cell.dataset.occupants)+1);$(`#cell-${player.position} .tokens`).append(token);}
 });
}
function updateAtmosphere(){atmosphere.focus(game.players[game.turn].position,game.turn);}
async function play(){
 if(busy||game.winner!==null||document.querySelector('dialog[open]'))return;
 const run=++generation,actor=game.turn,player=game.players[actor],resting=player.skip>0;busy=true;
 presentationMessage=resting?`${player.name} rests this turn.`:`${player.name} rolls the die…`;render();
 const die=resting?1:randomDie();if(!resting){audio.play('roll');await animateDice($('#dice'),die,controller.signal);if(run!==generation)return;}
 const move=takeTurn(game,die);const saved=saveMatch(move.game);$('.save-note').textContent=saved?'Your match saves in this browser.':'Saving unavailable · keep this tab open.';
 presentationMessage=resting?move.game.message:`${player.name} rolled ${die}. Follow their token along the path.`;
 for(const step of move.path){game.players[actor].position=step;render();atmosphere.focus(step,actor);audio.play('step');await animateStep(step>0?$(`#cell-${step}`):undefined,controller.signal);if(run!==generation)return;}
 const landing=resting?undefined:move.path[Math.min(die-1,move.path.length-1)];presentationMessage=move.game.message;render();
 if(resting)audio.play('rest');
 else if(landing&&SPECIAL[landing]){
  const kind:ArrivalKind=move.game.winner!==null?'finish':GEESE.includes(landing)?'goose':landing===6?'bridge':[19,31,52].includes(landing)?'rest':[42,58].includes(landing)?'setback':'finish';
  if(landing!==12){if(kind!=='finish')audio.play(kind);await Promise.all([atmosphere.arrive(landing,kind,controller.signal),kind==='finish'?Promise.resolve():animateEvent($(`#cell-${landing}`),kind,controller.signal)]);if(run!==generation)return;}
 }
 game=move.game;busy=false;presentationMessage=null;saveMatch(game);turnLog.unshift(game.message);turnLog.splice(12);render();updateAtmosphere();
 if(game.winner!==null){audio.play('victory');cleanupVictory=celebrateVictory(board);showVictory();}else schedule();
}
function showVictory(){
 if(game.winner===null||document.querySelector('dialog[open]'))return;
 $('#winner-title').textContent=game.winner===0?'The garden is yours!':`${game.players[game.winner].name} reaches the garden!`;
 $('#winner-copy').textContent=`${game.round} rounds of twists, little setbacks and lucky geese. Ready for another story?`;$<HTMLDialogElement>('#victory').showModal();
}
function schedule(){clearTimeout(timer);if(!busy&&game.turn!==0&&game.winner===null&&!document.querySelector('dialog[open]'))timer=setTimeout(()=>void play(),1200);}
function restart(){generation++;clearTimeout(timer);controller.abort();controller=new AbortController();cleanupVictory();audio.stop();atmosphere.reset();presentationMessage=null;turnLog.length=0;clearMatch();game=newGame();busy=false;saveMatch(game);render();updateAtmosphere();}
$('#roll').addEventListener('click',()=>void play());
$('#restart').addEventListener('click',()=>$<HTMLDialogElement>('#confirm').showModal());
$('#confirm-restart').addEventListener('click',()=>{$<HTMLDialogElement>('#confirm').close();restart();});
$('#cancel-restart').addEventListener('click',()=>$<HTMLDialogElement>('#confirm').close());
$('#again').addEventListener('click',()=>{$<HTMLDialogElement>('#victory').close();restart();});
$('#view-board').addEventListener('click',()=>$<HTMLDialogElement>('#victory').close());
const rules=$<HTMLDialogElement>('#rules');$('#help').addEventListener('click',()=>rules.showModal());$('#close').addEventListener('click',()=>rules.close());
rules.addEventListener('click',event=>{if(event.target===rules)rules.close();});
$('#legend').addEventListener('click',()=>inspect(game.players[game.turn].position||1));$('#close-tile').addEventListener('click',()=>$<HTMLDialogElement>('#tile-detail').close());
$('#previous-tile').addEventListener('click',()=>inspect(Math.max(1,inspectedTile-1)));$('#next-tile').addEventListener('click',()=>inspect(Math.min(63,inspectedTile+1)));
$('#tile-picker').addEventListener('change',()=>{const n=Number($<HTMLInputElement>('#tile-picker').value);if(Number.isInteger(n)&&n>=1&&n<=63)inspect(n);else $<HTMLInputElement>('#tile-picker').value=String(inspectedTile);});
$('#start').addEventListener('click',()=>{$<HTMLDialogElement>('#welcome').close();try{localStorage.setItem('ocago:welcomed','1');}catch{}schedule();});
function updateSound(){const button=$<HTMLButtonElement>('#sound');button.textContent=audio.enabled?'Sound on':'Sound off';button.setAttribute('aria-pressed',String(audio.enabled));button.setAttribute('aria-label',audio.enabled?'Disable sound':'Enable sound');}
$('#sound').addEventListener('click',async()=>{await audio.setEnabled(!audio.enabled);updateSound();if(audio.enabled)audio.play('click');});
$('#journal').addEventListener('click',()=>{const list=$('#turn-log');list.replaceChildren();for(const message of turnLog.length?turnLog:['Your turn results will appear here after the first roll.']){const item=document.createElement('li');item.textContent=message;list.append(item);}$<HTMLDialogElement>('#journal-dialog').showModal();});
$('#close-journal').addEventListener('click',()=>$<HTMLDialogElement>('#journal-dialog').close());
$('#zoom').addEventListener('click',()=>{const viewport=$('#board-viewport'),zoomed=viewport.classList.toggle('zoomed');$('#zoom').textContent=zoomed?'Zoom out':'Zoom in';$('#zoom').setAttribute('aria-pressed',String(zoomed));});
for(const modal of Array.from(document.querySelectorAll<HTMLDialogElement>('dialog'))){modal.addEventListener('toggle',()=>{if(modal.open)clearTimeout(timer);else schedule();});modal.addEventListener('close',()=>{if(game.winner!==null&&modal.id!=='victory')showVictory();else schedule();});}
document.addEventListener('pointerdown',()=>void audio.unlock(),{passive:true});document.addEventListener('keydown',()=>void audio.unlock());document.addEventListener('visibilitychange',()=>{if(document.hidden)audio.stop();});
window.addEventListener('pagehide',()=>{idle.destroy();audio.stop();controller.abort();atmosphere.reset();});
render();updateSound();updateAtmosphere();
let welcomed=false;try{welcomed=localStorage.getItem('ocago:welcomed')==='1';}catch{}if(!welcomed)$<HTMLDialogElement>('#welcome').showModal();else schedule();
