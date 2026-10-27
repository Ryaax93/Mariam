import * as T from '../../vendor/three.module.js';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const context=new Proxy({},{get:()=>()=>{},set:()=>true});
globalThis.document={createElement:()=>({width:128,height:128,getContext:()=>context})};
const [{LunaWorld:Before},{LunaWorld:After},{center,width}]=await Promise.all([import('../../.luna-v1/world.js'),import('../world.js'),import('../track.js')]);
const report={method:'Three.js mesh ray intersections, no GPU; V1 commit 3e981a4',before:[],after:[]};
for(const [key,World] of [['before',Before],['after',After]]){
 const scene=new T.Scene(),w=new World(scene);scene.updateMatrixWorld(true);
 for(let s=0;s<=220;s++)for(const lane of [-width(s)+.4,0,width(s)-.4]){
  const ray=new T.Raycaster(new T.Vector3(center(s)+lane,2.8,-s),new T.Vector3(0,-1,0),0,2.75);
  const h=ray.intersectObjects([w.decor,w.detail],true);
  if(h.length)report[key].push({s,lane,y:h[0].point.y});
 }
}
assert(report.before.length>0);assert.equal(report.after.length,0);
await fs.mkdir(new URL('../evidence/v2/',import.meta.url),{recursive:true});
await fs.writeFile(new URL('../evidence/v2/geometry.json',import.meta.url),JSON.stringify(report,null,2));
console.log('LUNA_GEOMETRY_REPORT '+JSON.stringify({before:report.before.length,after:report.after.length,samples:663}));
