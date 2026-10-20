import * as T from '../vendor/three.module.js';
const TAU=Math.PI*2;
function loft(rows,n=16){
 const p=[],ix=[];
 for(const [y,rx,rz,cx=0,cz=0] of rows)for(let j=0;j<=n;j++){const a=j/n*TAU;p.push(cx+Math.sin(a)*rx,y,cz+Math.cos(a)*rz);}
 for(let k=0;k<rows.length-1;k++)for(let j=0;j<n;j++){const a=k*(n+1)+j,b=a+n+1;ix.push(a,a+1,b,b,a+1,b+1);}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setIndex(ix);g.computeVertexNormals();return g;
}
function tube(points,r=.012,segments=24,sides=5){return new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),segments,r,sides,false);}
function ellipsoid(x,y,z,rx,ry,rz){const g=new T.SphereGeometry(1,14,10);g.scale(rx,ry,rz);g.translate(x,y,z);return g;}
function heart(size=.035){const s=new T.Shape();s.moveTo(0,-size);s.bezierCurveTo(-size*2,size*.2,-size,size*1.6,0,size*.6);s.bezierCurveTo(size,size*1.6,size*2,size*.2,0,-size);return new T.ExtrudeGeometry(s,{depth:.009,bevelEnabled:true,bevelSize:.004,bevelThickness:.003,bevelSegments:1,steps:1,curveSegments:6});}
export class MariamRig{
 constructor(){
  this.root=new T.Group();this.root.name='Mariam / rig de développement';this.root.userData.status='reference-fidelity-unvalidated';
  const spec=[
   ['hips',-1,0,1.12,0],['spine',0,0,1.36,0],['chest',1,0,1.61,0],['neck',2,0,1.82,0],['head',3,0,1.99,0],
   ['thighL',0,-.135,1.1,0],['shinL',5,-.135,.62,0],['footL',6,-.135,.19,.035],
   ['thighR',0,.135,1.1,0],['shinR',8,.135,.62,0],['footR',9,.135,.19,.035],
   ['armL',2,-.265,1.65,0],['forearmL',11,-.36,1.36,.015],['handL',12,-.40,1.1,.02],
   ['armR',2,.265,1.65,0],['forearmR',14,.36,1.36,.015],['handR',15,.40,1.1,.02],
   ['hairL',4,-.22,1.8,-.04],['hairR',4,.22,1.8,-.04],['hairBack',4,0,1.8,-.17]
  ];
  this.bones=spec.map((s,i)=>{const b=new T.Bone();b.name=s[0];b.position.set(s[2],s[3],s[4]);if(s[1]>=0)b.position.sub(new T.Vector3(...spec[s[1]].slice(2)));return b;});
  spec.forEach((s,i)=>(s[1]<0?this.root:this.bones[s[1]]).add(this.bones[i]));
  this.root.updateMatrixWorld(true);this.skeleton=new T.Skeleton(this.bones);
  const colors={skin:0xbb784c,hair:0x2f1917,hairLight:0x512b24,black:0x23222c,pink:0xe884ae,rose:0xbd3d72,ivory:0xffefde,gold:0xd5a75d,eye:0x3c211e,lip:0x99414a};
  this.materials={};this.parts=new Map();
  for(const [k,color] of Object.entries(colors))this.materials[k]=new T.MeshStandardMaterial({color,roughness:k==='gold'?.3:k==='pink'?.4:.7,metalness:k==='gold'?.55:.02});
  const add=(g,key,bone,other=bone,weight=null)=>{
   const geom=g.index?g.toNonIndexed():g;const pos=geom.attributes.position,normal=geom.attributes.normal;
   if(!this.parts.has(key))this.parts.set(key,{p:[],n:[],si:[],sw:[]});const out=this.parts.get(key);
   for(let j=0;j<pos.count;j++){const x=pos.getX(j),y=pos.getY(j),z=pos.getZ(j);out.p.push(x,y,z);out.n.push(normal.getX(j),normal.getY(j),normal.getZ(j));const w=weight?T.MathUtils.clamp(weight(x,y,z),0,1):0;out.si.push(bone,other,0,0);out.sw.push(1-w,w,0,0);}
   if(geom!==g)geom.dispose();g.dispose();
  };
  // Profiled torso and separate fitted garment surfaces, sharing one deforming skeleton.
  add(loft([[1.05,.21,.125],[1.17,.22,.13],[1.28,.16,.105],[1.39,.158,.105],[1.55,.21,.13],[1.65,.235,.115],[1.73,.12,.09],[1.78,.08,.075]],24),'skin',0,2,(_,y)=>(y-1.2)/.4);
  add(loft([[1.42,.167,.113],[1.5,.193,.134],[1.6,.228,.133],[1.68,.227,.113],[1.72,.11,.09]],24),'black',1,2,(_,y)=>(y-1.4)/.23);
  add(loft([[1.08,.214,.13],[1.17,.225,.14],[1.24,.19,.117],[1.28,.168,.112]],24),'black',0);
  add(loft([[1.73,.078,.07],[1.83,.077,.07],[1.88,.09,.075]],16),'skin',3);
  // Sculpted head profile: chin, jaw, cheeks, brow, crown.
  add(loft([[1.85,.025,.035,0,.035],[1.88,.085,.073,0,.035],[1.93,.13,.1,0,.024],[2,.157,.127,0,.008],[2.07,.15,.12],[2.15,.125,.105],[2.2,.065,.065],[2.21,.004,.004]],24),'skin',4);
  for(const side of [-1,1]){
   const hip=side<0?5:8,knee=hip+1,foot=hip+2,arm=side<0?11:14,fore=arm+1,hand=arm+2;
   add(loft([[.2,.06,.065,side*.135],[.33,.065,.075,side*.135],[.5,.083,.08,side*.135],[.62,.08,.08,side*.135],[.78,.107,.106,side*.14],[1,.13,.13,side*.135],[1.13,.13,.12,side*.12]],18),'black',hip,knee,(_,y)=>(.8-y)/.24);
   add(loft([[1.03,.035,.034,side*.40,.02],[1.11,.045,.04,side*.40,.02],[1.2,.054,.05,side*.385,.015],[1.36,.063,.056,side*.36,.015],[1.49,.07,.066,side*.31],[1.62,.077,.078,side*.267],[1.69,.065,.068,side*.25]],14),'skin',arm,fore,(_,y)=>(1.49-y)/.23);
   add(ellipsoid(side*.405,1.045,.024,.048,.079,.029),'skin',hand);
   add(ellipsoid(side*.365,1.065,.048,.021,.042,.021),'skin',hand);
   add(loft([[.24,.064,.066,side*.135],[.33,.065,.068,side*.135],[.35,.065,.068,side*.135]],14),'ivory',foot);
   add(loft([[.11,.085,.16,side*.135,.065],[.14,.095,.17,side*.135,.07],[.19,.091,.155,side*.135,.06],[.25,.077,.09,side*.135,.008],[.31,.073,.08,side*.135,.005]],18),'pink',foot);
   add(loft([[.10,.097,.176,side*.135,.065],[.125,.099,.177,side*.135,.065]],18),'ivory',foot);
   for(const wx of [-.104,.104])for(const wz of [-.048,.17]){
    const g=new T.CylinderGeometry(.066,.066,.035,12);g.rotateZ(Math.PI/2);g.translate(side*.135+wx,.067,wz);add(g,'rose',foot);
    const hub=new T.CylinderGeometry(.025,.025,.039,10);hub.rotateZ(Math.PI/2);hub.translate(side*.135+wx,.067,wz);add(hub,'gold',foot);
   }
   for(let k=0;k<5;k++){const y=.17+k*.024,z=.21-k*.024;add(tube([[side*.135-.045,y,z],[side*.135+.04,y+.012,z-.01]],.005,2,4),'ivory',foot);}
   add(ellipsoid(side*.15,2,.0,.033,.054,.028),'skin',4);
   add(ellipsoid(side*.066,2.021,.119,.053,.026,.019),'ivory',4);
   add(ellipsoid(side*.064,2.02,.137,.024,.025,.009),'eye',4);
   add(ellipsoid(side*.064-.006,2.03,.145,.006,.007,.003),'ivory',4);
   add(tube([[side*.015,2.038,.126],[side*.068,2.05,.136],[side*.118,2.033,.12]],.007,10,4),'hair',4);
   add(tube([[side*.025,2.095,.12],[side*.065,2.105,.128],[side*.116,2.086,.112]],.013,10,4),'hair',4);
   const e=new T.TorusGeometry(.035,.006,5,12);e.translate(side*.162,1.932,.012);add(e,'gold',4);
   const bracelet=new T.TorusGeometry(.049,.009,5,12);bracelet.rotateX(Math.PI/2);bracelet.translate(side*.395,1.14,.015);add(bracelet,'pink',fore);
  }
  add(loft([[1.965,.018,.022,0,.14],[1.98,.023,.028,0,.148],[2.02,.012,.016,0,.135]],10),'skin',4);
  add(tube([[-.05,1.93,.117],[-.022,1.919,.13],[0,1.916,.135],[.022,1.919,.13],[.05,1.937,.116]],.012,12,5),'lip',4);
  add(tube([[-.035,1.932,.126],[0,1.927,.14],[.036,1.935,.127]],.006,12,4),'ivory',4);
  add(tube([[-.079,1.78,.035],[-.075,1.731,.111],[0,1.683,.143],[.075,1.731,.111],[.079,1.78,.035]],.006,18,4),'gold',2);
  const pendant=heart(.027);pendant.translate(0,1.68,.145);add(pendant,'pink',2);
  // Dense corkscrew locks with graduated head/hair-bone weights.
  for(let i=0;i<42;i++){
   const a=i*2.399963,ring=.17+(i%3)*.035,side=Math.sin(a)>0?1:-1;
   let x=Math.sin(a)*ring,z=Math.cos(a)*ring-.06;
   if(z>.07){x=side*(.18+Math.abs(x)*.4);z=.035;}
   const top=2.17+Math.cos(i*4)*.045,length=.83+(i%6)*.055,pts=[];
   for(let k=0;k<=34;k++){const t=k/34,phase=t*TAU*(4+i%3)+i,spread=Math.sin(t*Math.PI)*.11;pts.push([x+side*spread+Math.cos(phase)*(.028+t*.01),top-t*length,z-Math.sin(t*Math.PI)*.06+Math.sin(phase)*.03]);}
   add(tube(pts,.023+(i%3)*.003,38,5),i%5?'hair':'hairLight',4,z<-.12?19:side<0?17:18,(_,y)=>(1.98-y)/.7);
  }
  // Pink glasses are sculpted loops, sitting above the forehead.
  for(const side of [-1,1]){
   const g=new T.TorusGeometry(.062,.009,5,16);g.scale(1,.72,1);g.rotateX(-.5);g.translate(side*.071,2.19,.08);add(g,'pink',4);
  }
  add(tube([[-.015,2.19,.09],[0,2.2,.1],[.015,2.19,.09]],.007,5,4),'pink',4);
  this.meshes=[];
  for(const [name,v] of this.parts){
   const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(v.p,3));g.setAttribute('normal',new T.Float32BufferAttribute(v.n,3));g.setAttribute('skinIndex',new T.Uint16BufferAttribute(v.si,4));g.setAttribute('skinWeight',new T.Float32BufferAttribute(v.sw,4));
   const mesh=new T.SkinnedMesh(g,this.materials[name]);mesh.name='Mariam.'+name;mesh.frustumCulled=false;mesh.castShadow=true;mesh.receiveShadow=true;this.root.add(mesh);mesh.bind(this.skeleton);this.meshes.push(mesh);
  }
  this.parts.clear();this.phase=0;this.heading=Math.PI;this.speed=0;
 }
 animate(dt,state,heading){
  const b=this.bones,v=Math.abs(state.v),amount=Math.min(1,v/6);this.phase+=dt*(1.3+v*.45);
  const cycle=Math.sin(this.phase*TAU),lift=Math.cos(this.phase*TAU);
  this.heading+=Math.atan2(Math.sin(heading-this.heading),Math.cos(heading-this.heading))*(1-Math.exp(-dt*9));this.root.rotation.y=this.heading;
  const crouch=state.grounded?.08+amount*.12:.25;
  b[0].position.y=1.12-crouch*.3-Math.sin(Math.min(1,state.landing/.3)*Math.PI)*.07;
  b[1].rotation.x=amount*.12;b[2].rotation.z=-state.vl*.045;
  for(const [i,j,k,side] of [[5,6,7,-1],[8,9,10,1]]){
   const push=Math.max(0,cycle*side);
   b[i].rotation.set(-crouch+push*amount*.22,0,side*(.03+push*amount*.18));
   b[j].rotation.x=crouch*1.7+(state.grounded?Math.max(0,-lift*side)*amount*.2:.6);
   b[k].rotation.x=-crouch*.65;b[k].rotation.y=side*push*.12;
  }
  for(const [i,j,side] of [[11,12,-1],[14,15,1]]){
   b[i].rotation.x=-.1+cycle*side*amount*.22-(state.grounded?0:.35);b[i].rotation.z=side*(.08+amount*.12+(state.grounded?0:.3));b[j].rotation.x=-.25;
  }
  b[4].rotation.y=-state.vl*.055;b[4].rotation.x=-amount*.05;
  for(let i=17;i<20;i++){b[i].rotation.x=Math.sin(this.phase*2+i)*.025+amount*.1;b[i].rotation.z=-state.vl*.035+Math.sin(this.phase*3+i)*.022;}
  if(state.status==='won'){b[11].rotation.z=-1.9;b[14].rotation.z=1.9;b[4].rotation.z=Math.sin(this.phase*2)*.08;}
 }
 get stats(){return{bones:this.bones.length,skinnedMeshes:this.meshes.length,triangles:this.meshes.reduce((n,m)=>n+m.geometry.attributes.position.count/3,0),status:this.root.userData.status};}
}
