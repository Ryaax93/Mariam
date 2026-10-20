import { Vector2, Vector3 } from 'three';

// Reveal only foreground fragments near Mariam. No extra render pass or raycast.
export class CharacterVisibility {
 constructor(){this.focus={value:new Vector3(0,0,-1)};this.radius={value:new Vector2(1,1)};this.size=new Vector2();this.point=new Vector3();this.top=new Vector3();this.materials=new WeakSet();}
 attach(group){group.traverse(o=>{if(!o.isMesh)return;for(const mat of Array.isArray(o.material)?o.material:[o.material]){
  if(this.materials.has(mat))continue;this.materials.add(mat);
  mat.onBeforeCompile=shader=>{
   shader.uniforms.mariamFocus=this.focus;shader.uniforms.mariamRadius=this.radius;
   shader.fragmentShader='uniform vec3 mariamFocus;\nuniform vec2 mariamRadius;\n'+shader.fragmentShader;
   shader.fragmentShader=shader.fragmentShader.replace('#include <clipping_planes_fragment>',`#include <clipping_planes_fragment>
    if(mariamFocus.z>0.0 && gl_FragCoord.z<mariamFocus.z-0.00002){
      float distanceToMariam=length((gl_FragCoord.xy-mariamFocus.xy)/mariamRadius);
      float reveal=(1.0-smoothstep(0.72,1.0,distanceToMariam))*0.90;
      float grain=fract(sin(dot(floor(gl_FragCoord.xy),vec2(12.9898,78.233)))*43758.5453);
      if(grain<reveal)discard;
    }`);
  };
  mat.customProgramCacheKey=()=> 'mariam-visibility-v1';mat.needsUpdate=true;
 }});}
 update(renderer,camera,player){
  if(player.y < -2){this.focus.value.z=-1;return;}
  renderer.getDrawingBufferSize(this.size);camera.updateMatrixWorld();
  this.point.set(player.x,player.y+.95,player.z).project(camera);
  this.top.set(player.x,player.y+2,player.z).project(camera);
  const h=Math.max(15,Math.abs(this.top.y-this.point.y)*this.size.y*.5);
  this.focus.value.set((this.point.x*.5+.5)*this.size.x,(this.point.y*.5+.5)*this.size.y,this.point.z*.5+.5);
  this.radius.value.set(h*.75,h*1.3);
 }
}
