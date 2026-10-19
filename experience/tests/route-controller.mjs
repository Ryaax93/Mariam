// Test-only controller: produces ordinary movement, jump and dash inputs.
export const controls=function(s,m){
 const p=s.player,bs=s.platforms,last=s.level?s.level.goal.platform:bs.length-1;
 if(m.idx===undefined)m.idx=0;
 if(s.falls!==m.falls){if(m.falls!==undefined){m.idx=s.checkpoint;m.phase='center';}m.falls=s.falls;}
 let idx=m.idx,phase=m.phase||'center',b=bs[idx],r=s.level?.relics.find(r=>r.platform===idx);
 const clamp=v=>Math.max(-1,Math.min(1,v));let tx=b.x+(r?.x||0),tz=b.z+(idx===last?-1.1:0),jump=false,dash=false;
 if(phase==='center'){
  if(Math.abs(p.x-tx)<.65&&Math.abs(p.z-tz)<.65&&idx<last&&(p.ground===idx||b.kind==='bounce'&&p.vy>5))phase='edge';
 }
 if(phase==='edge'&&idx<last){const next=bs[idx+1];tx=Math.max(b.x-b.w/2+.5,Math.min(b.x+b.w/2-.5,next.x));tz=b.z-b.d/2+.38;
  if(p.z<tz+.25&&(p.ground===idx||s.coyote>0)){jump=true;m.idx=idx+1;phase='center';b=next;tx=next.x;tz=next.z;}
  else if(b.kind==='bounce'&&p.ground<0&&p.vy>4){m.idx=idx+1;phase='center';b=next;tx=next.x;tz=next.z;}
 }
 m.phase=phase;
 let x=clamp((tx-p.x)*3-p.vx*.22),z=clamp((tz-p.z)*3-p.vz*.22);
 if(phase==='edge'&&!jump)z=-1;
 // Steer around a blocker on the island; jump when already close to the take-off edge.
 const h=(s.hazards||[]).find(h=>Math.hypot(h.x-p.x,h.z-p.z)<1.55&&h.z<p.z+.4);
 if(h&&p.ground>=0){if(p.z-(b.z-b.d/2)<1.1)jump=true;else{x=p.x<h.x?-1:1;if(Math.abs(p.x-b.x)>b.w/2-.6)x=-Math.sign(p.x-b.x);if(h.z<p.z)z=-.35;}}
 // Use the dash only while crossing a gap, never while braking over a landing platform.
 const supported=bs.some(q=>Math.abs(p.x-q.x)<q.w/2&&Math.abs(p.z-q.z)<q.d/2);
 if(!supported&&p.ground<0&&p.vy<2&&p.y>b.y+.15&&s.cooldown===0)dash=true;
 return {x,z,jump,dash};
};
