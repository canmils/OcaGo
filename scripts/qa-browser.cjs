const {chromium} = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const url = process.env.QA_URL || 'http://localhost:5173';
const spanish = /\b(?:casilla|turno|jardín|jugar|sonido|aventura|descansa|tú|dado|lanzar|puente|posada|pozo|cárcel|muerte|salida)\b/i;
const base = {players: [{name:'You',position:0,skip:0},{name:'Lola',position:0,skip:0},{name:'Bruno',position:0,skip:0}],turn:0,winner:null,roll:null,message:'Ready for your first roll.',round:1};

(async () => {
  const browser = await chromium.launch({executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium',args:['--no-sandbox']});
  const page = await browser.newPage({reducedMotion:'reduce'});
  const errors = [], results = [];
  // The faked clock must advance in small steps: a single large jump fires timers but
  // skips the animation-frame tick that Chromium needs to deliver a dialog's close event.
  const advance = async ms => { for (let elapsed = 0; elapsed < ms; elapsed += 100) await page.clock.runFor(Math.min(100, ms - elapsed)); };
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => {
    window.qaAudio = {contexts:0,frequencies:[]};
    const Original = window.AudioContext;
    if (Original) window.AudioContext = class extends Original {
      constructor(...args) { super(...args); window.qaAudio.contexts++; }
      createOscillator() {
        const oscillator = super.createOscillator(), original = oscillator.frequency.setValueAtTime.bind(oscillator.frequency);
        oscillator.frequency.setValueAtTime = (value,time) => { window.qaAudio.frequencies.push(value); return original(value,time); };
        return oscillator;
      }
    };
  });
  await page.clock.install();
  await page.goto(url);
  assert.equal(await page.locator('html').getAttribute('lang'),'en');
  assert(!spanish.test(await page.locator('body').innerText()),'Welcome must use English');
  await page.locator('#start').click();
  assert.equal(await page.locator('#sound').getAttribute('aria-pressed'),'false');
  assert.equal(await page.evaluate(() => window.qaAudio.contexts),0);
  await page.locator('#sound').click();
  assert.equal(await page.locator('#sound').getAttribute('aria-pressed'),'true');
  assert.equal(await page.evaluate(() => window.qaAudio.contexts),1);
  await page.reload();
  assert.equal(await page.locator('#sound').getAttribute('aria-pressed'),'true');
  assert.equal(await page.evaluate(() => window.qaAudio.contexts),0);
  await page.locator('#sound').click();
  assert.equal(await page.locator('#sound').getAttribute('aria-pressed'),'false');
  results.push({audioDefaultOffOptInReloadMute:true});

  fs.mkdirSync('docs/screenshots',{recursive:true});
  for (const [width,height] of [[320,740],[360,800],[390,844],[1440,1000]]) {
    await page.setViewportSize({width,height});
    await page.evaluate(() => scrollTo(0,0));
    const layout = await page.evaluate(() => {
      const rect = selector => document.querySelector(selector).getBoundingClientRect().toJSON();
      return {
        width:innerWidth,height:innerHeight,overflow:document.documentElement.scrollWidth > innerWidth,
        roll:rect('#roll'),board:rect('#board'),start:rect('#cell-1'),second:rect('#cell-2'),finish:rect('#cell-63'),
        targets:Object.fromEntries(['#help','#zoom','#legend','#restart'].map(selector=>[selector,rect(selector)])),
        players:[...document.querySelectorAll('#players .player')].map(el => el.getBoundingClientRect().toJSON()),
        startTokens:[...document.querySelectorAll('#start-tokens .token')].map(el => el.getBoundingClientRect().toJSON()),
        illustrated:[...document.querySelectorAll('.cell')].map(el => ({n:el.id,hasArt:!!el.querySelector('.tile-illustration svg,.tile-illustration img')})),
      };
    });
    assert.equal(layout.overflow,false,`${width}px horizontal overflow`);
    assert.equal(layout.players.length,3);
    for (const player of layout.players) assert(player.top>=0 && player.bottom<=height && player.left>=0 && player.right<=width,`All players must be visible at ${width}px`);
    assert.equal(layout.startTokens.length,3);
    for (const token of layout.startTokens) assert(token.top>=0 && token.bottom<=height,'Starting tokens must be visible');
    assert(layout.roll.height>=44 && layout.roll.top>=0 && layout.roll.bottom<=height,`Visible 44px roll control at ${width}px`);
    for(const [selector,target] of Object.entries(layout.targets)) {
      assert(target.width>=44&&target.height>=44,`${selector} must be at least 44x44 at ${width}px (measured ${target.width}x${target.height})`);
      assert(layout.roll.width>target.width&&layout.roll.height>=target.height,`${selector} must stay smaller than the roll primary at ${width}px`);
    }
    assert.equal(layout.illustrated.length,63);
    assert(layout.illustrated.every(cell => cell.hasArt),'Every cell needs illustration');
    assert(layout.start.x < layout.board.x + layout.board.width/2 && layout.start.y > layout.board.y + layout.board.height/2,'Start must be bottom-left');
    assert(layout.start.width * layout.start.height >= layout.second.width * layout.second.height * 1.8,'Starting vignette must be larger than an ordinary cell');
    const finishX=layout.finish.x+layout.finish.width/2, finishY=layout.finish.y+layout.finish.height/2;
    assert(Math.abs(finishX-(layout.board.x+layout.board.width/2))<layout.board.width*.2 && Math.abs(finishY-(layout.board.y+layout.board.height/2))<layout.board.height*.2,'Finish must be central');
    assert(!spanish.test(await page.locator('body').innerText()),'Game screen must use English');
    await page.screenshot({path:`docs/screenshots/game-${width}.png`,fullPage:true});
    results.push({width,height,allPlayersVisible:true,illustratedCells:63,startBottomLeft:true,centralFinish:true,rollHeight:layout.roll.height,touchTargets:Object.fromEntries(Object.entries(layout.targets).map(([selector,r])=>[selector,`${Math.round(r.width)}x${Math.round(r.height)}`]))});
  }
  await page.setViewportSize({width:390,height:844});
  const normalBoardWidth=await page.locator('#board').evaluate(el=>el.getBoundingClientRect().width);
  await page.locator('#zoom').click();assert.equal(await page.locator('#zoom').getAttribute('aria-pressed'),'true');
  const zoomState=await page.evaluate(()=>{const viewport=document.querySelector('#board-viewport');return{board:document.querySelector('#board').getBoundingClientRect().width,pan:viewport.scrollWidth>viewport.clientWidth,overflow:document.documentElement.scrollWidth>innerWidth};});
  assert(zoomState.board>normalBoardWidth*1.5 && zoomState.pan && !zoomState.overflow,'Zoom must enlarge art with internal pan, not page overflow');
  await page.locator('#zoom').click();assert.equal(await page.locator('#zoom').getAttribute('aria-pressed'),'false');results.push({zoomAndPan:true});
  assert.equal(await page.locator('.cell[tabindex="0"]').count(),1);
  await page.locator('#cell-1').focus(); await page.keyboard.press('ArrowRight');
  assert(await page.locator('#cell-2').evaluate(el => el===document.activeElement));
  await page.keyboard.press('End'); assert(await page.locator('#cell-63').evaluate(el => el===document.activeElement));
  await page.keyboard.press('Home'); assert(await page.locator('#cell-1').evaluate(el => el===document.activeElement));
  await page.locator('#cell-6').focus(); await page.keyboard.press('Enter');
  assert(await page.locator('#tile-detail').isVisible());
  assert((await page.locator('#tile-copy').innerText()).includes('12'));
  assert(!spanish.test(await page.locator('#tile-detail').innerText()));
  for (const selector of ['#previous-tile','#next-tile','#tile-picker']) assert((await page.locator(selector).boundingBox()).height>=44);
  await page.locator('#next-tile').click(); assert((await page.locator('#tile-title').innerText()).startsWith('7'));
  await page.locator('#previous-tile').click(); await page.keyboard.press('Escape');
  assert(await page.locator('#cell-6').evaluate(el => el===document.activeElement));
  await page.locator('#help').click(); assert(await page.locator('#rules').isVisible());
  assert(!spanish.test(await page.locator('#rules').innerText()));
  await page.keyboard.press('Escape'); assert(await page.locator('#help').evaluate(el => el===document.activeElement));

  async function inject(game) {
    await page.evaluate(game => localStorage.setItem('ocago.match',JSON.stringify({version:2,game})),game);
    await page.reload(); await page.locator('#roll').waitFor();
  }
  const legacy=structuredClone(base);legacy.players[0].name='Tú';legacy.players[0].position=12;legacy.message='¡Cruzas el puente y vuelves a tirar!';await page.evaluate(game=>localStorage.setItem('ocago.match',JSON.stringify({version:1,game})),legacy);await page.reload();assert((await page.locator('#players').innerText()).includes('You'));assert(!spanish.test(await page.locator('#status').innerText()));assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('ocago.match')).version),2);
  let game=structuredClone(base); game.turn=1;
  await page.evaluate(() => localStorage.setItem('ocago:sound','on')); await inject(game);
  await advance(5000); assert.equal(await page.evaluate(() => window.qaAudio.contexts),0);
  await page.evaluate(() => localStorage.setItem('ocago:sound','off'));
  results.push({savedOptInBotNoAutoplay:true});
  game=structuredClone(base); game.players[0].name='<em id="injected">X</em>'; await inject(game);
  assert.equal(await page.locator('#injected').count(),0);
  for(const [width,height] of [[320,740],[390,844]]) {
    await page.setViewportSize({width,height});
    for(const position of [3,10]) {
      game=structuredClone(base);game.players.forEach(player=>player.position=position);await inject(game);
      const shared=await page.locator(`#cell-${position}`).evaluate(cell=>{
        const tile=cell.getBoundingClientRect(),number=cell.querySelector('.number').getBoundingClientRect();
        return {tile:tile.toJSON(),number:number.toJSON(),tokens:[...cell.querySelectorAll('.tokens .token')].map(token=>({rect:token.getBoundingClientRect().toJSON(),letter:token.textContent}))};
      });
      assert.equal(shared.tokens.length,3);assert.equal(new Set(shared.tokens.map(token=>token.letter)).size,3);
      for(const token of shared.tokens) {
        const rect=token.rect,tile=shared.tile;
        assert(rect.width>=6 && rect.height>=6,'Shared tokens need nonzero visible footprint');
        assert(rect.left>=tile.left-.5 && rect.right<=tile.right+.5 && rect.top>=tile.top-.5 && rect.bottom<=tile.bottom+.5,`Shared token clipped on square${position} at${width}`);
        const numberCenter={x:shared.number.x+shared.number.width/2,y:shared.number.y+shared.number.height/2};
        assert(!(numberCenter.x>rect.left&&numberCenter.x<rect.right&&numberCenter.y>rect.top&&numberCenter.y<rect.bottom),'Token must not conceal square number');
      }
      for(let i=0;i<3;i++)for(let j=i+1;j<3;j++) {
        const a=shared.tokens[i].rect,b=shared.tokens[j].rect;
        const overlapX=Math.min(a.right,b.right)-Math.max(a.left,b.left),overlapY=Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top);
        assert(overlapX<=.5||overlapY<=.5,`Shared tokens overlap on square${position} at${width}`);
      }
    }
  }
  await page.setViewportSize({width:390,height:844});await page.screenshot({path:'docs/screenshots/game-shared-390.png',fullPage:true});results.push({sharedPawnGeometry:true});
  game=structuredClone(base); game.turn=1; await inject(game);
  await page.evaluate(() => crypto.getRandomValues=array=>{array[0]=0;return array;});
  await page.locator('#help').click(); await advance(5000);
  assert.equal(await page.locator('#players .player b').nth(1).innerText(),'0/63');
  await page.keyboard.press('Escape'); await advance(5000);
  assert.notEqual(await page.locator('#players .player b').nth(1).innerText(),'0/63');
  await inject(base); await page.locator('#roll').click(); await page.locator('#restart').click(); await page.locator('#confirm-restart').click();
  await advance(5000); assert.deepEqual(await page.locator('#players .player b').allTextContents(),['0/63','0/63','0/63']);
  game=structuredClone(base); game.players[0].skip=1; game.players[0].position=19; await inject(game);
  assert(/rest|skip/i.test(await page.locator('#roll').innerText()));
  await page.locator('#sound').click(); await page.evaluate(() => window.qaAudio.frequencies=[]);
  await page.locator('#roll').click(); await advance(50);
  assert.equal(await page.evaluate(() => document.querySelector('#dice').getAnimations().length),0);
  const frequencies=await page.evaluate(() => window.qaAudio.frequencies);
  assert(!frequencies.includes(220) && !frequencies.includes(294));
  assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('ocago.match')).game.players[0].skip),0);
  await page.locator('#journal').click(); assert(/rest|skip|miss|wait/i.test(await page.locator('#turn-log').innerText()));
  await page.keyboard.press('Escape'); await advance(5000);
  await page.locator('#journal').click(); assert(/rest|skip|miss|wait/i.test(await page.locator('#turn-log').innerText()));
  assert(await page.locator('#turn-log li').count()>1); await page.keyboard.press('Escape'); await page.locator('#sound').click();
  game=structuredClone(base); game.players[0].position=62; await inject(game);
  await page.evaluate(() => crypto.getRandomValues=array=>{array[0]=0;return array;}); await page.locator('#roll').click(); await advance(5000);
  assert(await page.locator('#victory').isVisible()); assert(!spanish.test(await page.locator('#victory').innerText()));
  assert(await page.locator('#roll').isDisabled()); await page.reload(); assert(await page.locator('#roll').isDisabled());
  if(await page.locator('#victory').isVisible()) await page.locator('#view-board').click();
  await page.locator('#restart').click(); await page.locator('#confirm-restart').click(); assert(await page.locator('#roll').isEnabled());
  game=structuredClone(base); game.turn=2; game.players[2].position=62; await inject(game);
  await page.evaluate(() => crypto.getRandomValues=array=>{array[0]=0;return array;}); await advance(5000);
  assert(await page.locator('#victory').isVisible()); await page.locator('#again').click();
  await page.evaluate(() => {let seed=17;crypto.getRandomValues=array=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;array[0]=seed;return array;};});
  let cycles=0;
  while(cycles++<1000) {
    if(await page.locator('#victory').isVisible()) break;
    if(await page.locator('#roll').isEnabled()) await page.locator('#roll').click();
    await advance(5000);
    assert(!spanish.test(await page.locator('#status').innerText()),'Live outcome must be English');
  }
  assert(cycles<1000,'Full seeded match must finish');
  await page.locator('#view-board').click(); await page.locator('#journal').click(); assert.equal(await page.locator('#turn-log li').count(),12);
  await page.keyboard.press('Escape');
  assert.deepEqual(errors,[]);
  results.push({seededCompleteMatchCycles:cycles,keyboard:true,restWithoutRoll:true,allTokensVisible:true,errors});
  const idlePage=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'no-preference'});
  idlePage.on('pageerror',error=>errors.push(error.message));
  await idlePage.addInitScript(()=>localStorage.setItem('ocago:welcomed','1'));
  await idlePage.goto(url);await idlePage.waitForTimeout(300);
  const idleAnimations=()=>idlePage.evaluate(()=>document.getAnimations().filter(animation=>animation.animationName?.startsWith('oca-idle-')).map(animation=>({name:animation.animationName,state:animation.playState})));
  await idlePage.evaluate(()=>crypto.getRandomValues=array=>{array[0]=0;return array;});
  await idlePage.locator('#roll').click();await idlePage.waitForTimeout(100);
  assert(await idlePage.locator('#dice').evaluate(el=>el.getAnimations().length>0),'Ordinary roll must animate');
  await idlePage.locator('#restart').click();await idlePage.locator('#confirm-restart').click();await idlePage.waitForTimeout(1600);
  assert.deepEqual(await idlePage.locator('#players .player b').allTextContents(),['0/63','0/63','0/63']);
  assert.equal(await idlePage.locator('#dice').evaluate(el=>el.getAnimations().length),0);
  const awake=await idleAnimations();assert(awake.length>=2&&awake.length<=6,'Restrained idle art must actually animate');assert(awake.every(animation=>animation.state==='running'));
  await idlePage.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));});
  assert(await idlePage.locator('.idle-scene').evaluate(el=>el.classList.contains('idle-paused')));
  assert((await idleAnimations()).every(animation=>animation.state==='paused'),'Simulated hidden state must pause idle');
  await idlePage.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'));});
  await idlePage.emulateMedia({reducedMotion:'reduce'});await idlePage.waitForTimeout(50);
  assert.equal((await idleAnimations()).length,0,'Reduced motion must disable idle');
  results.push({idleRunning:awake.length,simulatedHiddenPauses:true,reducedMotionStopsIdle:true});
  await idlePage.close();assert.deepEqual(errors,[]);
  console.log(JSON.stringify(results,null,2));
  await browser.close();
})().catch(error => {console.error(error);process.exit(1);});
