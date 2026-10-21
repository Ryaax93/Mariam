import * as T from '../vendor/three.module.js';
import {center,slope,clamp,floor} from './track.js';
export class FollowCamera{
 constructor(camera){this.camera=camera;this.look=new T.Vector3();this.target=new T.Vector3();this.desired=new T.Vector3();this.initial=false;this.landing=new T.Vector3();this.heading=0;}
 update(dt,s,soft=false){
  const x=center(s.s)+s.lane,lead=clamp(Math.abs(s.v)*.7,3,7);
  const heading=Math.atan2(slope(s.s+lead),-1);
  this.heading+=Math.atan2(Math.sin(heading-this.heading),Math.cos(heading-this.heading))*(this.initial?1-Math.exp(-dt*2):1);
  const back=new T.Vector3(-Math.sin(this.heading),0,-Math.cos(this.heading));
  const height=4.15+Math.max(0,s.y)*.4;
  this.desired.set(x+back.x*7.4,height,-s.s+back.z*7.4);
  this.target.set(center(s.s+lead)+s.lane*.62,.65+Math.max(0,s.y)*.35,-s.s-lead);
  if(!this.initial){this.camera.position.copy(this.desired);this.look.copy(this.target);this.initial=true;}
  else{this.camera.position.lerp(this.desired,1-Math.exp(-dt*(soft?3:5)));this.look.lerp(this.target,1-Math.exp(-dt*6));}
  this.camera.lookAt(this.look);this.camera.updateMatrixWorld();
  const airTime=Math.max(.55,(s.vy+Math.sqrt(s.vy*s.vy+34*Math.max(0,s.y)))/17);
  const landingS=clamp(s.s+Math.max(0,s.v)*airTime,s.s+3,s.s+9);
  const lane=s.lane+s.vl*Math.min(airTime,.7);
  this.landing.set(center(landingS)+lane,(floor(landingS,lane)??0)+.03,-landingS);
 }
 reset(){this.initial=false;}
}
// Opt-in whole-object fading. No shader discard; ground, obstacles and markers are excluded.
export class SightCorridor{
 constructor(){this.objects=[];this.ray=new T.Raycaster();this.dir=new T.Vector3();this.side=new T.Vector3();this.enabled={value:1};this.faded=[];}
 attach(root){
  if(root.userData.cameraOccluder!==true)return;
  const materials=new Map(),meshes=[];
  root.traverse(o=>{if(!o.isMesh)return;meshes.push(o);const clone=mat=>{if(!materials.has(mat)){const m=mat.clone();m.transparent=true;m.depthWrite=true;materials.set(mat,m);}return materials.get(mat);};o.material=Array.isArray(o.material)?o.material.map(clone):clone(o.material);});
  root.updateMatrixWorld(true);this.objects.push({root,meshes,materials:[...materials.values()],box:new T.Box3().setFromObject(root).expandByScalar(.12),opacity:1,hold:0});
 }
 update(renderer,camera,body,landing,dt=.016){
  this.faded=[];this.side.setFromMatrixColumn(camera.matrixWorld,0).multiplyScalar(.43);
  const points=[body,body.clone().add(this.side),body.clone().sub(this.side),landing.clone().add(new T.Vector3(0,.22,0))];
  for(const o of this.objects){let blocked=false;
   if(o.root.visible&&this.enabled.value)for(const p of points){this.dir.copy(p).sub(camera.position);const distance=this.dir.length();this.ray.set(camera.position,this.dir.normalize());this.ray.far=Math.max(0,distance-.35);if(this.ray.ray.intersectsBox(o.box)&&this.ray.intersectObjects(o.meshes,false).some(h=>h.distance<this.ray.far)){blocked=true;break;}}
   o.hold=blocked?.16:Math.max(0,o.hold-dt);const target=o.hold>0?.12:1;o.opacity+=(target-o.opacity)*(1-Math.exp(-dt*(blocked?18:7)));if(o.opacity>.995)o.opacity=1;
   for(const m of o.materials){m.opacity=o.opacity;m.depthWrite=o.opacity>.98;}if(o.opacity<.98)this.faded.push(o.root.name||o.root.uuid);
  }
 }
}
