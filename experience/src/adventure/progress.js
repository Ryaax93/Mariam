// Checkpoints use a separate key; both historical saves remain readable.
export const RUN_KEY = 'mariam-worlds-checkpoint-v2';
export function snapshot(session) {
 if (!session || session.status !== 'playing' || session.hp < 1) return null;
 return {version:2,level:session.level.id,checkpoint:session.checkpoint,hp:session.hp,time:session.time,elapsed:session.elapsed??session.time,falls:session.falls,hits:session.hits,coins:[...session.coins],relics:[...session.relics]};
}
export function validateRun(value, levels) {
 if (!value || value.version!==2 || !Number.isInteger(value.level)) return null;
 const level=levels[value.level]; if(!level) return null;
 if (![0,level.checkpoint].includes(value.checkpoint) || !Number.isInteger(value.hp) || value.hp<1 || value.hp>3) return null;
 for(const name of ['time','elapsed','falls','hits']) if(!Number.isFinite(value[name])||value[name]<0||value[name]>604800) return null;
 if(!Number.isInteger(value.falls)||!Number.isInteger(value.hits)) return null;
 for(const [name,max] of [['coins',level.coins.length],['relics',level.relics.length]]) {
  if(!Array.isArray(value[name])||value[name].some(n=>!Number.isInteger(n)||n<0||n>=max)||new Set(value[name]).size!==value[name].length) return null;
 }
 return {version:2,level:value.level,checkpoint:value.checkpoint,hp:value.hp,time:value.time,elapsed:value.elapsed,falls:value.falls,hits:value.hits,coins:[...value.coins],relics:[...value.relics]};
}
export function restore(session, value) {
 session.time=value.time;session.elapsed=value.elapsed;session.hp=value.hp;session.falls=value.falls;session.hits=value.hits;session.coins=new Set(value.coins);session.relics=new Set(value.relics);session.checkpoint=value.checkpoint;session.invulnerable=2.5;
 for(const p of session.platforms)if(p.kind==='moving')p[p.axis]=p['base'+p.axis.toUpperCase()]+Math.sin(session.time*p.speed)*p.range;
 const b=session.platforms[session.checkpoint];Object.assign(session.player,{x:b.x,y:b.y+.04,z:b.z+1.2,vx:0,vy:0,vz:0,ground:session.checkpoint});
 return session;
}
export function normalizeRecords(records) {
 if(!records||typeof records!=='object'||Array.isArray(records))return {};
 return Object.fromEntries(Object.entries(records).filter(([id,r])=>/^\d$/.test(id)&&+id<9&&r&&Number.isInteger(r.stars)&&r.stars>=1&&r.stars<=3).map(([id,r])=>[id,{stars:r.stars,time:Number.isFinite(r.time)&&r.time>=0?r.time:0,coins:Number.isInteger(r.coins)&&r.coins>=0?r.coins:0,...(Number.isFinite(r.realTime)&&r.realTime>=0?{realTime:r.realTime}:{} )}]));
}
export function parseBackup(text,levels) {
 const data=JSON.parse(text);
 if(!data||data.format!=='mariam-backup'||data.version!==1||!data.adventure||typeof data.adventure!=='object'||!data.adventure.records||typeof data.adventure.records!=='object'||Array.isArray(data.adventure.records)) throw new Error('Ce fichier n’est pas une sauvegarde Mariam.');
 const records=normalizeRecords(data.adventure.records);
 if(Object.keys(records).length!==Object.keys(data.adventure.records).length) throw new Error('Cette sauvegarde contient des records invalides.');
 const run=data.checkpoint==null?null:validateRun(data.checkpoint,levels);
 if(data.checkpoint!=null&&!run)throw new Error('Le point de reprise de cette sauvegarde est invalide.');
 return {records,run};
}
export function mergeRecords(current,incoming) {
 const merged={...current};for(const [id,r] of Object.entries(incoming)){const old=merged[id];merged[id]=old?{stars:Math.max(old.stars,r.stars),time:Math.min(old.time,r.time),coins:Math.max(old.coins,r.coins),...((old.realTime??r.realTime)!=null?{realTime:Math.min(old.realTime??Infinity,r.realTime??Infinity)}:{})}:{...r};}return merged;
}
