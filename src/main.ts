/// <reference types="vite/client" />
import './style.css';
import {newGame,takeTurn,randomDie,SPECIAL,GEESE,type Game} from './game';
import {animateDice,animateStep,animateEvent,celebrateVictory} from './animation';
import {loadMatch,saveMatch,clearMatch} from './storage';
import {createAudio} from './audio';
import {createBoardAtmosphere,type ArrivalKind} from './technical-art';
let presentationMessage:string|null=null;
const turnLog:string[]=[];
let inspectedTile=1;
let game:Game=loadMatch()??newGame(),busy=false,timer:ReturnType<typeof setTimeout>|undefined,generation=0;
const goose=`<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M22 80C5 65 19 43 48 57L52 25C53 8 76 8 78 24L77 42C75 56 66 64 62 76C52 90 34 89 22 80Z" fill="#fff8e5"/><path d="m76 26 19 9-19 6" fill="#ffb73f"/><circle cx="69" cy="25" r="3" fill="#193f39"/><path d="M24 62q15 18 29 1" fill="none" stroke="#d5cdb2" stroke-width="4" stroke-linecap="round"/></svg>`;
document.querySelector<HTMLDivElement>('#app')!.innerHTML=`
<header class="topbar"><a class="brand" href="./" aria-label="OcaGo, inicio">${goose}<span>oca<b>go</b><small>LA GRAN AVENTURA</small></span></a><div class="header-actions"><span class="offline"><i></i> Partida local · sin compras</span><button class="utility-button" id="sound" aria-pressed="false" aria-label="Activar sonido">Sonido: no</button><button class="utility-button" id="journal">Turnos</button><button class="icon-button" id="help" aria-label="Cómo jugar">?</button></div></header>
<main><section class="intro"><div><p class="eyebrow">DESTINO 01 · EL JARDÍN SECRETO</p><h1>La suerte tiene alas.</h1><p>Un camino de sorpresas. Una carrera para recordar.</p></div><div class="chapter"><span>✦</span><div>EDICIÓN JARDÍN<small>El clásico de siempre, otra aventura.</small></div></div></section>
<div class="game-layout"><section class="board-card" aria-label="Tablero de La Oca"><div class="board-top"><span><i></i> EXPEDICIÓN EN MARCHA</span><span id="round">RONDA 1</span></div><div class="board" id="board"><div class="garden"><span class="garden-spark">✦</span><div class="garden-art">${goose}</div><span class="garden-tag">EL GRAN DESTINO</span><h2>Jardín de<br>las ocas</h2><p>63 casillas. Infinitas historias.</p><span class="garden-goal">LLEGA CON UNA TIRADA EXACTA</span></div></div><div class="start-dock"><span>SALIDA</span><div id="start-tokens"></div><small>→ Sigue los números hasta el jardín</small></div><div class="board-bottom"><span><b>🪿</b> De oca a oca, ¡vuelve a tirar!</span><button id="legend" class="text-button">Explorar casillas</button></div></section>
<aside><section class="players-card"><div class="section-heading"><h2>Tu expedición</h2><span>3 VIAJEROS</span></div><div id="players"></div><p class="save-note"><i></i> Tu aventura se guarda en este navegador</p></section><section class="turn-card"><div class="turn-top"><span class="eyebrow" id="turn-label">TU TURNO</span><span class="live-dot"></span></div><h2 id="turn-title">Tu próxima aventura.</h2><div class="dice-scene"><span class="dice-spark">✧</span><div class="dice" id="dice" aria-label="Dado aún sin lanzar">⚄</div><span class="dice-spark">✦</span></div><button class="roll" id="roll">Lanzar el dado <span>→</span></button><p class="status" id="status" role="status" aria-live="polite"></p></section><section class="journey-tip"><span>✦</span><div><strong>Disfruta del camino.</strong><p>Un puente puede cambiarlo todo.<br>La siguiente sorpresa está cerca.</p></div></section><button class="restart text-button" id="restart">↻ Empezar otra aventura</button></aside></div>
</main><footer><span>UN CLÁSICO CON NUEVAS ALAS.</span><span>Partida local · Tú, Lola y Bruno</span></footer>
<dialog id="rules"><button class="close icon-button" id="close" aria-label="Cerrar reglas">×</button><p class="eyebrow">TU GUÍA DE VIAJE</p><h2>De oca a oca…</h2><p>Juega contra Lola y Bruno. Lanza el dado y llega a <strong>63 con una tirada exacta</strong>. Si te pasas, retrocedes las casillas sobrantes.</p><dl><dt>🪿 Oca · salta y repite</dt><dd>En ${GEESE.join(', ')} avanzas a la siguiente oca y repites. Desde 59 llegas a 63. Solo un salto por tirada.</dd><dt>🌉 Puente · 6 → 12</dt><dd>Cruza hasta el 12 y vuelve a tirar. Llegar al 12 no activa otro salto.</dd><dt>🏡 Posada · 19</dt><dd>Descansa un turno.</dd><dt>🪣 Pozo · 31 / 🔒 Cárcel · 52</dt><dd>Descansa dos turnos, sin rescate.</dd><dt>🌀 Laberinto · 42</dt><dd>Regresa a la casilla 30.</dd><dt>💀 Muerte · 58</dt><dd>Vuelve a la salida. ¡Aún puedes remontar!</dd></dl><p class="rules-note">Variante OcaGo: compartir casilla no tiene efecto. Sin excepciones en la primera tirada. Los efectos se aplican también después de rebotar.</p></dialog>
<dialog id="welcome" class="welcome"><div class="welcome-art">${goose}<span>✦</span></div><p class="eyebrow">BIENVENIDO A OCAGO</p><h2>Tu gran aventura<br>empieza con un dado.</h2><p>Compite con Lola y Bruno por llegar al jardín. Cruza puentes, encuentra ocas y deja que la suerte te sorprenda.</p><div class="welcome-facts"><span>🎲 Un dado</span><span>🪿 63 casillas</span><span>🏁 Una meta</span></div><button class="roll" id="start">¡Vamos al jardín! <span>→</span></button><small>Sin cuentas, sin compras. Solo jugar.</small></dialog>
<dialog id="victory" class="welcome"><div class="winner-medal">🏆</div><p class="eyebrow">AVENTURA COMPLETADA</p><h2 id="winner-title"></h2><p id="winner-copy"></p><button class="roll" id="again">Otra aventura <span>→</span></button><button class="text-button" id="view-board">Ver el tablero</button></dialog>
<dialog id="journal-dialog"><button class="close icon-button" id="close-journal" aria-label="Cerrar historial">×</button><p class="eyebrow">EL CAMINO RECORRIDO</p><h2>Últimos turnos</h2><p>Los resultados de esta sesión, del más reciente al anterior.</p><ol id="turn-log"></ol></dialog>
<dialog id="tile-detail"><button class="close icon-button" id="close-tile" aria-label="Cerrar casilla">×</button><p class="eyebrow">EN EL CAMINO</p><h2 id="tile-title"></h2><p id="tile-copy"></p><p id="tile-players"></p><div class="tile-navigation"><button class="utility-button" id="previous-tile" aria-label="Casilla anterior">Anterior</button><label>Casilla <input id="tile-picker" type="number" min="1" max="63" inputmode="numeric" value="1"></label><button class="utility-button" id="next-tile" aria-label="Casilla siguiente">Siguiente</button></div></dialog>
<dialog id="confirm"><p class="eyebrow">UN NUEVO COMIENZO</p><h2>¿Otra aventura?</h2><p>La partida actual se sustituirá por una nueva.</p><button class="roll" id="confirm-restart">Sí, empezar de nuevo →</button><button class="text-button" id="cancel-restart">Seguir jugando</button></dialog>`;
const $=<T extends HTMLElement=HTMLElement>(s:string)=>document.querySelector<T>(s)!;
const board=$('#board'),audio=createAudio(),atmosphere=createBoardAtmosphere(board);let controller=new AbortController(),cleanupVictory=()=>{};const art=(name:string)=>`${import.meta.env.BASE_URL}art/${name}.svg`;
board.style.backgroundImage=`url("${art('world-garden')}")`;board.style.backgroundSize='cover';
$('.garden-art').innerHTML=`<img class="island-art" src="${art('garden-island')}" alt="El jardín secreto, con su estanque y puente"><img class="mascot-art" src="${art('mascot-goose')}" alt="">`;
$('.welcome-art').innerHTML=`<img src="${art('mascot-goose')}" alt="Una oca lista para la aventura">`;
$('.brand svg').outerHTML=`<img src="${art('mascot-goose')}" alt="">`;
const cells:{x:number;y:number}[]=[];let left=0,right=8,top=0,bottom=8;
while(left<=right&&top<=bottom){for(let x=left;x<=right;x++)cells.push({x,y:top});top++;for(let y=top;y<=bottom;y++)cells.push({x:right,y});right--;for(let x=right;x>=left;x--)cells.push({x,y:bottom});bottom--;for(let y=bottom;y>=top;y--)cells.push({x:left,y});left++;}
for(let n=1;n<=63;n++){const {x,y}=cells[n-1],special=SPECIAL[n];const el=document.createElement('div');el.id=`cell-${n}`;el.className=`cell ${special?'special':''} ${GEESE.includes(n)?'goose':''} ${n===63?'finish':''} ${[19,31,42,52,58].includes(n)?'hazard':''}`;el.style.gridColumn=String(x+1);el.style.gridRow=String(y+1);el.setAttribute('aria-label',`Casilla ${n}${special?`: ${special.name}`:''}`);el.innerHTML=`<span class="number">${n}</span><span class="tile-icon">${special?`<img src="${art(GEESE.includes(n)?'goose':({6:'bridge',12:'bridge',19:'inn',31:'well',42:'maze',52:'prison',58:'skull',63:'finish'} as Record<number,string>)[n])}" alt="">`:(n%4===0?'✿':'')}</span><div class="tokens"></div>`;el.tabIndex=n===1?0:-1;el.setAttribute('role','button');el.addEventListener('click',()=>inspect(n));el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();inspect(n);}else if(['ArrowRight','ArrowDown','ArrowLeft','ArrowUp','Home','End'].includes(e.key)){e.preventDefault();const target=e.key==='Home'?1:e.key==='End'?63:Math.max(1,Math.min(63,n+(['ArrowRight','ArrowDown'].includes(e.key)?1:-1)));board.querySelectorAll<HTMLElement>('.cell').forEach(cell=>cell.tabIndex=-1);const cell=$(`#cell-${target}`);cell.tabIndex=0;cell.focus({preventScroll:true});}});const next=cells[n];if(next&&n<63){const arrow=document.createElement('span');arrow.className='route-arrow';arrow.textContent=next.x>x?'›':next.x<x?'‹':next.y>y?'⌄':'⌃';el.append(arrow);}board.append(el);}
function inspect(n:number){inspectedTile=n;$<HTMLInputElement>('#tile-picker').value=String(n);$<HTMLButtonElement>('#previous-tile').disabled=n===1;$<HTMLButtonElement>('#next-tile').disabled=n===63;$('#tile-title').textContent=`${n} · ${SPECIAL[n]?.name??'El camino'}`;const rules:Record<number,string>={6:'Cruza hasta la casilla 12 y vuelve a tirar.',12:'El puente de llegada. Aquí no se activa otro salto.',19:'Descansas un turno en la posada.',31:'El pozo te retiene dos turnos.',42:'El laberinto te devuelve a la casilla 30.',52:'La cárcel te retiene dos turnos.',58:'Vuelves a la salida. ¡Aún puedes remontar!',63:'El jardín: llega con una tirada exacta para ganar.'};$('#tile-copy').textContent=GEESE.includes(n)?`De oca a oca: avanzas a ${GEESE.find(p=>p>n)??63} y repites turno.`:rules[n]??'Una casilla más cerca del jardín. Sigue los números de la ruta.';$('#tile-players').textContent=game.players.filter(p=>p.position===n).map(p=>p.name).join(' · ')||'Todavía no hay viajeros aquí.';if(!$<HTMLDialogElement>('#tile-detail').open)$<HTMLDialogElement>('#tile-detail').showModal();}$('#close-tile').addEventListener('click',()=>$<HTMLDialogElement>('#tile-detail').close());
const escapeHTML=(value:string)=>value.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
const faces=['⚀','⚁','⚂','⚃','⚄','⚅'];
function render(){
 const status=presentationMessage??game.message;if($('#status').textContent!==status)$('#status').textContent=status;$('#round').textContent=`RONDA ${game.round}`;
 $('#turn-label').textContent=game.winner!==null?'META ALCANZADA':game.turn===0?'TU TURNO':`TURNO DE ${game.players[game.turn].name.toUpperCase()}`;
 $('#turn-title').textContent=game.winner!==null?(game.winner===0?'¡El jardín es tuyo!':'¡Qué gran aventura!'):game.turn===0?'Tu próxima aventura.':'La suerte está en juego.';
 const button=$<HTMLButtonElement>('#roll');button.disabled=busy||game.turn!==0||game.winner!==null;button.innerHTML=game.winner!==null?'Aventura completada ✓':busy?'En camino…':game.turn!==0?'Viajeros en movimiento…':game.players[0].skip?'Descansar este turno →':'Lanzar el dado <span>→</span>';
 if(!busy){$('#dice').textContent=faces[(game.roll??5)-1];$('#dice').setAttribute('aria-label',game.roll?`Dado: ${game.roll}`:'Dado aún sin lanzar');}
 $('#players').innerHTML=game.players.map((p,i)=>`<div class="player ${game.turn===i&&game.winner===null?'active':''}"><span class="avatar p${i}"><img src="${art(i===0?'mascot-goose':i===1?'atmosphere-lola':'atmosphere-bruno')}" alt=""></span><div class="player-info"><strong>${escapeHTML(p.name)} ${i===0?'<span>TÚ</span>':''}</strong><small>${p.skip?`Descansa ${p.skip} turno${p.skip>1?'s':''}`:p.position===0?'Listo para salir':`A ${63-p.position} casillas del jardín`}</small><div class="progress"><i class="p${i}" style="width:${p.position/63*100}%"></i></div></div><b>${p.position}<small>/63</small></b></div>`).join('');
 $('#start-tokens').innerHTML=game.players.map((p,i)=>p.position===0?`<span class="token p${i}">${i===0?'T':escapeHTML(p.name[0])}</span>`:'').join('');
 document.querySelectorAll('.tokens').forEach(e=>e.replaceChildren());document.querySelectorAll('.cell.occupied').forEach(e=>e.classList.remove('occupied'));game.players.forEach((p,i)=>{if(p.position>0){const token=document.createElement('span');token.className=`token p${i} ${game.turn===i?'current-token':''}`;token.textContent=i===0?'T':p.name[0];token.title=`${p.name}: ${p.position}`;$(`#cell-${p.position}`).classList.add('occupied');$(`#cell-${p.position} .tokens`).append(token);}});
}
function updateAtmosphere(){atmosphere.focus(game.players[game.turn].position,game.turn);}
async function play(){
 if(busy||game.winner!==null||document.querySelector('dialog[open]'))return;
 const run=++generation,actor=game.turn,player=game.players[actor],resting=player.skip>0;
 busy=true;
 presentationMessage=resting?`${player.name} descansa este turno.`:`${player.name} lanza el dado…`;
 render();
 const die=resting?1:randomDie();
 if(!resting){audio.play('roll');await animateDice($('#dice'),die,controller.signal);if(run!==generation)return;}
 const move=takeTurn(game,die),saved=saveMatch(move.game);
 $('.save-note').textContent=saved?'Tu aventura se guarda en este navegador':'Guardado no disponible · mantén esta pestaña abierta';
 presentationMessage=resting?move.game.message:`${player.name} saca ${die}. Sigue su ficha por el camino.`;
 for(const step of move.path){
  game.players[actor].position=step;render();atmosphere.focus(step,actor);audio.play('step');
  await animateStep(step>0?$(`#cell-${step}`):undefined,controller.signal);if(run!==generation)return;
 }
 const landing=resting?undefined:move.path[Math.min(die-1,move.path.length-1)];
 presentationMessage=move.game.message;render();
 if(resting)audio.play('rest');
 else if(landing&&SPECIAL[landing]){
  const kind:ArrivalKind=move.game.winner!==null?'finish':GEESE.includes(landing)?'goose':landing===6?'bridge':[19,31,52].includes(landing)?'rest':[42,58].includes(landing)?'setback':'finish';
  if(landing!==12){
   if(kind!=='finish')audio.play(kind);
   await Promise.all([atmosphere.arrive(landing,kind,controller.signal),kind==='finish'?Promise.resolve():animateEvent($(`#cell-${landing}`),kind,controller.signal)]);
   if(run!==generation)return;
  }
 }
 game=move.game;busy=false;presentationMessage=null;saveMatch(game);turnLog.unshift(game.message);turnLog.splice(12);render();updateAtmosphere();
 if(game.winner!==null){audio.play('victory');cleanupVictory=celebrateVictory(board);showVictory();}else schedule();
}
function showVictory(){
 if(game.winner===null||document.querySelector('dialog[open]'))return;
 $('#winner-title').textContent=game.winner===0?'¡El jardín es tuyo!':`¡${game.players[game.winner].name} llega al jardín!`;
 $('#winner-copy').textContent=`${game.round} rondas de sorpresas, puentes y nuevas oportunidades. ¿Otra carrera hasta el jardín?`;
 $<HTMLDialogElement>('#victory').showModal();
}

