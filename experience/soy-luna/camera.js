import * as T from '../vendor/three.module.js';
import {center,slope,clamp,floor} from './track.js';
export class FollowCamera{
 constructor(camera){this.camera=camera;this.look=new T.Vector3();this.target=new T.Vector3();this.desired=new T.Vector3();this.initial=false;this.landing=new T.Vector3();this.heading=0;}
 update(dt,s,soft=false){
  const x=center(s.s)+s.lane,lead=clamp(Math.abs(s.v)*.7,3,7);
  const heading=Math.atan2(slope(s.s+lead),-1);
  this.heading+=Math.atan2(Math.sin(heading-this.heading),Math.cos(heading-this.heading))*(this.initial?1-Math.exp(-dt*2):1);
  const back=new T.Vector3(-Math.sin(this.heading),0,-Math.cos(this.heading));
  const height=4.5+Math.max(0,s.y)*.45;
  this.desired.set(x+back.x*7.8,height,-s.s+back.z*7.8);
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
// Screen-space capsule protects body and anticipated landing, not just a small torso ellipse.
// Only scenery materials opt in. Collision geometry and the track remain readable.
export class SightCorridor{
 constructor(){this.a={value:new T.Vector3()};this.b={value:new T.Vector3()};this.r={value:80};this.size=new T.Vector2();this.p=new T.Vector3();this.enabled={value:1};this.seen=new WeakSet();}
 attach(root){root.traverse(o=>{if(!o.isMesh)return;for(const mat of Array.isArray(o.material)?o.material:[o.material]){
  if(this.seen.has(mat))continue;this.seen.add(mat);
  mat.onBeforeCompile=shader=>{
   Object.assign(shader.uniforms,{sightA:this.a,sightB:this.b,sightRadius:this.r,sightEnabled:this.enabled});
   shader.fragmentShader='uniform vec3 sightA; uniform vec3 sightB; uniform float sightRadius; uniform float sightEnabled;\n'+shader.fragmentShader;
   shader.fragmentShader=shader.fragmentShader.replace('#include <clipping_planes_fragment>',`#include <clipping_planes_fragment>
    vec2 ab=sightB.xy-sightA.xy;
    float u=clamp(dot(gl_FragCoord.xy-sightA.xy,ab)/max(dot(ab,ab),1.0),0.0,1.0);
    float d=length(gl_FragCoord.xy-mix(sightA.xy,sightB.xy,u));
    float depth=mix(sightA.z,sightB.z,u);
    if(sightEnabled>0.5 && gl_FragCoord.z<depth-0.00001 && d<sightRadius){
      float opacity=smoothstep(sightRadius*.78,sightRadius,d);
      float grain=fract(sin(dot(floor(gl_FragCoord.xy),vec2(12.9898,78.233)))*43758.5453);
      if(grain>opacity*.95)discard;
    }`);
  };mat.customProgramCacheKey=()=> 'luna-sight-corridor-1';mat.needsUpdate=true;
 }});}
 update(renderer,camera,body,landing){
  renderer.getDrawingBufferSize(this.size);
  const project=(point,out)=>{this.p.copy(point).project(camera);out.set((this.p.x*.5+.5)*this.size.x,(this.p.y*.5+.5)*this.size.y,this.p.z*.5+.5);};
  project(body,this.a.value);project(landing,this.b.value);
  this.r.value=this.size.y*.21;
 }
}
