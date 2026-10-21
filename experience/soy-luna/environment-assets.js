// Authored 3D architecture and planted terraces. Original procedural assets, no image facades.
import * as T from '../vendor/three.module.js';
import {center,width,LENGTH} from './track.js';
export function finishShop(w,g,color){
 w.box(color,0,5.15,-.2,5.8,1.25,4.2,g);
 for(const xx of [-1.8,0,1.8]){
  w.mesh(new T.CircleGeometry(.52,18,0,Math.PI),0x567d88,xx,5.3,1.93,1,1,1,g);w.box(0x567d88,xx,5.05,1.93,1.04,.5,.04,g);
  w.pipe(0xffe9d3,Array.from({length:13},(_,i)=>[xx+Math.cos(i/12*Math.PI)*.58,5.3+Math.sin(i/12*Math.PI)*.58,2.01]),.065,g);
  w.box(0xffe9d3,xx,5.14,2.01,.045,.9,.1,g);w.box(0xecc9a4,xx,4.78,2.02,1.3,.12,.26,g);
  w.box(0xefd8ad,xx,1.1,2.45,.95,.12,.22,g);
  for(let k=0;k<3;k++)w.mesh(new T.CylinderGeometry(.09,.12,.35+k*.05,8),k%2?0xc8809a:0xe9bd7e,xx-.35+k*.34,1.3,2.5,1,1,1,g);
  w.box(0xb7d1d0,xx-.33,2.1,2.46,.08,1.9,.01,g).rotation.z=-.12;
 }
 const roof=new T.CylinderGeometry(3.15,4.15,1.45,4);roof.rotateY(Math.PI/4);w.mesh(roof,0x866d87,0,6.25,-.2,1,1,.78,g);
 w.box(0xffe9d3,0,5.65,-.2,6.6,.18,4.8,g);w.box(0xe8bc94,0,7,-.2,4.5,.13,2.6,g);
 for(let k=0;k<8;k++)w.box(0xb49bab,-2.8+k*.8,6.35,-.2,.06,.05,4.15,g);
 for(let k=0;k<7;k++)w.box(0xf6dfc2,-2.55+k*.85,4.35,2.58,.18,.3,.26,g);
 for(const xx of [-2.8,2.8]){w.mesh(new T.CylinderGeometry(.16,.2,3.1,10),0xffe9d3,xx,1.75,3.4,1,1,1,g);w.mesh(new T.CylinderGeometry(.28,.28,.16,10),0xe6c4a2,xx,.28,3.4,1,1,1,g);}
 w.batch(g);w.occluders.push(g);
}
export function dressWorld(w){
 w.banners=[];
 for(const s of [38,88,156,198]){
  const side=s===88||s===198?-1:1,x=center(s)+side*10.1,z=-s;
  w.mesh(new T.CylinderGeometry(1.2,1.25,.12,24),0xf0d3ae,x,.04,z);
  w.mesh(new T.CylinderGeometry(.65,.65,.09,24),0xfce4c1,x,.92,z);w.mesh(new T.CylinderGeometry(.06,.13,.9,8),0x8d596b,x,.47,z);
  for(const a of [-1,1]){w.mesh(new T.CylinderGeometry(.31,.31,.1,14),0xb9718e,x+a*.95,.52,z);w.pipe(0x795669,[[x+a*1.15,.1,z-.2],[x+a*1.15,.9,z-.2],[x+a*.8,.94,z-.2]],.035);}
  w.pipe(0xd0a779,[[x,0,z],[x,2.6,z]],.035);
  w.mesh(new T.ConeGeometry(1.8,.7,12,1,true),0xe9a7b3,x,2.6,z).material.side=T.DoubleSide;
  for(let k=0;k<12;k++){const a=k*Math.PI/6;w.pipe(0xffe7cb,[[x,2.95,z],[x+Math.cos(a)*1.78,2.26,z+Math.sin(a)*1.78]],.02);}
  w.mesh(new T.CylinderGeometry(.08,.065,.2,8),0xd2a372,x+.22,1.07,z);w.ball(0xf6cbb1,x+.22,1.2,z,.08,.03,.08);
 }
 const g=new T.Group();g.position.set(center(130)-15,0,-130);w.decor.add(g);g.name='Pavillon des roses';g.userData.dynamic=true;g.userData.cameraOccluder=true;
 w.mesh(new T.CylinderGeometry(3.5,3.8,.4,8),0xecc1ac,0,-.05,0,1,1,1,g);
 for(let i=0;i<8;i++){const a=i*Math.PI/4,x=Math.cos(a)*3,z=Math.sin(a)*3;w.mesh(new T.CylinderGeometry(.13,.19,4,10),0xffedd7,x,2,z,1,1,1,g);w.mesh(new T.TorusGeometry(.28,.04,6,16),0xc79c78,x,3.8,z,1,1,1,g).rotation.x=Math.PI/2;}
 w.mesh(new T.ConeGeometry(4.15,2.1,8),0xb9829b,0,5,0,1,1,1,g);w.mesh(new T.ConeGeometry(.5,1,8),0xdeb47d,0,6.5,0,1,1,1,g);w.batch(g);w.occluders.push(g);
 for(let i=0;i<56;i++){
  const s=i*4.05,side=i%2?1:-1,x=center(s)+side*(8+w.random()*.8),z=-s;
  w.pipe(0x527e6b,[[x,-.2,z],[x+.08,.38,z],[x,.67,z]],.018,w.detail);
  for(let k=0;k<5;k++){const a=k*Math.PI*.4,petal=w.ball(i%3?0xeaa4b5:0xf6d5b2,x+Math.cos(a)*.115,.68,z+Math.sin(a)*.115,.15,.055,.09,w.detail);petal.rotation.y=-a;petal.rotation.z=Math.cos(a)*.32;}
  w.ball(0xd6a159,x,.7,z,.06,.07,.06,w.detail);
 }
 // Instanced, shaped lance leaves give the beds a planted silhouette at two draw calls.
 const lp=[],li=[];for(let i=0;i<=8;i++){const t=i/8,half=Math.sin(Math.PI*t)*.13;lp.push(-half,t*.7,Math.sin(t*Math.PI)*.12,0,t*.7+.035,Math.sin(t*Math.PI)*.16,half,t*.7,Math.sin(t*Math.PI)*.12);if(i<8){const a=i*3;li.push(a,a+3,a+1,a+1,a+3,a+4,a+1,a+4,a+2,a+2,a+4,a+5);}}
 const leafGeo=new T.BufferGeometry();leafGeo.setAttribute('position',new T.Float32BufferAttribute(lp,3));leafGeo.setIndex(li);leafGeo.computeVertexNormals();
 for(const shade of [0x52896e,0x7ca185]){const leaves=new T.InstancedMesh(leafGeo,new T.MeshStandardMaterial({color:shade,side:T.DoubleSide,roughness:.75}),168),dummy=new T.Object3D();let n=0;for(let i=0;i<28;i++){const s=i*8,side=i%2?1:-1;for(let k=0;k<6;k++){const a=k*Math.PI/3+i*.3;dummy.position.set(center(s)+side*(8.3+w.random()*.7),.13,-s+(w.random()-.5));dummy.rotation.set(.3+w.random()*.7,a,side*.1);dummy.scale.setScalar(.65+w.random()*.7);dummy.updateMatrix();leaves.setMatrixAt(n++,dummy.matrix);}}leaves.castShadow=false;leaves.receiveShadow=true;w.decor.add(leaves);}
 for(const s of [23,76,145,202])for(let k=0;k<7;k++){
  const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute([0,0,0,0,0,.48,0,-.56,.24],3));geo.computeVertexNormals();const flag=w.mesh(geo,k%2?0xdda2b4:0xefd4a1,center(s)-9.2,2.6-Math.sin(k/6*Math.PI)*.3,-s+k*.65);flag.material.side=T.DoubleSide;flag.userData.dynamic=true;w.banners.push(flag);
 }
 for(let s=1;s<LENGTH;s+=2.5)for(const side of [-1,1])w.box(0xcbb7a7,center(s)+side*(width(s)+.6),-.01,-s,1.18,.009,.025,w.play);
 for(const [s,label] of [[8,'01 · LA PROMENADE'],[78,'02 · LE BAL DES ROLLERS'],[148,'03 · SOUS LES ÉTOILES']])w.sign(label,center(s)-8.1,1.4,-s,2.7).rotation.y=.18;
}
