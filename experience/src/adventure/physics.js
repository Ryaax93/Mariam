// Deterministic gameplay model, independent of rendering. Y is the player's feet.
export class Session {
 constructor(level,onEvent=()=>{}){this.level=level;this.event=onEvent;this.time=0;this.coins=new Set();this.relics=new Set();this.hp=3;this.falls=0;this.hits=0;this.status='playing';this.checkpoint=0;this.cooldown=0;this.invulnerable=0;this.jumpBuffer=0;this.coyote=0;this.dash=0;this.boost=0;this.lastJump=false;this.lastDash=false;this.player={x:0,y:.04,z:1,vx:0,vy:0,vz:0,ground:0,facing:Math.PI};this.platforms=level.platforms.map(p=>({...p,baseX:p.x,baseZ:p.z,dx:0,dz:0}));this.hazards=[];this.goalLockedAt=-10;}
 step(dt,input={x:0,z:0,jump:false,dash:false}){
  if(this.status!=='playing')return;dt=Math.min(dt,.025);this.time+=dt;const p=this.player;
  this.cooldown=Math.max(0,this.cooldown-dt);this.invulnerable=Math.max(0,this.invulnerable-dt);this.dash=Math.max(0,this.dash-dt);this.boost=Math.max(0,this.boost-dt);
  this.platforms.forEach(b=>{const ox=b.x,oz=b.z;if(b.kind==='moving')b[b.axis]=b['base'+b.axis.toUpperCase()]+Math.sin(this.time*b.speed)*b.range;b.dx=b.x-ox;b.dz=b.z-oz;});
  if(p.ground>=0){const b=this.platforms[p.ground];p.x+=b.dx;p.z+=b.dz;this.coyote=.13;if(b.kind==='boost')this.boost=.8;if(b.kind==='conveyor')p.x+=1.7*dt;}else this.coyote-=dt;
  if(input.jump&&!this.lastJump)this.jumpBuffer=.16;else this.jumpBuffer-=dt;
  this.lastJump=input.jump;
  if(input.dash&&!this.lastDash&&this.cooldown===0){this.dash=.23;this.cooldown=1.6;this.event('dash');}
  this.lastDash=input.dash;
  let ix=input.x||0,iz=input.z||0;const length=Math.hypot(ix,iz);if(length>1){ix/=length;iz/=length;}
  if(length>.08)p.facing=Math.atan2(ix,iz);
  if(this.dash>0&&length<.1){ix=Math.sin(p.facing);iz=Math.cos(p.facing);}
  const kind=p.ground>=0?this.platforms[p.ground].kind:'air';
  const speed=this.dash>0?12.5:this.boost>0?8.4:6.1;
  const response=kind==='ice'?4.4:p.ground<0?10:15;
  const blend=1-Math.exp(-response*dt);p.vx+=(ix*speed-p.vx)*blend;p.vz+=(iz*speed-p.vz)*blend;
  if(this.jumpBuffer>0&&this.coyote>0){p.vy=9.7;p.ground=-1;this.jumpBuffer=0;this.coyote=0;this.event('jump');}
  const oldY=p.y;p.x+=p.vx*dt;p.z+=p.vz*dt;p.vy-=23*dt;p.y+=p.vy*dt;p.ground=-1;
  if(p.vy<=0)for(let j=0;j<this.platforms.length;j++){const b=this.platforms[j];if(Math.abs(p.x-b.x)<b.w/2+.12&&Math.abs(p.z-b.z)<b.d/2+.12&&oldY>=b.y-.12&&p.y<=b.y+.04){p.y=b.y;p.vy=0;p.ground=j;if(b.kind==='bounce'&&Math.hypot(p.x-b.x,p.z-b.z)<1){p.vy=14;p.ground=-1;this.cooldown=0;this.event('bounce');}if(j>=this.level.checkpoint&&this.checkpoint===0){this.checkpoint=this.level.checkpoint;this.event('checkpoint');}break;}}
  if(p.y<-6){this.falls++;this.damage(true);return;}
  this.hazards=this.level.hazards.map(h=>{const b=this.platforms[h.platform],pos={...h,x:b.x+h.x,y:b.y,z:b.z+h.z};pos[h.axis]+=Math.sin(this.time*h.speed+h.platform)*h.range;return pos;});
  if(this.invulnerable<=0)for(const h of this.hazards){if(Math.hypot(p.x-h.x,p.z-h.z)<h.r+.32&&p.y<h.y+.85&&p.y>h.y-.4){this.hits++;this.damage(false);break;}}
  this.level.coins.forEach((c,j)=>{if(this.coins.has(j))return;const b=this.platforms[c.platform];if(Math.hypot(p.x-b.x-c.x,p.z-b.z-c.z)<.85&&Math.abs(p.y-b.y-.5)<1.7){this.coins.add(j);this.event('coin',j);}});
  this.level.relics.forEach((c,j)=>{if(this.relics.has(j))return;const b=this.platforms[c.platform];if(Math.hypot(p.x-b.x-c.x,p.z-b.z-c.z)<1&&Math.abs(p.y-b.y-.7)<2){this.relics.add(j);this.event('relic',j);}});
  const g=this.level.goal,b=this.platforms[g.platform];if(Math.hypot(p.x-b.x-g.x,p.z-b.z-g.z)<1.25&&p.ground===g.platform){if(this.relics.size===3){this.status='won';this.event('win');}else if(this.time-this.goalLockedAt>3){this.goalLockedAt=this.time;this.event('locked');}}
 }
 damage(fall){if(this.invulnerable>0&&!fall)return;this.hp--;this.event('hurt',fall);if(this.hp<=0){this.status='lost';this.event('lose');return;}this.invulnerable=2.5;const p=this.player;if(fall){const b=this.platforms[this.checkpoint];p.x=b.x;p.z=b.z+1.2;p.y=b.y+.2;p.vx=p.vz=p.vy=0;p.ground=this.checkpoint;}else{p.vy=5.5;p.ground=-1;p.vx*=-.5;p.vz=3;}}
 get stars(){return 1+(this.coins.size>=Math.ceil(this.level.coins.length*.8)?1:0)+(this.falls===0&&this.hits===0?1:0);}
}
