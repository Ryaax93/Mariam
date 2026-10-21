import * as T from '../vendor/three.module.js';
import {SkateSession,FixedClock,validateRun} from './simulation.js';
import {center,slope,worldPoint,LENGTH,SAVE_KEY,BPM,GATES} from './track.js';
import {MariamRig} from './character.js';
import {LunaWorld} from './world.js';
import {FollowCamera,SightCorridor} from './camera.js';
import {LunaAudio} from './audio.js';
import {bindControls} from './controls.js';
const $=id=>document.getElementById(id), audio=new LunaAudio(),clock=new FixedClock();
let renderer,scene,camera,world,avatar,follow,sight,session,mode='welcome',last=0,toastUntil=0,saveAt=0,portrait=false;
let options={quality:'normal',music:true,soft:matchMedia('(prefers-reduced-motion: reduce)').matches},record=null,saved=null,storageOK=true;
let controls;const frames=[],errorMessages=[];
try{const v=JSON.parse(localStorage.getItem(SAVE_KEY)||'null');if(v?.version===1){saved=validateRun(v.run);if(v.options){options.quality=v.options.quality==='low'?'low':'normal';options.music=v.options.music!==false;options.soft=typeof v.options.soft==='boolean'?v.options.soft:options.soft;}if(Number.isFinite(v.record?.score)&&v.record.score>=0&&Number.isFinite(v.record?.time)&&v.record.time>=0)record=v.record;}}catch{storageOK=false;}
function toast(text){$('toast').textContent=text;$('toast').classList.add('show');toastUntil=performance.now()+2600;}
function clearInput(){controls?.clear();}
function input(){return controls?.read()||{forward:0,steer:0,jump:false,boost:false};}
function persist(){
 if(!session)return;
 if(['playing','pause'].includes(mode)&&['playing','paused'].includes(session.status)&&session.hp>0)saved=session.snapshot();
 try{localStorage.setItem(SAVE_KEY,JSON.stringify({version:1,run:saved,options,record}));storageOK=true;}catch{if(storageOK)toast('Le navigateur ne peut pas garder cette partie.');storageOK=false;}
}
function ui(next){
 mode=next;clearInput();clock.reset();
 for(const [id,visible] of [['welcome',next==='welcome'],['hud',next==='playing'||next==='pause'],['controls',next==='playing'],['beat',next==='playing'],['pauseScreen',next==='pause'],['result',next==='result']])$(id).hidden=!visible;
 if(next==='welcome')$('continue').hidden=!saved;
}
function event(kind,data){
 audio.effect(kind,data);
 if(kind==='note')toast(data.perfect?'Dans le rythme ! +75 ♫':'Jolie trajectoire ♫');
 if(kind==='checkpoint'){persist();toast('Un petit repère, pour revenir ici.');}
 if(kind==='jump'){}
 if(kind==='land'&&data)toast(data.label+' · +'+data.points+(data.fresh?' · Nouvelle figure !':''));
 if(kind==='rose')toast('Une rose pour toi · +250');
 if(kind==='bump')toast('Oups ! Un petit coup de frein.');
 if(kind==='fall'){if(session.hp<=0)saved=null;persist();toast('Je garde ta place. On repart ensemble.');}
 if(kind==='respawn'){follow.reset();persist();}
 if(kind==='win'||kind==='lose'){
  saved=null;
  if(kind==='win'){if(!record||session.score>record.score)record={score:session.score,time:session.elapsed,notes:session.notes.size};}
  persist();ui('result');audio.stop();if(kind==='win')audio.effect('win');
  $('resultLabel').textContent=kind==='win'?'NOTRE PREMIÈRE ÉTOILE':'CE N’EST QU’UN PETIT DÉTOUR';
  $('resultTitle').innerHTML=kind==='win'?'Tu fais tourner<br>mon monde.':'Encore une<br>petite chance ?';
  $('resultText').textContent=kind==='win'?'Tout a commencé par ton commentaire pendant mon live. Un message, puis nous. Et maintenant, c’est tout un petit monde qui s’allume pour toi.':'Tes souvenirs sont toujours là. La piste sera encore plus douce au prochain tour.';
  $('resultScore').textContent=kind==='win'?'★'.repeat(session.medal)+'  '+session.score+' points · '+session.notes.size+'/12 notes · '+session.figures.size+'/5 figures · '+session.roses.size+'/3 roses':'♥ On recommence ensemble';
 }
}
function start(resume=false){
 frames.length=0;clock.dropped=0;clock.steps=0;
 audio.enabled=options.music;audio.unlock();session=new SkateSession(event);if(resume&&saved)session.restore(saved);session.start();follow.reset();ui('playing');last=performance.now();saveAt=0;checkOrientation();toast('Pousse vers le haut pour glisser. Les notes sont à toi.');
}
function pause(){if(mode!=='playing')return;session.pause();audio.stop();ui('pause');persist();}
function resume(){if(portrait)return;audio.unlock();session.start();ui('playing');last=performance.now();}
function home(){if(mode==='playing')session.pause();persist();audio.stop();session=new SkateSession(event);ui('welcome');follow.reset();}
function checkOrientation(){
 portrait=innerHeight>innerWidth&&matchMedia('(pointer:coarse)').matches;
 $('rotate').hidden=!portrait;
 if(portrait&&mode==='playing')pause();
 resize();
}
function resize(){if(!renderer)return;camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setPixelRatio(Math.min(devicePixelRatio||1,options.quality==='low'?1:1.5));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=options.quality!=='low';}
function fail(e){const message=e?.message||String(e);errorMessages.push(message);$('errorText').textContent='Le rendu 3D a rencontré un problème : '+message;$('error').hidden=false;$('loading').hidden=true;audio.stop();if(session)session.pause();clearInput();}
function setupInput(){
 controls=bindControls({stick:$('stick'),jump:$('jump'),boost:$('boost')},()=>mode==='playing'&&!portrait);
 document.addEventListener('keydown',e=>{if(e.code==='Escape')mode==='playing'?pause():mode==='pause'?resume():null;});
 $('start').onclick=()=>start();$('continue').onclick=()=>start(true);$('pause').onclick=pause;$('resume').onclick=resume;$('restart').onclick=()=>start();$('again').onclick=()=>start();$('home').onclick=home;$('resultHome').onclick=home;
 $('music').checked=options.music;$('soft').checked=options.soft;$('quality').value=options.quality;
 $('music').onchange=e=>{options.music=e.target.checked;audio.setEnabled(options.music);persist();};$('soft').onchange=e=>{options.soft=e.target.checked;persist();};$('quality').onchange=e=>{options.quality=e.target.value;resize();persist();};
 window.addEventListener('blur',()=>{clearInput();pause();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){pause();persist();audio.suspend();}});
 window.addEventListener('pagehide',persist);window.addEventListener('resize',()=>{clearInput();checkOrientation();});window.addEventListener('orientationchange',()=>{clearInput();pause();checkOrientation();});
}
const bodyPoint=new T.Vector3();let marker;
function animate(now){
 const raw=last?(now-last)/1000:0;last=now;const dt=Math.min(raw,.1);
 if(raw>0&&mode==='playing'){frames.push(raw*1000);if(frames.length>900)frames.shift();}
 if(mode==='playing'&&!portrait)clock.advance(raw,session,input());
 if(mode==='playing'&&now-saveAt>2500){persist();saveAt=now;}
 const p=worldPoint(session.s,session.lane,session.y);avatar.root.position.set(p.x,p.y+.015,p.z);
 const heading=Math.atan2(slope(session.s)*Math.max(1,session.v)+session.vl,-Math.max(1,session.v));
 avatar.animate(mode==='pause'?0:dt,session,mode==='welcome'?0:heading);
 if(mode==='welcome'){
  const t=options.soft?0:now*.00009;camera.position.set(3.6+Math.sin(t)*.35,2.15,5.1);camera.lookAt(-1.1,1.35,-1.5);camera.updateMatrixWorld();follow.initial=false;
 }else follow.update(dt,session,options.soft);
 world.update(mode==='pause'?0:dt,session,options.quality==='low');
 audio.tick(mode==='playing'&&!portrait,session.s/LENGTH,session.elapsed);
 bodyPoint.set(p.x,p.y+1.2,p.z);sight.update(renderer,camera,bodyPoint,mode==='welcome'?bodyPoint:follow.landing,dt);
 marker.visible=mode==='playing'&&!session.grounded&&session.y>0;
 marker.position.copy(follow.landing);
 $('score').textContent=session.score+' pts';$('collection').textContent=session.figures.size+'/5 figures · '+session.roses.size+'/3 roses';
 $('notes').textContent='♫ '+session.notes.size+' / 12';$('hearts').textContent='♥ '.repeat(Math.max(0,session.hp)).trim();
 $('objective').textContent=session.s<30?'Glisse vers les notes':session.s<100?'Trouve ton rythme':session.s<125?'Un saut… ou la voie de côté':session.s<185?'La promenade des étoiles':'La dernière lumière est pour toi';
 $('beat').firstElementChild.style.transform='scale('+(1+Math.pow(1-(session.elapsed*BPM/60%1),4)*.6)+')';
 if(now>toastUntil)$('toast').classList.remove('show');
 renderer.render(scene,camera);requestAnimationFrame(animate);
}
try{
 renderer=new T.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;renderer.shadowMap.type=T.PCFSoftShadowMap;$('scene').append(renderer.domElement);
 scene=new T.Scene();camera=new T.PerspectiveCamera(48,innerWidth/innerHeight,.1,450);world=new LunaWorld(scene);avatar=new MariamRig();scene.add(avatar.root);follow=new FollowCamera(camera);sight=new SightCorridor();
 for(const object of world.occluders)sight.attach(object);
 marker=new T.Mesh(new T.RingGeometry(.6,.67,28),new T.MeshBasicMaterial({color:0xfff2bf,transparent:true,opacity:.8,depthWrite:false}));marker.rotation.x=-Math.PI/2;scene.add(marker);
 session=new SkateSession(event);setupInput();ui('welcome');checkOrientation();$('loading').hidden=true;
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();pause();persist();fail(new Error('La mémoire graphique a été interrompue. Recharge pour reprendre au dernier repère.'));});
 window.addEventListener('error',e=>errorMessages.push(e.message));
 // Read-only diagnostics; no teleport, forced victory, or input injection in production.
 window.mariamLuna=()=>{
  const sorted=[...frames].sort((a,b)=>a-b),pick=q=>sorted[Math.floor((sorted.length-1)*q)]||0;
  const screen=point=>{const p=point.clone().project(camera);return {x:p.x,y:p.y,z:p.z};};
  return {version:'luna-v2',mode,portrait,state:{s:session.s,lane:session.lane,y:session.y,v:session.v,vl:session.vl,vy:session.vy,grounded:session.grounded,status:session.status,time:session.time,elapsed:session.elapsed,hp:session.hp,notes:[...session.notes],passed:[...session.passed],checkpoint:session.checkpoint,score:session.score,falls:session.falls,hits:session.hits,trickName:session.trickName,trickPhase:session.trickPhase,figures:[...session.figures],roses:[...session.roses]},input:input(),contacts:controls.diagnostics(),rig:avatar.stats,render:{calls:renderer.info.render.calls,triangles:renderer.info.render.triangles,geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures,width:renderer.domElement.width,height:renderer.domElement.height},camera:{body:screen(bodyPoint),landing:screen(follow.landing),position:camera.position.toArray(),faded:sight.faded},performance:{frames:frames.length,p50:pick(.5),p95:pick(.95),fps:frames.length?1000/(frames.reduce((a,b)=>a+b,0)/frames.length):0,droppedSimulation:clock.dropped},save:!!saved,storageOK,audio:{state:audio.ctx?.state||'locked',enabled:audio.enabled,notes:audio.nodes.size,steps:audio.step},errors:[...errorMessages]};
 };
 // Explicit camera regression fixture, only when requested in a test URL.
 if(new URLSearchParams(location.search).has('camera-test')){
  const obstacle=new T.Mesh(new T.TorusGeometry(2.7,.6,12,60),new T.MeshStandardMaterial({color:0xc05e99,roughness:.5}));obstacle.position.set(2.7,2,3.5);scene.add(obstacle);obstacle.userData.cameraOccluder=true;obstacle.name='Décor de contrôle';sight.attach(obstacle);sight.enabled.value=new URLSearchParams(location.search).get('camera-test')==='before'?0:1;
 }
 requestAnimationFrame(animate);
}catch(e){fail(e);}
