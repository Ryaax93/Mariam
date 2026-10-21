import * as T from '../vendor/three.module.js';
import {finishShop,dressWorld} from './environment-assets.js';
import {ROSES,SWEEPERS,sweeperLane} from './tricks.js';
import {center,width,floor,LENGTH,GATES,OBSTACLES,worldPoint} from './track.js';
const V=(x,y,z)=>new T.Vector3(x,y,z);
function tex(w,h,paint){const c=document.createElement('canvas');c.width=w;c.height=h;paint(c.getContext('2d'),w,h);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;return t;}
function curve(points,r=.035,sides=6){return new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>V(...p))),Math.max(8,points.length*3),r,sides,false);}
function rng(seed){return()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};}
function merge(list){
 const p=[],n=[],uv=[];let allUV=true;
 for(const original of list){const g=original.index?original.toNonIndexed():original;const a=g.attributes; p.push(...a.position.array);n.push(...a.normal.array);if(a.uv)uv.push(...a.uv.array);else allUV=false;if(g!==original)g.dispose();}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('normal',new T.Float32BufferAttribute(n,3));if(allUV)g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));return g;
}
export class LunaWorld{
 constructor(scene){
  this.scene=scene;this.decor=new T.Group();this.play=new T.Group();this.detail=new T.Group();scene.add(this.decor,this.play,this.detail);this.materials=new Map();this.gates=[];this.wheel=new T.Group();this.booths=[];this.flags=[];this.leaves=[];this.time=0;this.chunks=[];this.occluders=[];this.random=rng(104);
  this.sky();this.ground();this.course();this.town();this.ferris();this.musicGates();this.checkpoints();dressWorld(this);this.challenges();this.batch(this.wheel);this.batch(this.play);this.batch(this.decor);this.batch(this.detail);
 }
 mat(color,rough=.7){const key=color+':'+rough;if(!this.materials.has(key))this.materials.set(key,new T.MeshStandardMaterial({color,roughness:rough,metalness:rough<.4?.15:.02}));return this.materials.get(key);}
 mesh(geo,color,x=0,y=0,z=0,sx=1,sy=sx,sz=sx,parent=this.decor,rough=.7){const m=new T.Mesh(geo,this.mat(color,rough));m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
 box(c,x,y,z,w,h,d,parent=this.decor){return this.mesh(new T.BoxGeometry(w,h,d),c,x,y,z,1,1,1,parent);}
 ball(c,x,y,z,rx,ry=rx,rz=rx,parent=this.decor){return this.mesh(new T.SphereGeometry(1,12,8),c,x,y,z,rx,ry,rz,parent);}
 pipe(c,points,r=.04,parent=this.decor){return this.mesh(curve(points,r),c,0,0,0,1,1,1,parent);}
 sky(){
  const sky=new T.Mesh(new T.SphereGeometry(420,24,12),new T.ShaderMaterial({side:T.BackSide,depthWrite:false,uniforms:{top:{value:new T.Color(0x6f8fc5)},bottom:{value:new T.Color(0xefb8ce)}},vertexShader:'varying vec3 p; void main(){p=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',fragmentShader:'varying vec3 p; uniform vec3 top; uniform vec3 bottom; void main(){float h=clamp(normalize(p).y,0.0,1.0); vec3 c=mix(bottom,top,pow(h,.6));float sun=pow(max(dot(normalize(p),normalize(vec3(-.65,.3,-1.0))),0.0),500.0);gl_FragColor=vec4(c+sun*vec3(.8,.55,.25),1.0);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n}' }));this.scene.add(sky);
  this.scene.fog=new T.Fog(0xe5c3d0,55,160);this.scene.add(new T.HemisphereLight(0xffe7cf,0x728eaa,1.55));
  const sun=new T.DirectionalLight(0xffe3c3,2.55);sun.position.set(-15,25,16);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-18;sun.shadow.camera.right=18;sun.shadow.camera.top=22;sun.shadow.camera.bottom=-18;sun.shadow.normalBias=.045;sun.shadow.bias=-.0004;this.scene.add(sun,sun.target);this.sun=sun;
 }
 ground(){
  // V1 random ellipsoids reached y=+2 and crossed the track. Landscape is now below or outside it.
  const water=new T.Mesh(new T.PlaneGeometry(900,900),new T.MeshStandardMaterial({color:0x7eb9bc,roughness:.26,metalness:.28}));water.rotation.x=-Math.PI/2;water.position.set(0,-1.7,-100);this.scene.add(water);
  const p=[],ix=[];for(const side of [-1,1])for(let s=-8;s<235;s+=2){const n=p.length/3;for(const [q,l] of [[s,width(s)+1.2],[s,18],[s+2,width(s+2)+1.2],[s+2,18]])p.push(center(q)+side*l,-.65-Math.max(0,l-11)*.11,-q);ix.push(n,n+2,n+1,n+1,n+2,n+3);}
  const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(p,3));geo.setIndex(ix);geo.computeVertexNormals();const m=this.mesh(geo,0x82a996);m.material.side=T.DoubleSide;m.castShadow=false;
  for(let j=0;j<12;j++)this.ball(j%2?0xa0bdaf:0xb3c5b5,(j%2?1:-1)*(48+j%3*16),-5,30-j*24,12+j%4,7+j%3,18);
  for(let j=0;j<26;j++){const s=j*10;const m=this.box(0xb8d4cc,center(s)+(j%2?1:-1)*(21+j%5),-1.68,-s,3+j%3,.012,.035);m.castShadow=false;}
 }
 course(){
  const texture=tex(256,256,(c,w,h)=>{c.fillStyle='#eee0cf';c.fillRect(0,0,w,h);for(let i=0;i<1800;i++){const x=this.random()*w,y=this.random()*h;c.fillStyle=['#d8bcb7','#f9ead8','#d3c5bb','#bdb3b5'][i%4];c.beginPath();c.moveTo(x,y);c.lineTo(x+this.random()*3+1,y);c.lineTo(x,y+this.random()*4+1);c.fill();}});
  texture.wrapS=texture.wrapT=T.RepeatWrapping;texture.repeat.set(2,30);
  const grain=tex(128,128,(c,w,h)=>{c.fillStyle='#bcbcbc';c.fillRect(0,0,w,h);for(let i=0;i<8000;i++){const v=160+Math.floor(this.random()*80);c.fillStyle=`rgb(${v},${v},${v})`;c.fillRect(this.random()*w,this.random()*h,1,1);}});grain.wrapS=grain.wrapT=T.RepeatWrapping;grain.repeat.set(12,180);
  const mats=[new T.MeshStandardMaterial({color:0xd4789c,roughness:.48,metalness:.05,bumpMap:grain,bumpScale:.018}),new T.MeshStandardMaterial({map:texture,color:0xfff7e6,roughness:.76})];
  const surfaces=[[],[]],indices=[[],[]],uvs=[[],[]];
  for(let s=-5;s<LENGTH+8;s+=.5){
   const a=Math.max(0,s),b=Math.min(LENGTH,s+.5),w=width(a),lanes=[-w-1.2,-w,-2.4,0,2.4,w,w+1.2];
   for(let j=0;j<lanes.length-1;j++){
    const left=lanes[j],right=lanes[j+1],mid=(left+right)/2;
    const skirt=j===0||j===lanes.length-2,k=skirt?1:0;
    const hm=floor((s+s+.5)/2,mid);if(hm===null&&!skirt)continue;
    const h0=skirt?-.025:floor(s+.001,mid)??0,h1=skirt?-.025:floor(s+.499,mid)??0;
    const p=surfaces[k],q=p.length/3;
    p.push(center(a)+left,h0,-s,center(a)+right,h0,-s,center(b)+left,h1,-s-.5,center(b)+right,h1,-s-.5);
    indices[k].push(q,q+1,q+2,q+1,q+3,q+2);uvs[k].push(left/12,s/220,right/12,s/220,left/12,(s+.5)/220,right/12,(s+.5)/220);
   }
  }
  surfaces.forEach((p,k)=>{const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('uv',new T.Float32BufferAttribute(uvs[k],2));g.setIndex(indices[k]);g.computeVertexNormals();const m=new T.Mesh(g,mats[k]);m.receiveShadow=true;this.play.add(m);});
  for(const side of [-1,1]){
   const pts=[];for(let s=0;s<=LENGTH;s+=3)pts.push([center(s)+side*(width(s)+.1),.07,-s]);this.pipe(0xe5b56f,pts,.055,this.play);
   for(let s=0;s<LENGTH;s+=4){const x=center(s)+side*(width(s)+.7);this.box(0xffebd0,x,-.25,-s,.14,.6,.16);if(s%12===0)this.lantern(x,-s);}
  }
  for(let s=3;s<LENGTH;s+=6){for(const side of [-1,1]){const x=center(s)+side*(width(s)-.5);const tile=this.mesh(new T.PlaneGeometry(.38,2.8),0xe6a2b6,x,.012,-s,1,1,1,this.play);tile.rotation.x=-Math.PI/2;tile.rotation.z=side*.12;}}
  for(let s=8;s<LENGTH;s+=9){const x=center(s);const m=this.mesh(new T.RingGeometry(.16,.21,12,1,0,Math.PI*1.5),0xc48679,x,.015,-s,1,1,1,this.play);m.rotation.x=-Math.PI/2;}
  for(const h of OBSTACLES){const x=center(h.s)+h.lane,g=new T.Group();g.position.set(x,0,-h.s);this.play.add(g);
   this.mesh(new T.CylinderGeometry(.55,.7,.25,16),0xe9c8b1,0,.125,0,1,1,1,g);this.mesh(new T.ConeGeometry(.38,.9,12),0xb57888,0,.65,0,1,1,1,g);this.mesh(new T.TorusGeometry(.28,.025,5,16),0xffe5af,0,.6,0,1,1,1,g).rotation.x=Math.PI/2;
  }
  for(let s=12;s<LENGTH;s+=28){for(const side of [-1,1]){const geo=new T.RingGeometry(1.1,1.14,40);geo.rotateX(-Math.PI/2);this.mesh(geo,0xf6dabb,center(s)+side*3,.022,-s,1,1,1,this.play);}const m=this.mesh(new T.RingGeometry(.55,.58,40),0xf6dabb,center(s),.023,-s,1,1,1,this.play);m.rotation.x=-Math.PI/2;}
  this.sign('LE TREMPLIN DES ÉTOILES',center(103)-8.1,1.3,-103,3.8);
 }
 lantern(x,z){
  this.pipe(0x775257,[[x,0,z],[x,2.9,z],[x+.3,3.2,z],[x+.6,3.1,z]],.045);
  this.mesh(new T.CylinderGeometry(.15,.28,.46,8),0xffdf9b,x+.6,2.85,z,1,1,1);
  this.mesh(new T.ConeGeometry(.33,.2,8),0x91666a,x+.6,3.16,z,1,1,1);
 }
 sign(text,x,y,z,w=4,parent=this.decor){
  const texture=tex(512,128,(c)=>{c.fillStyle='#fff0d3';c.fillRect(0,0,512,128);c.strokeStyle='#b6856b';c.lineWidth=4;c.strokeRect(6,6,500,116);c.fillStyle='#69445b';c.textAlign='center';c.textBaseline='middle';c.font='600 29px Georgia';c.fillText(text,256,66,475);});
  const m=new T.Mesh(new T.PlaneGeometry(w,w/4),new T.MeshStandardMaterial({map:texture,roughness:.7,side:T.DoubleSide}));m.position.set(x,y,z);parent.add(m);return m;
 }
 shop(s,side,color,name){
  const x=center(s)+side*14.6,z=-s,g=new T.Group();g.position.set(x,0,z);g.rotation.y=-side*Math.PI*.36;this.decor.add(g);g.name=name;g.userData.dynamic=true;g.userData.cameraOccluder=true;
  this.box(color,0,2.3,0,6.2,4.6,4.8,g);this.box(0xffedd7,0,.18,2.6,6.8,.36,1.4,g);this.box(0xe7c6b2,0,4.5,0,6.55,.25,5.1,g);
  for(const xx of [-1.8,0,1.8]){
   this.box(0x7b889a,xx,1.7,2.415,1.42,2.7,.035,g);
   for(const edge of [-1,1])this.box(0xffebd3,xx+edge*.75,1.7,2.48,.09,2.95,.13,g);
   this.box(0xffe6c7,xx,1.7,2.49,1.5,.07,.1,g);this.box(0xffe6c7,xx,.3,2.49,1.5,.12,.1,g);
   this.box(0xb78e7a,xx,.6,2.9,1.3,.35,.55,g);
   for(let k=0;k<4;k++)this.ball(0x779b80,xx-.45+k*.3,.9,2.9,.22,.25,.22,g);
  }
  for(let j=0;j<10;j++){
   const c=j%2?0xffe8ce:color;
   const awn=this.mesh(new T.CylinderGeometry(1.35,1.35,.6,12,1,true,0,Math.PI/2),c,-2.7+j*.6,3.35,2.45,1,1,1,g);awn.rotation.z=Math.PI/2;
   this.mesh(new T.SphereGeometry(.3,10,6,0,Math.PI*2,0,Math.PI/2),c,-2.7+j*.6,3.15,3.74,1,.5,.35,g).rotation.z=Math.PI;
  }
  for(const side of [-1,1]){this.box(0xffe9d3,side*3,2.25,2.45,.24,4.5,.22,g);this.mesh(new T.ConeGeometry(.42,.38,4),0xe4b29a,side*3,4.7,2.45,1,1,1,g).rotation.y=Math.PI/4;}
  this.pipe(0xe4c7ad,[[-3.2,4.58,2.5],[-1.8,4.64,2.5],[0,5,2.5],[1.8,4.64,2.5],[3.2,4.58,2.5]],.1,g);this.sign(name,0,3.9,2.46,4.6,g);finishShop(this,g,color);
 }
 palm(x,z,h=5){
  this.pipe(0xaf8b6f,[[x,0,z],[x+.15,h*.4,z],[x+.4,h*.8,z],[x+.5,h,z]],.12);
  for(let j=0;j<7;j++){
   const a=j*Math.PI*2/7,pts=[];for(let k=0;k<7;k++){const t=k/6;pts.push([x+.5+Math.cos(a)*t*2.6,h+Math.sin(t*Math.PI)*.65-t*.8,z+Math.sin(a)*t*2.6]);}
   const path=new T.CatmullRomCurve3(pts.map(p=>V(...p)));
   const positions=[],index=[];for(let k=0;k<=10;k++){const t=k/10,p=path.getPoint(t),w=Math.sin(Math.PI*t)*.3;positions.push(p.x+Math.sin(a)*w,p.y,p.z-Math.cos(a)*w,p.x-Math.sin(a)*w,p.y+.025,p.z+Math.cos(a)*w);if(k<10){const b=k*2;index.push(b,b+2,b+1,b+1,b+2,b+3);}}
   const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(positions,3));geo.setIndex(index);geo.computeVertexNormals();const leaf=this.mesh(geo,j%2?0x648c78:0x7c9e7b,0,0,0,1,1,1);leaf.material.side=T.DoubleSide;
  }
  this.mesh(new T.CylinderGeometry(1.1,1.3,.45,16),0xc19b7f,x,.02,z,1,1,1);
 }
 town(){
  const names=['Les patins roses','Bisous & limonade','Le petit atelier','Un tour avec toi'];
  for(let i=0;i<6;i++)this.shop(16+i*36,i%2?1:-1,[0xc98e98,0x98b2aa,0xd5b292,0xa99cba][i%4],names[i%4]);
  for(let i=0;i<24;i++){const s=i*10,side=i%2?1:-1;this.palm(center(s)+side*(10.8+this.random()*3),-s-3,4.5+this.random()*2);}
  // Low flower beds and benches enrich the promenade without covering the route.
  for(let i=0;i<34;i++){
   const s=i*6.5,side=i%2?1:-1,x=center(s)+side*8,z=-s;
   this.ball(0x8b9d7e,x,-.12,z,1.3,.55,1.5);
   for(let j=0;j<6;j++){const a=j*2.4,r=.3+this.random()*.7;this.ball(j%2?0xd995a9:0xe5c5a0,x+Math.cos(a)*r,.25+this.random()*.35,z+Math.sin(a)*r,.16,.11,.15,this.detail);}
   if(i%4===0){this.box(0xcaa17e,x,.5,z,2.2,.12,.55);this.box(0xcaa17e,x,.88,z-.23,2.2,.6,.08);for(const side of [-1,1])this.box(0x755866,x+side*.8,.23,z,.08,.45,.5);}
  }
  // Garland stays high and at the plaza, away from jumps.
  for(const s of [0,68,138,208]){
   const pts=[];for(let k=0;k<=12;k++){const x=-8+k*16/12;pts.push([center(s)+x,5.8-Math.sin(k/12*Math.PI)*1.2,-s]);}
   this.pipe(0x9b7b79,pts,.018);
   for(let j=1;j<12;j++){const p=pts[j];this.ball(j%2?0xffdaa2:0xdfa1b6,p[0],p[1]-.12,p[2],.1,.14,.1);}
  }
  this.sign('LES JARDINS DE LUNA',-8,3.7,-1,5).rotation.y=.38;
  this.sign('POUR MARIAM, TOUJOURS',center(218),3.5,-223,7);
 }
 ferris(){
  const x=30,y=11,z=-65;this.wheel.position.set(x,y,z);this.decor.add(this.wheel);
  this.pipe(0xd5b08a,[[x-4,0,z+1],[x,y,z],[x+4,0,z+1]],.25);
  for(const depth of [-.35,.35]){
   const m=new T.Mesh(new T.TorusGeometry(8,.11,6,72),this.mat(0xffe6bb));m.position.z=depth;this.wheel.add(m);
   for(let j=0;j<12;j++){const a=j*Math.PI/6;this.pipe(0xceb4a5,[[0,0,depth],[Math.cos(a)*8,Math.sin(a)*8,depth]],.045,this.wheel);}
  }
  for(let j=0;j<12;j++){
   const g=new T.Group();g.userData.angle=j*Math.PI/6;g.userData.dynamic=true;this.wheel.add(g);
   this.box(j%2?0xc786a0:0xa9c1ae,0,-.4,0,1.1,.85,.9,g);
   this.mesh(new T.ConeGeometry(.9,.45,4),0xffe4c1,0,.55,0,1,1,1,g).rotation.y=Math.PI/4;this.booths.push(g);
  }
 }
 musicGates(){
  GATES.forEach(g=>{
   const group=new T.Group();group.position.set(center(g.s)+g.lane,0,-g.s);this.play.add(group);
   for(const side of [-1,1]){this.mesh(new T.CylinderGeometry(.06,.09,1.3,8),0x9e7686,side*1.35,.65,0,1,1,1,group);this.ball(0xffd995,side*1.35,1.35,0,.12,.13,.12,group);}
   const line=this.box(0xedc592,0,.012,0,2.8,.02,.22,group);
   const note=new T.Group();note.position.y=1.05;group.add(note);
   this.ball(0xdc739d,-.11,0,0,.17,.11,.08,note);this.box(0xd99e64,.03,.24,0,.045,.46,.04,note);this.box(0xd99e64,.13,.44,0,.21,.055,.04,note);
   this.batch(note);note.userData.dynamic=true;this.gates.push({group,note,line});
  });
 }
 checkpoints(){for(const s of [74,144]){const x=center(s)-4.3;this.pipe(0xa47d68,[[x,0,-s],[x,2,-s]],.04);const flag=this.box(0xe4a1b7,x+.35,1.7,-s,.7,.4,.03);this.flags.push(flag);}}
 challenges(){
  this.roses=[];this.sweepers=[];
  const heart=new T.Shape();heart.moveTo(0,-.22);heart.bezierCurveTo(-.5,.05,-.3,.5,0,.22);heart.bezierCurveTo(.3,.5,.5,.05,0,-.22);
  for(const r of ROSES){const g=new T.Group();g.position.set(center(r.s)+r.lane,1,-r.s);g.userData.dynamic=true;this.play.add(g);this.mesh(new T.ExtrudeGeometry(heart,{depth:.08,bevelSize:.03,bevelThickness:.02,bevelSegments:2,steps:1,curveSegments:8}),0xe17598,0,0,0,1,1,1,g);this.mesh(new T.TorusGeometry(.5,.018,5,32),0xffdfaa,0,.06,0,1,1,1,g);this.batch(g);this.roses.push(g);}
  for(const h of SWEEPERS){const g=new T.Group();g.userData.dynamic=true;this.play.add(g);
   this.mesh(new T.CylinderGeometry(.52,.62,.18,12),0xe6b68b,0,.1,0,1,1,1,g);this.mesh(new T.CylinderGeometry(.25,.35,.68,12),0xb57491,0,.48,0,1,1,1,g);this.pipe(0xa77860,[[0,.5,0],[0,1.5,0]],.035,g);
   const flower=new T.Group();flower.position.y=1.25;flower.userData.dynamic=true;g.add(flower);for(let j=0;j<5;j++){const a=j*Math.PI*.4,m=this.ball(j%2?0xffd2a2:0xd87c9d,Math.cos(a)*.23,Math.sin(a)*.23,0,.23,.11,.05,flower);m.rotation.z=a;}this.ball(0xf8dfac,0,0,.05,.1,.1,.055,flower);this.batch(flower);this.batch(g);this.sweepers.push({g,flower,h});
   for(let lane=-3.2;lane<3.3;lane+=.4)this.box(0xe8b39c,center(h.s)+lane,.018,-h.s,.18,.012,.5,this.play);
  }
  const p=new Float32Array(32*3);this.trail=new T.Points(new T.BufferGeometry().setAttribute('position',new T.BufferAttribute(p,3)),new T.PointsMaterial({color:0xffd9a7,size:.06,transparent:true,opacity:.7,depthWrite:false}));this.trail.frustumCulled=false;this.scene.add(this.trail);this.trailIndex=0;
 }
 batch(root){
  root.updateMatrixWorld(true);const groups=new Map(),remove=[],inverse=new T.Matrix4().copy(root.matrixWorld).invert();
  const partition=root===this.decor||root===this.detail;
  root.traverse(m=>{if(!m.isMesh||m.isInstancedMesh||m.userData.dynamic)return;for(let p=m.parent;p&&p!==root;p=p.parent)if(p.userData.dynamic)return;if(root!==this.wheel&&this.wheel.getObjectById(m.id))return;
   const g=m.geometry.clone();g.applyMatrix4(new T.Matrix4().multiplyMatrices(inverse,m.matrixWorld));g.computeBoundingBox();const z=g.boundingBox.getCenter(new T.Vector3()).z,zone=partition?Math.floor(z/48):0,key=m.material.uuid+':'+zone;
   if(!groups.has(key))groups.set(key,{mat:m.material,geos:[],zone});groups.get(key).geos.push(g);remove.push(m);
  });
  remove.forEach(m=>{m.removeFromParent();m.geometry.dispose();});
  for(const {mat,geos,zone} of groups.values()){const m=new T.Mesh(merge(geos),mat);m.receiveShadow=true;m.castShadow=true;root.add(m);if(partition){m.geometry.computeBoundingBox();this.chunks.push({mesh:m,min:m.geometry.boundingBox.min.z,max:m.geometry.boundingBox.max.z});}geos.forEach(g=>g.dispose());}
 }
 update(dt,s,low=false){
  this.time+=dt;this.roses.forEach((g,i)=>{g.visible=!s.roses.has(i);g.rotation.y=this.time*.8;g.position.y=1+Math.sin(this.time*2+i)*.12;});for(const {g,flower,h} of this.sweepers){g.position.set(center(h.s)+sweeperLane(h,s.time),0,-h.s);flower.rotation.z=s.time*1.6;}this.trail.visible=s.v>4&&!s.grounded&&s.trickPhase>0;if(this.trail.visible){const a=this.trail.geometry.attributes.position;for(let i=0;i<2;i++){const j=(this.trailIndex++)%32;a.setXYZ(j,center(s.s)+s.lane+(i?-.17:.17),s.y+.13,-s.s);}a.needsUpdate=true;}for(const c of this.chunks)c.mesh.visible=c.max>-s.s-(low?100:150)&&c.min<-s.s+35;for(const o of this.occluders){const distance=Math.abs(o.position.z+s.s);o.visible=distance<(low?85:120);o.traverse(m=>{if(m.isMesh)m.castShadow=distance<25;});}for(const b of this.banners)b.rotation.z=Math.sin(this.time*1.4+b.position.z)*.055;this.detail.visible=!low;this.sun.castShadow=!low;
  this.sun.position.set(center(s.s)-15,25,-s.s+16);this.sun.target.position.set(center(s.s),0,-s.s-10);
  this.wheel.rotation.z=this.time*.035;
  for(const b of this.booths){const a=b.userData.angle;b.position.set(Math.cos(a)*8,Math.sin(a)*8,0);b.rotation.z=-this.wheel.rotation.z;}
  this.gates.forEach((g,i)=>{g.note.visible=!s.notes.has(i);g.note.rotation.y=this.time*.8;g.note.position.y=1.05+Math.sin(this.time*3+i)*.09;});
 }
}
