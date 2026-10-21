import {FIGURES,chooseFigure,ROSES,SWEEPERS,sweeperLane} from './tricks.js';
import {LENGTH,clamp,floor,GATES,CHECKPOINTS,OBSTACLES,beatDistance,width} from './track.js';
export class SkateSession{
 constructor(event=()=>{}){this.event=event;this.s=0;this.lane=0;this.y=0;this.v=0;this.vl=0;this.vy=0;this.grounded=true;this.time=0;this.elapsed=0;this.status='ready';this.hp=3;this.falls=0;this.hits=0;this.score=0;this.combo=0;this.notes=new Set();this.passed=new Set();this.checkpoint=0;this.invulnerable=0;this.recover=0;this.lastJump=false;this.jumpBuffer=0;this.coyote=.12;this.trick=0;this.landing=0;this.distance=0;this.events=[];this.trickName='rotation';this.trickPhase=0;this.airTime=0;this.trickHold=0;this.flightDuration=1;this.figures=new Set();this.trickSectors=new Set();this.roses=new Set();this.lastTrick=null;}
 start(){if(this.status==='ready'||this.status==='paused')this.status='playing';}
 pause(){if(this.status==='playing')this.status='paused';}
 step(dt,input={}){
  if(this.status!=='playing')return;
  this.time+=dt;this.invulnerable=Math.max(0,this.invulnerable-dt);this.landing=Math.max(0,this.landing-dt);
  if(this.recover>0){this.recover-=dt;if(this.recover<=0)this.respawn();return;}
  const jump=!!input.jump;
  if(jump&&!this.lastJump)this.jumpBuffer=.14;else this.jumpBuffer=Math.max(0,this.jumpBuffer-dt);
  this.lastJump=jump;this.coyote=this.grounded?.12:Math.max(0,this.coyote-dt);
  const thrust=clamp(input.forward||0,-1,1),steer=clamp(input.steer||0,-1,1);
  const target=thrust>=0?thrust*(input.boost?10.5:7.6):thrust*3.4;
  const response=thrust<0?6:Math.abs(thrust)>.1?2.4:.55;
  this.v+=(target-this.v)*(1-Math.exp(-response*dt));
  this.vl+=(steer*(2.5+Math.abs(this.v)*.34)-this.vl)*(1-Math.exp(-(this.grounded?4.5:2.1)*dt));
  if(this.jumpBuffer>0&&this.coyote>0){this.vy=6.5;this.grounded=false;this.coyote=0;this.jumpBuffer=0;this.trick=0;this.trickPhase=0;this.trickHold=0;this.airTime=0;this.flightDuration=(this.vy+Math.sqrt(this.vy*this.vy+34*Math.max(0,this.y)))/17;this.trickName=chooseFigure(input,this.v,beatDistance(this.elapsed)<.2);this.event('jump');}
  const oldS=this.s,oldY=this.y;
  this.s=clamp(this.s+this.v*dt,-4,LENGTH+2);this.lane+=this.vl*dt;
  this.distance+=Math.abs(this.s-oldS);
  const ground=floor(this.s,this.lane);
  if(this.grounded&&ground!==null&&ground>=oldY-.25){this.y=ground;this.vy=0;}
  else{
   if(this.grounded){this.grounded=false;if(oldS<=116&&this.s>116&&oldY>1)this.vy=Math.max(2.8,this.v*.19);}
   this.vy-=17*dt;this.y+=this.vy*dt;
   if(ground!==null&&this.vy<=0&&oldY>=ground-.12&&this.y<=ground){
    this.y=ground;this.vy=0;this.grounded=true;this.landing=.4;
    const sector=Math.floor(this.s/8),valid=this.trickHold>.16&&!this.trickSectors.has(sector);let result=null;
    if(valid){const f=FIGURES[this.trickName],fresh=!this.figures.has(this.trickName),points=f.points+(fresh?75:0);this.score+=points;this.trickSectors.add(sector);this.figures.add(this.trickName);result={name:this.trickName,label:f.label,points,fresh};this.lastTrick=result;}
    this.event('land',result);
   }
  }
  if(!this.grounded){this.airTime+=dt;if(jump&&this.y>.2)this.trickHold+=dt;if(this.trickHold>.12){this.trickPhase=clamp(this.airTime/this.flightDuration,0,1);this.trick=this.trickPhase;}}
  if(this.y< -4){this.fall();return;}
  for(const h of [...OBSTACLES,...SWEEPERS.map(h=>({s:h.s,lane:sweeperLane(h,this.time),r:.55}))]){
   if(this.invulnerable===0&&Math.hypot(this.s-h.s,this.lane-h.lane)<h.r+.3&&this.y<.65){this.v*=.35;this.vl=this.lane<h.lane?-2:2;this.invulnerable=1.5;this.combo=0;this.hits++;this.event('bump');}
  }
  for(const r of ROSES)if(!this.roses.has(r.id)&&Math.hypot(this.s-r.s,this.lane-r.lane)<1.05&&this.y<2){this.roses.add(r.id);this.score+=250;this.event('rose',r.id);}
  for(const g of GATES){
   if(oldS<g.s&&this.s>=g.s&&!this.passed.has(g.id)){
    this.passed.add(g.id);
    if(Math.abs(this.lane-g.lane)<1.45&&this.y<2.5){
     this.notes.add(g.id);this.combo++;const perfect=beatDistance(this.elapsed)<.18;
     this.score+=100+Math.min(5,this.combo)*20+(perfect?75:0);
     this.event('note',{id:g.id,perfect});
    }else{this.combo=0;this.event('miss',g.id);}
   }
  }
  for(const cp of CHECKPOINTS)if(this.s>=cp&&cp>this.checkpoint&&this.grounded){this.checkpoint=cp;this.event('checkpoint');}
  if(this.s>=LENGTH&&this.grounded){this.status='won';this.score+=Math.max(0,800-Math.floor(this.elapsed*5));this.event('win');}
 }
 fall(){
  if(this.recover>0||this.status!=='playing')return;
  this.hp--;this.falls++;this.combo=0;this.v=this.vl=this.vy=0;this.recover=1.1;
  this.event('fall',this.hp);
 }
 respawn(){
  if(this.hp<=0){this.status='lost';this.event('lose');return;}
  this.s=this.checkpoint;this.lane=0;this.y=0;this.v=this.vl=this.vy=0;this.grounded=true;this.invulnerable=2;this.lastJump=false;this.jumpBuffer=0;this.trickPhase=this.trick=this.trickHold=0;this.event('respawn');
 }
 get medal(){return 1+(this.notes.size>=8?1:0)+(this.notes.size===12&&this.falls===0?1:0);}
 snapshot(){return {version:1,checkpoint:this.checkpoint,hp:this.hp,time:this.time,elapsed:this.elapsed,score:this.score,notes:[...this.notes],passed:[...this.passed],falls:this.falls,hits:this.hits,figures:[...this.figures],trickSectors:[...this.trickSectors],roses:[...this.roses]};}
 restore(value){
  const x=validateRun(value);if(!x)return false;
  Object.assign(this,x);this.notes=new Set(x.notes);this.passed=new Set(x.passed);this.figures=new Set(x.figures);this.trickSectors=new Set(x.trickSectors);this.roses=new Set(x.roses);this.recover=0;this.respawn();this.status='ready';return true;
 }
}
export function validateRun(v){
 if(!v||v.version!==1||!CHECKPOINTS.includes(v.checkpoint)||!Number.isInteger(v.hp)||v.hp<1||v.hp>3)return null;
 for(const k of ['time','elapsed','score','falls','hits'])if(!Number.isFinite(v[k])||v[k]<0||v[k]>1e7)return null;
 if(!Number.isInteger(v.falls)||!Number.isInteger(v.hits)||!Number.isInteger(v.score))return null;
 for(const key of ['notes','passed'])if(!Array.isArray(v[key])||v[key].some(n=>!Number.isInteger(n)||n<0||n>=GATES.length)||new Set(v[key]).size!==v[key].length)return null;
 if(v.notes.some(n=>!v.passed.includes(n)))return null;
 const figures=Array.isArray(v.figures)?[...new Set(v.figures.filter(n=>Object.hasOwn(FIGURES,n)))]:[],trickSectors=Array.isArray(v.trickSectors)?[...new Set(v.trickSectors.filter(n=>Number.isInteger(n)&&n>=-1&&n<=28))]:[],roses=Array.isArray(v.roses)?[...new Set(v.roses.filter(n=>Number.isInteger(n)&&n>=0&&n<3))]:[];
 return {version:1,checkpoint:v.checkpoint,hp:v.hp,time:v.time,elapsed:v.elapsed,score:v.score,notes:[...v.notes],passed:[...v.passed],falls:v.falls,hits:v.hits,figures,trickSectors,roses};
}
export class FixedClock{
 constructor(){this.accumulator=0;this.dropped=0;this.steps=0;}
 advance(delta,session,input){
  if(session.status!=='playing'){this.accumulator=0;return;}
  const real=Math.max(0,Number.isFinite(delta)?delta:0);session.elapsed+=real;
  this.accumulator+=Math.min(real,.25);
  if(real>.25)this.dropped+=real-.25;
  let count=0;
  while(this.accumulator>=1/120&&count<30){session.step(1/120,input);this.accumulator-=1/120;count++;this.steps++;}
 }
 reset(){this.accumulator=0;}
}
