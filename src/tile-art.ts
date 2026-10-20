/** Original OcaGo picture-book artwork. No external assets, IDs, fonts or user input. */
const ink = '#273f45';
const colors = ['#78c6d0','#f2bd64','#a6c781','#ef9d8d','#9ab6d2','#d3b1c3','#80b9a2'];
const labels = [
 'The first adventure','The unicycle fox','The singing kettle','The travelling bear','The garden goose','The little stone bridge','The friendly cloud','The explorer’s boot','The kite-flying goose',
 'The balloon fish','The turtle gardener','The second bridge','The moon owl','The goose and the stars','The honey bear','The acorn house','The woodland band','The goose with a ribbon','The cosy inn',
 'The mushroom village','The paper boat','The sleepy badger','The flower goose','The harvest basket','The lighthouse snail','The forest bicycle','The rainbow goose','The pocket watch','The red windmill',
 'The mountain fox','The old wishing well','The umbrella goose','The little toy train','The lantern mouse','The strawberry picnic','The dancing goose','The wooden sailboat','The painter rabbit','The sunflower lion',
 'The watering elephant','The travelling goose','The green maze','The musical house','The long scarf','The pond goose','The storybook cat','The flying teacup','The blue beetle','The garden gate','The crowned goose',
 'The star telescope','The quiet tower','The two lucky dice','The goose in the rain','The colourful piano','The round hot-air balloon','The sleeping dragon','The return-to-start skull','The golden goose','The dragonfly meadow',
 'The swimming frog','The lantern beetle','The secret goose garden',
];
export function tileArtLabel(n: number): string { return labels[n-1] ?? 'A garden adventure'; }
const path = (d:string,fill:string,extra='')=>`<path d="${d}" fill="${fill}" ${extra}/>`;
const ellipse = (cx:number,cy:number,rx:number,ry:number,fill:string,extra='')=>`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" ${extra}/>`;
const circle = (cx:number,cy:number,r:number,fill:string,extra='')=>`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" ${extra}/>`;
const line = (x1:number,y1:number,x2:number,y2:number,color=ink,width=2)=>`<path d="M${x1} ${y1}L${x2} ${y2}" fill="none" stroke="${color}" stroke-width="${width}"/>`;
function star(x:number,y:number,r=5,color='#fff1a9'){return path(`M${x} ${y-r}l${r*.32} ${r*.62} ${r*.68} ${r*.38}-${r*.68} ${r*.3}-${r*.32} ${r*.7}-${r*.32}-${r*.7}-${r*.68}-${r*.3} ${r*.68}-${r*.38}Z`,color,'stroke="none"');}
function flower(x:number,y:number,color='#f38f7d',scale=1){return `<g transform="translate(${x} ${y}) scale(${scale})">${line(0,0,0,18,'#426f51')}${path('M0 12Q-12 3-10 12Q-3 17 0 12','#73a65b','stroke="none"')}${[-7,0,7].map((a,i)=>ellipse(a,i===1?-7:0,5,7,color,'stroke="none"')).join('')}${circle(0,0,4,'#f9d275','stroke="none"')}</g>`;}
function cloud(x:number,y:number,scale=1){return `<g class="storybook-cloud" transform="translate(${x} ${y}) scale(${scale})" fill="#fff4dc" stroke="none">${circle(0,0,7,'#fff4dc')}${circle(9,-4,10,'#fff4dc')}${circle(21,0,7,'#fff4dc')}${path('M-7 0H28V7H-7Z','#fff4dc')}</g>`;}
function leaf(x:number,y:number,scale=1){return `<g class="storybook-leaf" transform="translate(${x} ${y}) scale(${scale})">${path('M0 15Q-17-1 0-16Q17-1 0 15','#71a86c')}${line(0,13,0,-10,'#385f4b',1)}</g>`;}
function goose(x=50,y=57,scale=1,accessory=0,idle=false){return `<g transform="translate(${x} ${y}) scale(${scale})"><g ${idle?'data-idle="goose"':''} class="storybook-character storybook-goose">${ellipse(0,28,25,4,'#203f4420','stroke="none"')}${path('M-19 10Q-36-2-23-11L-12-5Q-2-12 8-6L9-29Q9-43 20-42Q33-42 31-29L29-10Q28 9 13 17Q-3 26-19 10Z','#fff4d9')}${path('M-16 2Q-3 17 10 1M-20-3l-9-4','none')}${path('M30-33l12 6-12 4','#ec914c')}${idle?'<g data-idle="blink">':''}${circle(23,-33,1.8,ink,'stroke="none"')}${idle?'</g>':''}${path('M-5 20l-3 11-9 0M10 20l1 11 8 0','none','stroke="#d98341" stroke-width="3"')}${accessory===1?path('M9-16l21 2-4 7-16-3Z','#e77d6c'):accessory===2?`${path('M10-43l-5-8 22-5 8 10Z','#e9bc65')}${line(5,-42,35,-46)}`:accessory===3?`${path('M-21-11l-7-11-7 14 13 4','#86a4c7')}${circle(-27,-14,3,'#f5dc8c','stroke="none"')}`:accessory===4?`${path('M8-43l3-13 8 8 8-12 5 16Z','#f4d16d')}`:''}</g></g>`;}
function animal(kind:string,x=50,y=55,scale=1,color='#e6ad6c'){const fox=kind==='fox',rabbit=kind==='rabbit',bear=kind==='bear',cat=kind==='cat',owl=kind==='owl',badger=kind==='badger',lion=kind==='lion',mouse=kind==='mouse',frog=kind==='frog';return `<g class="storybook-character" transform="translate(${x} ${y}) scale(${scale})">${ellipse(0,28,26,4,'#203f4420','stroke="none"')}${lion?circle(0,-13,28,'#d99555'):''}${rabbit?`${ellipse(-11,-37,6,20,color)}${ellipse(9,-37,6,20,color)}`:fox||cat?`${path('M-20-10l-7-23 21 13Z',color)}${path('M7-20l20-13-6 25Z',color)}`:frog?`${circle(-15,-24,10,color)}${circle(15,-24,10,color)}`:`${circle(-17,-25,9,color)}${circle(17,-25,9,color)}`}${ellipse(0,12,21,22,color)}${ellipse(0,-12,24,21,color)}${fox||badger?`${path('M-22-17L-4-3 0-13 4-3 22-17Q22 8 0 9Q-22 8-22-17Z',badger?'#f2eee0':'#fff0cf')}`:ellipse(0,-3,13,10,'#f7e5c4','stroke="none"')}${owl?`${circle(-10,-14,10,'#fff1d6')}${circle(10,-14,10,'#fff1d6')}`:''}${circle(-9,-14,2,ink,'stroke="none"')}${circle(9,-14,2,ink,'stroke="none"')}${path(owl?'M-4-7L0 0 4-7Z':'M-3-5Q0-8 3-5L0-1Z',owl?'#e89d4d':ink)}${path('M-17 7L14 9 11 17-16 14Z',fox?'#5d9b98':'#e78370')}${path('M-13 29l-5 3M13 29l5 3','none')}</g>`;}
function mushroom(x:number,y:number,scale=1,color='#d9715b'){return `<g transform="translate(${x} ${y}) scale(${scale})">${path('M-7 2l-3 24q10 6 20 0L7 2Z','#f4e5bc')}${path('M-24 3Q-18-31 0-31Q19-31 25 3Q0 12-24 3Z',color)}${circle(-10,-10,4,'#fff1d7','stroke="none"')}${circle(7,-19,4,'#fff1d7','stroke="none"')}${circle(14,-4,3,'#fff1d7','stroke="none"')}</g>`;}
function house(x=50,y=58,scale=1,color='#f0c27e'){return `<g transform="translate(${x} ${y}) scale(${scale})">${path('M-24-7h48v38h-48Z',color)}${path('M-31-7L0-34 31-7Z','#cb725e')}${path('M-7 31V10q7-9 14 0v21Z','#597b70')}${path('M-17 3h8v9h-8ZM9 3h8v9H9Z','#a8d4d1')}${line(-4,-28,20,-9,'#f4d3a7',1)}${path('M12-27v-16h9v24','#8f7c66')}</g>`;}
function bridge(){return `${path('M0 68Q25 51 47 66T100 65V100H0Z','#6caab8','stroke="none"')}${path('M5 74Q49 22 94 74L94 86Q50 39 5 86Z','#e5c795')}${path('M10 57Q49 14 90 57','none','stroke-width="5"')}${[17,34,50,66,83].map((x,i)=>line(x,50-Math.sin(i/4*Math.PI)*16,x,69-Math.sin(i/4*Math.PI)*16)).join('')}${path('M8 90q14-6 25 0m19-3q14-6 25 0','none','stroke="#d6e3d4" stroke-width="2"')}`;}
function dice(x:number,y:number,s=1,rot=0){return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">${path('M-16-17h32v32h-32Z','#fff1d6')}${[[-8,-9],[8,-9],[0,-1],[-8,7],[8,7]].map(([a,b])=>circle(a,b,2.5,ink,'stroke="none"')).join('')}</g>`;}
function wheel(x:number,y:number,r=12){return `${circle(x,y,r,'#f7e2bd')}${circle(x,y,r-3,'none')}${line(x-r,y,x+r,y)}${line(x,y-r,x,y+r)}`;}
function illustration(n:number){
 if([5,9,14,18,23,27,32,36,41,45,50,54,59].includes(n)){
  const k=[5,9,14,18,23,27,32,36,41,45,50,54,59].indexOf(n);
  const details:Record<number,string>={
   0:flower(16,68,'#e58b73',.75),
   1:`${line(14,67,30,21)}${path('M30 21l10-12 13 14-12 14Z','#e98971')}${line(40,36,48,47,'#fff1ca')}`,
   2:`${star(17,21,7)}${star(82,26,5)}`,
   3:`${path('M16 34l14 5-8 7 9 12-10-1-9-13Z','#d88d80')}`,
   4:`${flower(16,55,'#f0be6c',.9)}${flower(82,68,'#d68a80',.65)}`,
   5:`${path('M3 39Q50-16 97 39','none','stroke="#e7b66b" stroke-width="10"')}${path('M3 39Q50-5 97 39','none','stroke="#d48883" stroke-width="5"')}`,
   6:`${line(24,26,24,72)}${path('M4 29Q25-7 46 29L33 25 24 31 15 25Z','#df9b79')}${path('M24 72q-9 9-10 0','none')}`,
   7:`${ellipse(50,78,43,8,'#6cabbb','stroke="none"')}${path('M17 33V14l11-4v16M78 34V18l10-3','none')}${ellipse(13,34,4,3,'#efce83')}${ellipse(24,27,4,3,'#efce83')}`,
   8:`${path('M16 42h12l5 23-15 3Z','#819fa8')}${line(25,38,25,21)}`,
   9:`${ellipse(50,78,45,10,'#6cabbb','stroke="none"')}${path('M9 83q13-5 24 0m35 0q12-5 24 0','none','stroke="#e5e3bc" stroke-width="2"')}`,
   10:`${star(19,27,6)}${star(83,37,4)}`,
   11:`${cloud(6,12,.8)}${[14,28,41,78,91].map((x,i)=>line(x,29+i%2*6,x-4,38+i%2*6,'#5c8c9a',2)).join('')}`,
   12:`${star(14,35,7)}${star(84,26,6)}${flower(82,75,'#f0c66b',.5)}`,
  };
  return `${details[k]}${goose(52,57,.81,k===10||k===12?4:k===3?1:k===8?3:0)}`;
 }
 switch(n){
 case 1:return `${goose(32,58,.65,1)}${goose(69,68,.55,0)}${path('M27 89q23-20 46 0q-23 16-46 0Z','#be8c56')}${ellipse(50,85,17,6,'#e6c997')}${flower(88,66,'#d58275',.6)}`;
 case 2:return `${wheel(48,78,15)}${line(48,63,48,42)}${animal('fox',49,44,.62,'#df9460')}${path('M40 61h22','none')}`;
 case 3:return `${path('M19 54Q15 21 51 24Q77 27 72 62L32 68Z','#e8c96d')}${path('M71 35q27-10 12 16H73','none','stroke-width="5"')}${path('M21 42L8 31 6 49 25 56Z','#e8c96d')}${path('M30 23q19-14 33 1','#d89262')}${circle(40,41,2,ink)}${circle(57,39,2,ink)}${path('M41 50q8 9 15-2M40 13q-6-8 0-13M56 12q7-8 0-13','none')}${star(85,22,4)}`;
 case 4:return `${animal('bear',49,56,.9,'#b98e68')}${path('M65 50l20-14 7 27-24 9Z','#729fa3')}${path('M70 48l9 10m-7-1 10-9','none','stroke="#eedbb5"')}`;
 case 6:case 12:return bridge();
 case 7:return `${cloud(28,43,1.7)}${circle(42,39,2,ink)}${circle(60,39,2,ink)}${path('M44 48q6 6 12 0','none')}${[25,47,70].map((x,i)=>path(`M${x} ${65+i%2*7}q-9 12 0 14q9-2 0-14`,'#6eacbd')).join('')}`;
 case 8:return `${path('M34 14h29l-5 41q2 11 22 11v16H23V64l13-12Z','#cf785f')}${path('M34 25l27 4M31 66l40 4','none')}${[20,30,40].map(y=>line(40,y,54,y+2,'#f0dab0')).join('')}${flower(76,35,'#f3c768',.75)}`;
 case 10:return `${line(44,50,39,91,'#f5e2be')}${ellipse(49,32,28,23,'#e39183')}${path('M74 29l19-10v23Z','#f3c570')}${circle(34,27,3,ink)}${path('M39 38q11 9 19-1','none')}${path('M35 14l9-11 10 9','#7bb0a8')}${star(16,58,5)}`;
 case 11:return `${ellipse(52,59,31,21,'#7fae7d')}${path('M27 59q25-31 49 0M52 38v40M34 47l35 24M70 47L35 72','none','stroke="#43694f"')}${circle(85,61,11,'#b8ce8d')}${circle(88,57,2,ink)}${path('M29 74v9m32-8 1 8','none','stroke-width="5"')}${flower(32,23,'#e48773',.6)}`;
 case 13:return `${circle(76,26,17,'#f5d891','stroke="none"')}${animal('owl',49,61,.8,'#c2a0ad')}${line(12,85,87,85,'#887b5c',6)}${star(18,23,4)}${star(45,13,3)}`;
 case 15:return `${animal('bear',45,55,.8,'#be946d')}${path('M59 49h27l-3 29H63Z','#d8a64f')}${path('M56 49h33v6H56Z','#f1d49b')}${path('M68 61q8-7 10 2l-8 7Z','#f5d478')}`;
 case 16:return `${path('M25 43Q10 64 23 86h50q15-24-4-43Z','#b58b60')}${path('M15 43Q45 4 81 43Z','#d18c60')}${path('M16 41l64 0M24 34l48 0','none')}${path('M46 24q-8-17 4-20','none','stroke-width="4"')}${path('M34 86V64q14-17 26 0v22Z','#6c8f7a')}${circle(58,71,2,'#f6d98c')}`;
 case 17:return `${animal('mouse',30,55,.62,'#a5a9ac')}${animal('rabbit',73,54,.6,'#f0d4ac')}${path('M25 49l20 14-5 7-20-13Z','#b98562')}${line(34,57,58,36)}${circle(70,71,13,'#dfb45e')}${circle(70,71,8,'#eedc9e')}`;
 case 19:return `${house(50,54,1,'#edc995')}${path('M19 18v-9h19v9Z','#fbdf9c')}${line(17,18,40,18)}${circle(30,14,2,'#d18b61')}`;
 case 20:return `${mushroom(32,54,.9)}${mushroom(72,70,.6,'#e3aa62')}${path('M29 76v-10q5-5 9 0v10','#648c82')}${circle(24,62,2,'#82afb1')}${flower(12,75,'#ebbc6b',.5)}`;
 case 21:return `${path('M12 53l38 18 39-18-15 27H28Z','#faf0d8')}${path('M50 19L15 53h35Z','#eaba73')}${path('M50 19l34 34H50Z','#f5e7b6')}${path('M0 89q16-10 31 0t34 0t35 0','none','stroke="#e1e6d0" stroke-width="3"')}`;
 case 22:return animal('badger',50,58,.95,'#798c8a');
 case 24:return `${path('M18 50h66l-9 31H27Z','#bd8e58')}${path('M21 55l58 0m-54 9h51m-48 9h45','none','stroke="#e3bd81"')}${path('M25 50Q49 0 75 50','none','stroke-width="5"')}${circle(40,45,10,'#dd8863')}${circle(57,42,11,'#e6bb66')}${leaf(61,26,.4)}`;
 case 25:return `${ellipse(48,75,36,13,'#8eb1a3')}${circle(46,62,22,'#deb46f')}${path('M47 61q-14-20-21 1q-4 17 14 16q16-1 12-14q-4-9-9-3','none')}${path('M69 71l8-20 8 22Z','#f0d6a5')}${path('M73 47l1-11m6 13 6-11','none')}${circle(74,35,2,ink)}${circle(87,36,2,ink)}${path('M45 42V15h12v30Z','#f5e5bb')}${path('M40 15l11-9 11 9Z','#cb7c62')}`;
 case 26:return `${wheel(26,73,17)}${wheel(76,73,17)}${path('M26 73l20-26 12 26H26l14-17h26l10 17M42 46l-2-10h-9M64 55l6-20h10','none','stroke="#d7795f" stroke-width="3"')}${flower(80,23,'#edbd6d',.6)}`;
 case 28:return `${circle(50,58,31,'#e7c479')}${circle(50,58,24,'#fbecd0')}${path('M42 27V16h16v11Z','#b58b56')}${path('M50 40v20l14 8','none','stroke-width="3"')}${[0,1,2,3].map(i=>circle(50+Math.sin(i*Math.PI/2)*19,58-Math.cos(i*Math.PI/2)*19,2,ink)).join('')}`;
 case 29:return `${path('M36 39h25l9 49H26Z','#f0d1a2')}${path('M29 40l20-17 20 17Z','#c86c57')}${path('M50 40L25 15 13 27l25 25ZM50 40l25-25 12 12-25 25ZM50 40l25 25-12 12-25-25ZM50 40L25 65 13 53l25-25Z','#dd8666')}${circle(50,40,6,'#f4d398')}${path('M43 88V73h13v15Z','#7a9f95')}`;
 case 30:return `${animal('fox',50,57,.85,'#dd9e66')}${path('M28 36l13 4-2 22-13-3Z','#a6b9b4')}${line(76,32,83,86,'#7b785e',3)}${path('M72 31q15-18 18 2','none')}`;
 case 31:return `${path('M15 61Q50 47 85 61v24Q50 97 15 85Z','#a5ac96')}${ellipse(50,61,35,11,'#ead2a2')}${ellipse(50,61,25,6,'#45645f')}${path('M23 58V18M78 58V18','none','stroke="#ad8058" stroke-width="5"')}${path('M12 22L50 4l39 18Z','#ca7d5e')}${line(51,19,51,61,'#b28e5b',3)}${path('M43 46h15l-2 14H45Z','#c39265')}`;
 case 33:return `${wheel(28,78,8)}${wheel(48,78,8)}${wheel(76,78,8)}${path('M17 44h42v30H17ZM58 53h29v21H58Z','#b86f61')}${path('M22 25h28v26H22Z','#ead39b')}${path('M26 31h17v15H26Z','#88b6b4')}${path('M69 52V32h10v20Z','#607e84')}${cloud(69,20,.45)}`;
 case 34:return `${animal('mouse',35,59,.7,'#b3b7b0')}${line(60,40,61,80,'#9d8059',3)}${path('M58 36h21v34H58Z','#edc36b')}${path('M55 36l14-12 13 12Z','#a16f59')}${path('M65 44l6-4 4 23-8-2Z','#fff0ad','stroke="none"')}`;
 case 35:return `${path('M11 61h78v26H11Z','#f2dec2')}${path('M11 67h78M11 77h78M25 61v26M47 61v26M69 61v26','none','stroke="#d38e7b"')}${[30,50,72].map((x,i)=>`${path(`M${x-9} 48q9-16 18 0l-9 15Z`,'#ce7461')}${leaf(x,36,.35)}`).join('')}${ellipse(52,66,26,4,'#f6e9c9')}`;
 case 37:return `${path('M10 64h80L69 84H29Z','#ad7959')}${line(49,13,49,64,'#7b755a',3)}${path('M44 20L15 58h29Z','#e7b567')}${path('M54 17l29 41H54Z','#eddec0')}`;
 case 38:return `${animal('rabbit',36,53,.65,'#e8ceaa')}${path('M54 52l31-14 9 32-31 13Z','#eddbac')}${path('M67 62l14-12M64 68l21-5','none','stroke="#8aa99a" stroke-width="3"')}${line(46,44,69,59,'#876c53',3)}`;
 case 39:return `${animal('lion',50,60,.77,'#e8bd76')}${flower(81,24,'#e9c360',.8)}`;
 case 40:return `${ellipse(47,51,27,29,'#a3bbc4')}${ellipse(29,37,15,21,'#bdd1d2')}${path('M66 42q31-6 18 28q-6 10-11 4q11-12 1-21','#a3bbc4')}${circle(58,38,2,ink)}${path('M30 74v13m29-13v13','none','stroke-width="8"')}${path('M4 65l21-11 3 9-19 12Z','#dfaa63')}${flower(82,15,'#d68573',.55)}`;
 case 42:return `${path('M13 18h75v67H13Z','#77a27d')}${path('M22 75V28h55v46H36V42h27v18H50M22 57h13M63 28v14M51 75v10','none','stroke="#c8dca3" stroke-width="6"')}${path('M51 8l-7 9h15Z','#efd08c')}`;
 case 43:return `${house(46,58,.83,'#88b3af')}${path('M72 36V14l14-4v18','none','stroke-width="3"')}${ellipse(68,38,5,3,'#e4b568')}${ellipse(82,30,5,3,'#e4b568')}`;
 case 44:return `${path('M21 18q18 10 38 0l10 10-18 14 7 39-17 7-5-48-19-5Z','#d88273')}${path('M22 24l34-2M39 49l17-2M41 61l16-2M42 74l17-2','none','stroke="#f6d8a4" stroke-width="3"')}`;
 case 46:return `${animal('cat',50,50,.8,'#d5af87')}${path('M16 78q34-17 69 0l-2 11H17Z','#efe0af')}${path('M49 72v17M18 79l27 2m10 0 26-2','none')}`;
 case 47:return `${path('M18 45h55q3 32-25 33-26 0-30-33Z','#f3ddac')}${path('M73 46q24-5 18 13q-3 10-21 5','none','stroke-width="4"')}${path('M18 48Q-1 13 34 30M69 44Q80 6 95 32','none','stroke="#f4e7bf" stroke-width="6"')}${path('M30 84h39','none','stroke-width="4"')}${star(15,21,4)}`;
 case 48:case 62:return `${ellipse(50,58,25,30,n===48?'#6c9fae':'#c4ad69')}${path('M50 29v59M28 49l-15-7m60 7 15-7M27 65l-15 7m62-7 14 7M33 82l-9 9m43-9 9 9','none')}${circle(50,25,14,'#6b8a81')}${circle(44,22,2,'#f7e1a2')}${circle(56,22,2,'#f7e1a2')}${n===62?`${ellipse(50,61,13,19,'#f9dc88','stroke="none"')}${star(19,21,4)}${star(84,12,3)}`:''}`;
 case 49:return `${path('M20 88V31Q50 0 80 31v57','none','stroke="#a48356" stroke-width="5"')}${path('M24 40h24v43H24ZM53 40h24v43H53Z','#9ab578')}${line(28,48,43,75,'#dae2ac')}${line(57,48,72,75,'#dae2ac')}${flower(16,65,'#e29b77',.6)}`;
 case 51:return `${line(47,57,28,89,'#a58b60',4)}${line(47,57,70,89,'#a58b60',4)}${path('M22 42l52-21 10 18-52 22Z','#dbb367')}${path('M72 18l14-4 11 23-14 6Z','#ead19a')}${path('M21 39l8 21-11 4-8-21Z','#5b8a94')}${star(24,17,5)}${star(58,11,3)}`;
 case 52:return `${path('M22 85V21h55v64Z','#a2adb0')}${path('M18 17h14v11H18ZM42 17h14v11H42ZM66 17h15v11H66Z','#b6bdb4')}${path('M34 85V48q15-22 30 0v37Z','#526b70')}${[41,49,57].map(x=>line(x,43,x,84,'#d0ccac',3)).join('')}${cloud(62,9,.4)}`;
 case 53:return `${dice(32,45,1,-16)}${dice(67,69,.87,16)}${star(82,24,5)}${star(14,80,4)}`;
 case 55:return `${path('M14 42h73v38H14Z','#6c8c92')}${path('M14 42l11-23h49l13 23Z','#c58174')}${path('M20 51h61v22H20Z','#f4e8c8')}${[29,40,51,62,73].map(x=>path(`M${x} 51v13h-5V51Z`,ink)).join('')}${path('M21 80l-4 12m63-12 4 12','none','stroke-width="4"')}`;
 case 56:return `${ellipse(50,33,31,29,'#e6b16d')}${path('M26 16q24-26 48 0M28 52q22 23 44 0','none','stroke="#cf7d68" stroke-width="10"')}${line(29,53,39,77,'#9e835c')}${line(71,53,61,77,'#9e835c')}${path('M36 72h28l-4 17H40Z','#b99062')}`;
 case 57:return `${ellipse(48,63,30,20,'#86ac8c')}${path('M72 63q29-18 15-31q-9-9-14 1q17 6 0 16','#86ac8c')}${path('M23 51l5-14 11 10 10-15 11 15','#dcad78')}${path('M30 62q5 5 10 0m9 0q5 5 10 0','none')}${path('M6 28h12l-12 12h12M23 15h9l-9 9h9','none','stroke="#f2e7c1" stroke-width="2"')}`;
 case 58:return `${path('M25 68l51 20M24 88l53-20','none','stroke="#ede2bf" stroke-width="6"')}${path('M23 40q0-30 28-30q29 0 29 30q0 20-17 25v10H38V65Q23 59 23 40Z','#f5e8c8')}${ellipse(39,39,8,10,'#344b50')}${ellipse(64,39,8,10,'#344b50')}${path('M48 51l-5 8h12Z','#344b50')}${line(47,66,47,75)}${line(55,66,55,75)}`;
 case 60:return `${ellipse(35,38,17,8,'#e5dfb2')}${ellipse(63,38,17,8,'#e5dfb2')}${ellipse(35,52,17,8,'#b5d0ca')}${ellipse(63,52,17,8,'#b5d0ca')}${line(49,29,49,77,'#637e81',5)}${circle(49,26,8,'#e8bd6b')}${flower(22,74,'#d38c7a',.65)}${flower(80,78,'#e7c473',.65)}`;
 case 61:return `${ellipse(50,76,39,11,'#7daea7')}${animal('frog',50,54,.78,'#8eaf78')}${path('M8 82q13-19 28 0l-11 9Z','#bbcb87','stroke="none"')}`;
 case 63:return `${circle(73,21,14,'#f8d693','stroke="none"')}${path('M0 70Q40 50 100 69V100H0Z','#7eafa8','stroke="none"')}${goose(39,52,.73,4)}${goose(78,73,.42)}${flower(13,47,'#e39180',.6)}`;
 default:return `${flower(30,48)}${flower(65,59,'#eac56b')}${leaf(80,78,.7)}`;
 }
}
export function tileArt(n:number, aspect=1):string {
 const number=Number.isInteger(n)&&n>=1&&n<=63?n:1;
 const ratio=Number.isFinite(aspect)&&aspect>0?aspect:1;
 const sx=ratio>1?1/ratio:1,sy=ratio<1?ratio:1;
 const sceneTransform=`translate(${(1-sx)*50} ${(1-sy)*50}) scale(${sx} ${sy})`;
 const night=[13,14,22,34,51,62].includes(number);
 const sky=night?'#426976':colors[(number*3+1)%colors.length];
 const grass=number%3===0?'#87b586':number%3===1?'#b5c88a':'#c8c092';
 return `<svg class="storybook-tile" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false"><g stroke="${ink}" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"><path d="M0 0h100v100H0Z" fill="${sky}" stroke="none"/>${night?`${star(12,20,3)}${star(76,15,4)}${star(88,46,2)}`:`${circle(81,16,11,'#f8df9b','stroke="none"')}${cloud(8,23,.52)}`}<path d="M0 78Q24 60 49 78T100 75V100H0Z" fill="${grass}" stroke="none"/><g class="storybook-subject" transform="${sceneTransform}">${illustration(number)}</g>${number%2===0?leaf(7,94,.32):flower(91,85,number%3?'#f4d189':'#e98f7b',.3)}<path d="M6 93l4-2m75 5 5-2" fill="none" stroke="#f8ecc9" stroke-width="1.5"/></g></svg>`;
}
export function startArt():string {return `<svg class="storybook-start" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 180" aria-hidden="true"><g stroke="${ink}" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">${path('M0 0h300v180H0Z','#83bdcb','stroke="none"')}${circle(238,36,24,'#f5dc9c','stroke="none"')}${cloud(32,38,1.4)}${path('M0 140Q68 89 145 130T300 116v64H0Z','#b7c58a','stroke="none"')}${path('M0 167Q100 112 190 168T300 140v40H0Z','#ead2a1','stroke="none"')}${goose(80,108,1.3,1)}${goose(211,116,1.1,0)}${path('M106 157q44-43 89 0q-45 30-89 0Z','#b58b5b')}${ellipse(151,154,31,9,'#e7c99a')}${ellipse(146,148,8,11,'#fff0ce')}${ellipse(162,151,7,10,'#fff0ce')}${flower(26,132,'#d98576',1)}${leaf(277,157,1.4)}</g></svg>`;}
export function finishArt():string {return `<svg class="storybook-finish" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 180" aria-hidden="true"><g stroke="${ink}" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">${path('M0 0h300v180H0Z','#e9aa8d','stroke="none"')}${circle(240,35,25,'#f4d797','stroke="none"')}${cloud(20,33,1.6)}${path('M0 110Q75 63 151 111T300 96v84H0Z','#c7cc91','stroke="none"')}${path('M71 180Q100 115 187 118T300 136v44Z','#78b1bd','stroke="none"')}<g data-idle="water">${path('M133 151q17-8 35 0m35 13q18-8 35 0m-65 10q18-8 35 0','none','stroke="#d7e4d6" stroke-width="2"')}</g>${goose(115,85,1.1,4,true)}${goose(211,126,.85)}${goose(263,135,.6,1)}<g data-idle="flutter">${leaf(25,139,2.5)}</g>${flower(50,111,'#d78b77',.9)}${star(166,34,6)}${star(185,65,4)}</g></svg>`;}
