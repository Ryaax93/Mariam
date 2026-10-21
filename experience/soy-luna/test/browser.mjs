import {chromium,webkit} from 'playwright';
import http from 'node:http';
import path from 'node:path';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const root=path.resolve('.'),out=path.join(root,'soy-luna/evidence');await fs.mkdir(out,{recursive:true});
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.woff':'font/woff','.svg':'image/svg+xml','.json':'application/json','.webmanifest':'application/manifest+json','.webp':'image/webp'};
const server=http.createServer(async(req,res)=>{try{const u=new URL(req.url,'http://localhost'),pathname=decodeURIComponent(u.pathname);let p=path.resolve(root,'.'+pathname);if(!p.startsWith(root+path.sep)&&p!==root)throw Error('Forbidden');if((await fs.stat(p)).isDirectory())p=path.join(p,'index.html');res.setHeader('Content-Type',mime[path.extname(p)]||'application/octet-stream');res.end(await fs.readFile(p));}catch{res.statusCode=404;res.end('missing');}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port+'/soy-luna/';
const report={source:process.env.GITHUB_SHA||'local',platform:process.platform,note:'Linux browsers / software GPU, not physical iPhone Safari',checks:[],errors:[],captures:[],measurements:[]};
let browser;function check(name,condition,details){report.checks.push({name,pass:!!condition,...(details?{details}:{})});if(!condition)throw Error(name);}
async function shot(page,name){const bytes=await page.screenshot({path:path.join(out,name+'.jpg'),type:'jpeg',quality:75});report.captures.push(name+'.jpg');if(['welcome','skating','camera-before','camera-after','character-front'].includes(name))console.log('LUNA_IMAGE '+name+' '+bytes.toString('base64')+' END_LUNA_IMAGE');}
try{
 browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const context=await browser.newContext({viewport:{width:852,height:393},deviceScaleFactor:1,hasTouch:true,isMobile:true});
 const page=await context.newPage();page.on('pageerror',e=>report.errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')report.errors.push(m.text());});
 await page.goto(url);await page.waitForFunction(()=>!!window.mariamLuna);await page.waitForTimeout(1300);check('boot WebGL',!(await page.locator('#error').isVisible()));
 await shot(page,'welcome');
 const legacy={'mariam-worlds-adventure-v1':'{"records":{"0":{"stars":2,"time":14,"coins":3}}}','mariam-worlds-checkpoint-v2':'{"version":2,"level":0,"checkpoint":0,"hp":3,"time":0,"elapsed":0,"falls":0,"hits":0,"coins":[],"relics":[]}','mariam-little-world-v1':'{"test":"keep"}'};
 await page.evaluate(data=>Object.entries(data).forEach(([k,v])=>localStorage.setItem(k,v)),legacy);
 await page.locator('#start').click();await page.keyboard.down('ArrowUp');try{await page.waitForFunction(()=>mariamLuna().state.s>4,null,{timeout:20000});}catch{report.measurements.push({scenario:'movement-timeout',...await page.evaluate(()=>mariamLuna())});}await page.keyboard.up('ArrowUp');
 let d=await page.evaluate(()=>mariamLuna());check('forward movement',d.state.s>4,d);check('rig is skinned',d.rig.bones===20&&d.rig.skinnedMeshes>=5);check('original soundtrack scheduled after gesture',d.audio.state==='running'&&d.audio.steps>2&&d.audio.notes>0,d.audio);
 await page.keyboard.down('Space');try{await page.waitForFunction(()=>mariamLuna().state.y>.1,null,{timeout:12000});}catch{}d=await page.evaluate(()=>mariamLuna());check('jump above ground',d.state.y>.1,d.state);await page.keyboard.up('Space');await page.waitForFunction(()=>mariamLuna().state.grounded,null,{timeout:12000});
 await shot(page,'skating');
 await page.locator('#pause').click();const before=await page.evaluate(()=>mariamLuna().state);await page.waitForTimeout(300);const after=await page.evaluate(()=>mariamLuna().state);check('pause freezes simulation',before.s===after.s&&before.time===after.time);
 await page.locator('#quality').selectOption('low');await page.locator('#resume').click();
 // Real two-finger CDP touch. Read state only; gameplay is never teleported.
 const cdp=await context.newCDPSession(page),stick=await page.locator('#stick').boundingBox(),jump=await page.locator('#jump').boundingBox();
 const a={x:stick.x+stick.width/2,y:stick.y+10,id:1},b={x:jump.x+jump.width/2,y:jump.y+jump.height/2,id:2};
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[a]});await page.waitForTimeout(250);
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[a,b]});await page.waitForTimeout(120);
 d=await page.evaluate(()=>mariamLuna());check('two-finger steering and jump',d.input.forward>.5&&d.input.jump);
 await cdp.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});await page.waitForTimeout(60);
 d=await page.evaluate(()=>mariamLuna());check('touch cancel clears input',d.input.forward===0&&!d.input.jump);
 await page.locator('#pause').click();await page.locator('#restart').click();
 const held=new Set();async function press(code,want){if(want&&!held.has(code)){await page.keyboard.down(code);held.add(code);}else if(!want&&held.has(code)){await page.keyboard.up(code);held.delete(code);}}
 const deadline=Date.now()+180000;let checkpoints=0,reloaded=false,fallChecked=false;
 while(Date.now()<deadline){
  d=await page.evaluate(()=>mariamLuna());if(d.state.status==='won'||d.state.status==='lost')break;
  const g=(await import('../track.js')).GATES.find(g=>!d.state.passed.includes(g.id));let target=g?.lane||0;
  if(d.state.s>114&&d.state.s<123)target=0;
  const steer=(target-d.state.lane)*1.8-d.state.vl*.7;
  await press('ArrowUp',true);await press('ArrowLeft',steer<-.28);await press('ArrowRight',steer>.28);await press('Space',d.state.s>114.7&&d.state.s<116);
  if(d.state.checkpoint>checkpoints){checkpoints=d.state.checkpoint;await shot(page,'checkpoint-'+checkpoints);}
  if(d.state.checkpoint===74&&!reloaded){
   for(const k of [...held])await press(k,false);
   await page.locator('#pause').click();const savedState=await page.evaluate(()=>mariamLuna().state);
   await page.reload();await page.waitForFunction(()=>!!window.mariamLuna);check('continue offered after reload',await page.locator('#continue').isVisible());await page.locator('#continue').click();
   const resumed=await page.evaluate(()=>mariamLuna().state);check('reload resumes checkpoint and collected notes',Math.abs(resumed.s-74)<.05&&resumed.hp===savedState.hp&&JSON.stringify(resumed.notes)===JSON.stringify(savedState.notes));
   reloaded=true;continue;
  }
  if(d.state.checkpoint===144&&!fallChecked){
   for(const k of [...held])await press(k,false);const hp=d.state.hp,falls=d.state.falls;
   await press('ArrowRight',true);const end=Date.now()+12000;
   while(Date.now()<end){d=await page.evaluate(()=>mariamLuna());if(d.state.falls>falls)break;await page.waitForTimeout(60);}
   await press('ArrowRight',false);check('steering off edge charges exactly one heart',d.state.falls===falls+1&&d.state.hp===hp-1);
   await page.waitForFunction(()=>mariamLuna().state.s===144&&mariamLuna().state.y===0,null,{timeout:8000});d=await page.evaluate(()=>mariamLuna());check('fall returns to checkpoint with camera',d.state.hp===hp-1&&Math.abs(d.camera.body.x)<1&&Math.abs(d.camera.body.y)<1);
   await shot(page,'respawn-144');fallChecked=true;continue;
  }
  await page.waitForTimeout(50);
 }
 for(const k of held)await page.keyboard.up(k);
 check('checkpoint reload and fall exercised',reloaded&&fallChecked);check('full course won by keyboard events',d.state.status==='won',d.state);check('course collects notes',d.state.notes.length>=8);
 await shot(page,'finish');report.measurements.push({scenario:'full-course-low',...d});
 const preserved=await page.evaluate(data=>Object.entries(data).every(([k,v])=>localStorage.getItem(k)===v),legacy);check('three legacy save strings unchanged',preserved);
 for(const [w,h] of [[667,375],[932,430],[393,852]]){
  await page.setViewportSize({width:w,height:h});await page.waitForTimeout(250);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);check('no overflow '+w+'x'+h,!overflow);check('rotate message '+w+'x'+h,await page.locator('#rotate').isVisible()===(h>w));await shot(page,'viewport-'+w+'x'+h);
 }
 await page.setViewportSize({width:852,height:393});await page.goto(url+'?camera-test=before');await page.waitForFunction(()=>!!window.mariamLuna);await page.locator('#start').click();await page.waitForTimeout(500);await page.locator('#pause').click();await page.locator('#pauseScreen').evaluate(e=>e.style.visibility='hidden');await shot(page,'camera-before');
 await page.goto(url+'?camera-test=after');await page.waitForFunction(()=>!!window.mariamLuna);await page.locator('#start').click();await page.waitForTimeout(500);await page.locator('#pause').click();await page.locator('#pauseScreen').evaluate(e=>e.style.visibility='hidden');await shot(page,'camera-after');
 d=await page.evaluate(()=>mariamLuna());report.measurements.push({scenario:'camera-fixture',...d});check('body and landing framed',Math.abs(d.camera.body.x)<1&&Math.abs(d.camera.body.y)<1&&Math.abs(d.camera.landing.x)<1&&Math.abs(d.camera.landing.y)<1);
 // Static detailed real-3D front/profile/back capture uses a dedicated viewer, not gameplay proof.
 await page.goto(url+'test/character.html');await page.waitForFunction(()=>window.rigReviewReady);await shot(page,'character-front');
 for(const [name,angle] of [['profile',Math.PI/2],['back',Math.PI]]){await page.evaluate(a=>window.setReviewAngle(a),angle);await page.waitForTimeout(120);await shot(page,'character-'+name);}
 await context.close();await browser.close();browser=null;
 try{
  const wb=await webkit.launch();const wc=await wb.newContext({viewport:{width:852,height:393},hasTouch:true,isMobile:true});const wp=await wc.newPage();const errors=[];wp.on('pageerror',e=>errors.push(String(e)));await wp.goto(url);await wp.waitForFunction(()=>!!window.mariamLuna,{timeout:20000});await wp.locator('#start').click();await wp.keyboard.down('ArrowUp');await wp.waitForTimeout(1500);await wp.keyboard.up('ArrowUp');const wd=await wp.evaluate(()=>mariamLuna());report.checks.push({name:'WebKit Linux movement',pass:wd.state.s>1&&errors.length===0,details:errors});await shot(wp,'webkit-linux');await wb.close();
 }catch(e){report.checks.push({name:'WebKit Linux',pass:false,blocked:String(e)});}
 check('no Chromium JavaScript / shader errors',report.errors.length===0,report.errors);
}catch(e){report.failure=String(e);process.exitCode=1;}finally{
 if(browser)await browser.close();server.close();await fs.writeFile(path.join(out,'browser.json'),JSON.stringify(report,null,2));console.log('LUNA_BROWSER_REPORT '+JSON.stringify(report));
}