function schedule(){clearTimeout(timer);if(!busy&&game.turn!==0&&game.winner===null&&!document.querySelector('dialog[open]'))timer=setTimeout(()=>void play(),1100);}
function restart(){generation++;clearTimeout(timer);controller.abort();controller=new AbortController();cleanupVictory();audio.stop();atmosphere.reset();presentationMessage=null;turnLog.length=0;clearMatch();game=newGame();busy=false;saveMatch(game);render();}
$('#roll').addEventListener('click',()=>void play());$('#restart').addEventListener('click',()=>$<HTMLDialogElement>('#confirm').showModal());$('#confirm-restart').addEventListener('click',()=>{$<HTMLDialogElement>('#confirm').close();restart();});$('#cancel-restart').addEventListener('click',()=>$<HTMLDialogElement>('#confirm').close());$('#again').addEventListener('click',()=>{$<HTMLDialogElement>('#victory').close();restart();});$('#view-board').addEventListener('click',()=>$<HTMLDialogElement>('#victory').close());const dialog=$<HTMLDialogElement>('#rules');$('#help').addEventListener('click',()=>dialog.showModal());$('#legend').addEventListener('click',()=>inspect(game.players[game.turn].position||1));$('#close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});$('#start').addEventListener('click',()=>{$<HTMLDialogElement>('#welcome').close();try{localStorage.setItem('ocago:welcomed','1');}catch{}schedule();});render();let welcomed=false;try{welcomed=localStorage.getItem('ocago:welcomed')==='1';}catch{}if(!welcomed)$<HTMLDialogElement>('#welcome').showModal();else schedule();

board.setAttribute('aria-label','Tablero de La Oca. Usa las flechas para seguir la ruta, Inicio y Fin para saltar, y Enter para consultar una casilla.');
$('#previous-tile').addEventListener('click',()=>inspect(Math.max(1,inspectedTile-1)));
$('#next-tile').addEventListener('click',()=>inspect(Math.min(63,inspectedTile+1)));
$('#tile-picker').addEventListener('change',()=>{const n=Number($<HTMLInputElement>('#tile-picker').value);if(Number.isInteger(n)&&n>=1&&n<=63)inspect(n);else $<HTMLInputElement>('#tile-picker').value=String(inspectedTile);});
function updateSound(){const button=$<HTMLButtonElement>('#sound');button.textContent=audio.enabled?'Sonido: sí':'Sonido: no';button.setAttribute('aria-pressed',String(audio.enabled));button.setAttribute('aria-label',audio.enabled?'Desactivar sonido':'Activar sonido');}
$('#sound').addEventListener('click',async()=>{await audio.setEnabled(!audio.enabled);updateSound();if(audio.enabled)audio.play('click');});
$('#journal').addEventListener('click',()=>{const list=$('#turn-log');list.replaceChildren();for(const message of turnLog.length?turnLog:['Aquí aparecerán los resultados cuando lances el dado.']){const item=document.createElement('li');item.textContent=message;list.append(item);}$<HTMLDialogElement>('#journal-dialog').showModal();});
$('#close-journal').addEventListener('click',()=>$<HTMLDialogElement>('#journal-dialog').close());
for(const modal of Array.from(document.querySelectorAll<HTMLDialogElement>('dialog'))){modal.addEventListener('toggle',()=>{if(modal.open)clearTimeout(timer);else schedule();});modal.addEventListener('close',()=>{if(game.winner!==null&&modal.id!=='victory')showVictory();else schedule();});}
document.addEventListener('pointerdown',()=>void audio.unlock(),{passive:true});document.addEventListener('keydown',()=>void audio.unlock());
document.addEventListener('visibilitychange',()=>{if(document.hidden)audio.stop();});
updateSound();updateAtmosphere();
