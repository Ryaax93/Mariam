import * as T from '../vendor/three.module.js';
const TAU=Math.PI*2, clamp=T.MathUtils.clamp, smooth=(a,b,x)=>{const t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t);};
// All surfaces below are authored geometry. No portrait plane, sprite or screen-space hair.
function loft(rows,n=20){
 const p=[],ix=[];
 for(const [y,rx,rz,cx=0,cz=0] of rows)for(let j=0;j<=n;j++){const a=j/n*TAU;p.push(cx+Math.sin(a)*rx,y,cz+Math.cos(a)*rz);}
 for(let k=0;k<rows.length-1;k++)for(let j=0;j<n;j++){const a=k*(n+1)+j,b=a+n+1;ix.push(a,a+1,b,b,a+1,b+1);}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setIndex(ix);g.computeVertexNormals();return g;
}
function tube(points,r=.012,segments=20,sides=6){return new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),segments,r,sides,false);}
function ellipsoid(x,y,z,rx,ry,rz,detail=16){const g=new T.SphereGeometry(1,detail,Math.min(10,Math.max(4,Math.floor(detail*.6))));g.scale(rx,ry,rz);g.translate(x,y,z);return g;}
function heart(size=.035){const s=new T.Shape();s.moveTo(0,-size);s.bezierCurveTo(-size*2,size*.2,-size,size*1.6,0,size*.6);s.bezierCurveTo(size,size*1.6,size*2,size*.2,0,-size);return new T.ExtrudeGeometry(s,{depth:.009,bevelEnabled:true,bevelSize:.003,bevelThickness:.002,bevelSegments:2,steps:1,curveSegments:7});}
function ribbon(points,widths,depth=.003){
 const p=[],ix=[];points.forEach(([x,y,z],i)=>{const w=widths[i];p.push(x,y-w,z,x,y+w,z+depth);if(i<points.length-1){const a=i*2;ix.push(a,a+2,a+1,a+1,a+2,a+3);}});
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setIndex(ix);g.computeVertexNormals();return g;
}
// Almond surface, including its domed cornea. Shape remains bounded by the eyelids.
function almond(cx,cy,cz,side){
 const p=[],ix=[],steps=20,rings=4;
 for(let r=0;r<=rings;r++)for(let j=0;j<=steps;j++){
  const a=j/steps*TAU,q=r/rings,x=Math.cos(a)*.052*q;
  const y=Math.sin(a)*(.025-.007*Math.abs(Math.cos(a)))*q+side*x*.10;
  p.push(cx+x,cy+y,cz+Math.sqrt(Math.max(0,1-q*q))*.014-.004*Math.abs(x)/.052);
 }
 for(let r=0;r<rings;r++)for(let j=0;j<steps;j++){const a=r*(steps+1)+j,b=a+steps+1;ix.push(a,b,a+1,a+1,b,b+1);}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setIndex(ix);g.computeVertexNormals();return g;
}
// Variable-section curl: a continuously tapered lock, not disconnected cylinders.
function curl(points,seed){
 const path=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),n=32,sides=5;
 const frames=path.computeFrenetFrames(n,false),p=[],ix=[];
 for(let i=0;i<=n;i++){
  const t=i/n,pt=path.getPointAt(t),r=(.017+.004*Math.sin(seed*4))*(.65+.35*Math.sin(Math.PI*t))*(1-.82*smooth(.72,1,t));
  for(let j=0;j<=sides;j++){const a=j/sides*TAU+.3*Math.sin(t*19+seed);const v=pt.clone().addScaledVector(frames.normals[i],Math.cos(a)*r).addScaledVector(frames.binormals[i],Math.sin(a)*r*.80);p.push(v.x,v.y,v.z);}
 }
 for(let i=0;i<n;i++)for(let j=0;j<sides;j++){const a=i*(sides+1)+j,b=a+sides+1;ix.push(a,a+1,b,b,a+1,b+1);}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setIndex(ix);g.computeVertexNormals();return g;
}
export class MariamRig{
 constructor(){
  this.root=new T.Group();this.root.name='Mariam / asset 3D V2';this.root.userData.status='reference-fidelity-unvalidated';
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
  const colors={skin:0xb8754e,hair:0x281613,hairLight:0x45251e,black:0x24222c,seam:0x3f3545,pink:0xe884b1,rose:0xb83c70,ivory:0xffe8d9,gold:0xd4a25b,eye:0x211410,iris:0x6c3526,lip:0x9e4251};
  this.materials={};this.parts=new Map();
  for(const [k,color] of Object.entries(colors))this.materials[k]=new T.MeshStandardMaterial({color,roughness:k==='gold'?.29:k==='pink'?.38:k==='hair'||k==='hairLight'?.49:k==='skin'?.62:k==='eye'?.27:.82,metalness:k==='gold'?.65:0});
  const add=(g,key,bone,other=bone,weight=null,morph=null)=>{
   const geom=g.index?g.toNonIndexed():g;const pos=geom.attributes.position,normal=geom.attributes.normal;
   if(!this.parts.has(key))this.parts.set(key,{p:[],n:[],si:[],sw:[],blink:[],smile:[]});const out=this.parts.get(key);
   for(let j=0;j<pos.count;j++){
    const x=pos.getX(j),y=pos.getY(j),z=pos.getZ(j);out.p.push(x,y,z);out.n.push(normal.getX(j),normal.getY(j),normal.getZ(j));
    const w=weight?clamp(weight(x,y,z),0,1):0;out.si.push(bone,other,0,0);out.sw.push(1-w,w,0,0);
    const delta=morph?morph(x,y,z):null;out.blink.push(...(delta?.blink||[0,0,0]));out.smile.push(...(delta?.smile||[0,0,0]));
   }
   if(geom!==g)geom.dispose();g.dispose();
  };
  const faceSmile=(x,y,z)=>({smile:[Math.sign(x)*.003*Math.abs(x)/.15, .012*Math.pow(Math.abs(x)/.15,2)*Math.exp(-Math.pow((y-1.93)/.055,2)),.002]});
  // A shaped torso with a natural waist, shoulder slope and separate hem/neckline.
  add(loft([[1.20,.181,.116],[1.28,.158,.105],[1.36,.157,.104],[1.45,.179,.118],[1.55,.211,.133],[1.63,.225,.119],[1.69,.205,.098],[1.74,.106,.076],[1.80,.075,.067]],28),'skin',0,2,(_,y)=>smooth(1.25,1.64,y));
  add(loft([[1.425,.173,.116],[1.442,.175,.118],[1.50,.196,.133],[1.58,.226,.137],[1.65,.229,.114],[1.69,.197,.095]],28),'black',1,2,(_,y)=>smooth(1.43,1.67,y));
  add(loft([[1.423,.175,.118],[1.441,.177,.119]],28),'seam',1);
  add(loft([[1.035,.194,.13],[1.10,.219,.143],[1.17,.224,.143],[1.23,.195,.125],[1.28,.171,.113],[1.30,.170,.112]],28),'black',0);
  add(loft([[1.276,.173,.115],[1.301,.173,.115]],28),'seam',0);
  for(const side of [-1,1])add(tube([[side*.151,1.637,.121],[side*.17,1.722,.052],[side*.167,1.733,-.038],[side*.15,1.645,-.114]],.023,14,7),'black',2);
  add(loft([[1.73,.077,.068],[1.82,.071,.065],[1.88,.084,.073]],20),'skin',3);
  // Custom face topology: cheek volume, tapered jaw, forehead and brow ridge.
  const head=loft([[1.849,.012,.019,0,.045],[1.868,.063,.053,0,.043],[1.893,.105,.082,0,.031],[1.925,.139,.106,0,.018],[1.965,.162,.125,0,.004],[2.005,.167,.133,0,-.001],[2.045,.162,.131,0,-.004],[2.09,.154,.125,0,-.009],[2.145,.141,.115,0,-.014],[2.19,.102,.089,0,-.018],[2.215,.031,.032,0,-.021],[2.217,.002,.002,0,-.021]],36);
  // Raise cheek apples and soften the lower face instead of adding spheres to it.
  const hp=head.attributes.position;for(let i=0;i<hp.count;i++){const x=hp.getX(i),y=hp.getY(i),z=hp.getZ(i);if(z>.015){const cheek=.012*Math.exp(-Math.pow((Math.abs(x)-.102)/.052,2)-Math.pow((y-1.966)/.04,2));hp.setZ(i,z+cheek);}}
  head.computeVertexNormals();add(head,'skin',4,4,null,faceSmile);
  for(const side of [-1,1]){
   const hip=side<0?5:8,knee=hip+1,foot=hip+2,arm=side<0?11:14,fore=arm+1,hand=arm+2;
   add(loft([[.21,.054,.061,side*.135],[.32,.060,.07,side*.135],[.44,.077,.082,side*.135],[.54,.078,.079,side*.135],[.62,.075,.076,side*.135],[.70,.089,.091,side*.137],[.83,.114,.116,side*.14],[1.02,.13,.13,side*.135],[1.13,.125,.119,side*.12]],22),'black',hip,knee,(_,y)=>1-smooth(.54,.74,y));
   add(tube([[side*.25,1.1,.015],[side*.257,.9,.011],[side*.216,.66,.007],[side*.207,.43,.008],[side*.191,.26,.012]],.004,22,4),'seam',hip,knee,(_,y)=>1-smooth(.54,.74,y));
   add(loft([[1.074,.031,.03,side*.40,.02],[1.12,.038,.035,side*.397,.02],[1.22,.051,.045,side*.381,.015],[1.31,.058,.05,side*.367,.009],[1.36,.056,.05,side*.358,.004],[1.43,.061,.055,side*.333,0],[1.53,.071,.067,side*.293,0],[1.63,.074,.073,side*.26,0],[1.68,.053,.057,side*.245,0]],20),'skin',arm,fore,(_,y)=>1-smooth(1.31,1.46,y));
   // Palm and five individually shaped digits, with wrist deformation.
   add(loft([[1.009,.029,.018,side*.405,.024],[1.035,.037,.023,side*.405,.022],[1.073,.037,.025,side*.402,.021],[1.11,.031,.029,side*.398,.02]],16),'skin',fore,hand,(_,y)=>1-smooth(1.045,1.105,y));
   for(let f=0;f<4;f++){
    const x=side*(.379+f*.0175),len=[.052,.067,.063,.049][f];
    add(loft([[.998-len,.002,.002,x,.033],[1.004-len,.007,.008,x,.031],[1.025-len,.0085,.009,x,.024],[1.03,.009,.010,x,.021]],10),'skin',hand);
    add(ellipsoid(x,1.01-len,.039,.006,.009,.002,8),'pink',hand);
   }
   add(tube([[side*.378,1.072,.023],[side*.365,1.056,.036],[side*.362,1.034,.045],[side*.368,1.022,.048]],.012,10,6),'skin',hand);
   add(loft([[.245,.061,.064,side*.135],[.32,.062,.066,side*.135],[.35,.063,.067,side*.135]],18),'ivory',foot);
   for(let j=0;j<3;j++)add(loft([[.319+j*.009,.064,.068,side*.135],[.321+j*.009,.064,.068,side*.135]],16),'pink',foot);
   // Boot shell, raised tongue, scalloped collar, sole and toe stop.
   add(loft([[.112,.082,.151,side*.135,.064],[.14,.092,.17,side*.135,.07],[.177,.092,.165,side*.135,.064],[.207,.085,.143,side*.135,.043],[.26,.075,.092,side*.135,.007],[.311,.072,.081,side*.135,.003]],24),'pink',foot);
   add(loft([[.10,.096,.173,side*.135,.065],[.12,.098,.176,side*.135,.065],[.128,.095,.172,side*.135,.065]],24),'ivory',foot);
   add(loft([[.307,.075,.083,side*.135,.003],[.321,.074,.082,side*.135,.003]],20),'rose',foot);
   add(tube([[side*.18,.21,.151],[side*.178,.264,.099],[side*.17,.316,.083]],.008,8,5),'rose',foot);
   add(ellipsoid(side*.135,.075,.227,.038,.024,.031,12),'rose',foot);
   for(const wx of [-.103,.103])for(const wz of [-.049,.165]){
    const g=new T.CylinderGeometry(.064,.064,.039,14);g.rotateZ(Math.PI/2);g.translate(side*.135+wx,.066,wz);add(g,'rose',foot);
    const hub=new T.CylinderGeometry(.026,.026,.043,12);hub.rotateZ(Math.PI/2);hub.translate(side*.135+wx,.066,wz);add(hub,'gold',foot);
    const pin=new T.CylinderGeometry(.011,.011,.045,8);pin.rotateZ(Math.PI/2);pin.translate(side*.135+wx,.066,wz);add(pin,'ivory',foot);
   }
   for(let k=0;k<5;k++){
    const y=.177+k*.025,z=.218-k*.027;
    add(tube([[side*.135-.038,y,z],[side*.135+.038,y+.017,z-.017]],.0043,2,4),'ivory',foot);
    add(tube([[side*.135+.038,y,z],[side*.135-.038,y+.017,z-.017]],.0043,2,4),'ivory',foot);
    for(const edge of [-1,1])add(ellipsoid(side*.135+edge*.039,y,z,.007,.007,.004,8),'gold',foot);
   }
   // Ears sit in the hairline; warm tiny inner concha.
   add(ellipsoid(side*.159,1.992,-.008,.027,.047,.022),'skin',4);
   add(ellipsoid(side*.175,1.994,.003,.009,.026,.013,10),'lip',4);
   const cx=side*.067,cy=2.019,cz=.126;
   const blink=(x,y,z)=>({blink:[0,(cy-y)*.95,-.005],smile:[0,.002*Math.abs(x)/.13,0]});
   add(almond(cx,cy,cz,side),'ivory',4,4,null,blink);
   add(ellipsoid(cx-side*.002,cy,.141,.024,.023,.0055,16),'iris',4,4,null,blink);
   add(ellipsoid(cx-side*.003,cy,.146,.0125,.018,.003,12),'eye',4,4,null,blink);
   add(ellipsoid(cx-.007,cy+.009,.149,.0045,.005,.0015,8),'ivory',4,4,null,blink);
   const eyelid=[[-.052,-.005],[-.029,.02],[0,.026],[.029,.021],[.053,.006]].map(([x,y])=>[cx+x,cy+y+side*x*.1,.127+(1-Math.abs(x)/.057)*.012]);
   add(tube(eyelid,.0045,14,5),'eye',4,4,null,(x,y,z)=>({blink:[0,(cy-y)*1.05,0],smile:[0,.001,0]}));
   for(let j=0;j<2;j++){const x=cx+side*(.043+j*.008);add(tube([[x,cy+.016,.131],[x+side*.009,cy+.026+j*.004,.136]],.003,2,4),'eye',4,4,null,blink);}
   add(tube([[cx-.05,cy-.006,.126],[cx,cy-.024,.134],[cx+.05,cy+.002,.126]],.003,12,4),'lip',4,4,null,blink);
   const browPoints=[[side*.021,2.084,.121],[side*.048,2.096,.129],[side*.080,2.098,.125],[side*.111,2.085,.110],[side*.124,2.076,.100]];
   // A tapered, planar eyebrow instead of cylindrical rods.
   const brow=ribbon(side<0?[...browPoints].reverse():browPoints,side<0?[.002,.006,.009,.008,.005]:[.005,.008,.009,.006,.002]);
   this.materials.hair.side=T.DoubleSide;add(brow,'hair',4,4,null,(x,y,z)=>({smile:[0,.004*Math.abs(x)/.13,0]}));
   const e=new T.TorusGeometry(.028,.005,6,14);e.translate(side*.17,1.933,.006);add(e,'gold',4);
   const charm=heart(.010);charm.translate(side*.17,1.902,.006);add(charm,'pink',4);
   for(let row=0;row<2;row++)for(let bead=0;bead<10;bead++){
    const a=bead/10*TAU;add(ellipsoid(side*.397+Math.cos(a)*.041,1.133+row*.019,.018+Math.sin(a)*.038,.009,.009,.009,8),bead%3?'pink':'ivory',fore);
   }
  }
  // Nose bridge, tip and nostril wings form one tapering surface.
  add(loft([[1.968,.009,.004,0,.148],[1.973,.023,.011,0,.15],[1.982,.026,.016,0,.15],[1.996,.018,.018,0,.143],[2.02,.012,.009,0,.133],[2.037,.014,.004,0,.125]],18),'skin',4);
  for(const side of [-1,1])add(ellipsoid(side*.016,1.975,.164,.005,.0025,.0025,8),'iris',4);
  // Sculpted Cupid's bow and lower lip; restrained smile, no permanent wide grin.
  const lipMorph=(x,y,z)=>({smile:[Math.sign(x)*.008*smooth(.012,.05,Math.abs(x)),.009*smooth(.015,.05,Math.abs(x)),-.002*smooth(.01,.05,Math.abs(x))]});
  add(ribbon([[-.047,1.935,.112],[-.027,1.936,.127],[-.012,1.941,.134],[0,1.937,.138],[.012,1.941,.134],[.027,1.936,.127],[.047,1.935,.112]],[.001,.006,.006,.005,.006,.006,.001],.002),'lip',4,4,null,lipMorph);
  add(tube([[-.044,1.934,.114],[-.024,1.929,.132],[0,1.927,.141],[.024,1.929,.132],[.044,1.934,.114]],.008,16,6),'lip',4,4,null,lipMorph);
  add(tube([[-.034,1.934,.126],[0,1.932,.144],[.034,1.934,.126]],.0027,12,4),'eye',4,4,null,lipMorph);
  add(tube([[-.078,1.785,.033],[-.07,1.735,.105],[0,1.692,.141],[.07,1.735,.105],[.078,1.785,.033]],.0045,20,5),'gold',2);
  const pendant=heart(.023);pendant.translate(0,1.683,.146);add(pendant,'pink',2);
  // Parted scalp joins flowing locks, avoiding the two raised 'horns' of V1.
  add(loft([[2.045,.163,.13,0,-.037],[2.105,.181,.147,0,-.029],[2.16,.176,.152,0,-.029],[2.206,.142,.129,0,-.026],[2.24,.086,.087,0,-.023],[2.255,.003,.003,0,-.021]],30),'hair',4);
  // Back and side mantle: roots follow the head curvature, curls widen below the ears.
  for(let i=0;i<66;i++){
   const ring=i%3,j=Math.floor(i/3),a=.67+(j/21)*(TAU-1.34),side=Math.sin(a)>=0?1:-1;
   const rootY=2.22-ring*.047,baseX=Math.sin(a)*(.10+ring*.039),baseZ=Math.cos(a)*(.10+ring*.038)-.032;
   const extent=.212+ring*.018,px=Math.sin(a)*extent,pz=Math.cos(a)*extent-.057;
   const length=.96+(i%5)*.043-ring*.016,pts=[];
   for(let k=0;k<=42;k++){
    const t=k/42,q=smooth(0,.2,t),wave=t*TAU*(5+(i%3)*.45)+i*.81;
    const radius=(.018+.004*(i%3))*smooth(.025,.12,t)*(1-.45*smooth(.8,1,t));
    const spread=Math.sin(t*Math.PI)*(.043+ring*.009);
    pts.push([baseX*(1-q)+px*q+Math.sin(a)*spread+Math.cos(wave)*radius,rootY-t*length,baseZ*(1-q)+pz*q-Math.sin(t*Math.PI)*.024+Math.sin(wave)*radius]);
   }
   add(curl(pts,i),i%9===0?'hairLight':'hair',4,pz<-.12?19:side<0?17:18,(_,y)=>smooth(2.02,1.29,y));
  }
  // Six face-framing, S-shaped locks grow from the part and sweep around the cheeks.
  for(const side of [-1,1])for(let j=0;j<3;j++){
   const pts=[];for(let k=0;k<=40;k++){
    const t=k/40,join=smooth(0,.22,t),wave=t*TAU*(5+j*.3)+j;
    const x=side*(.025+j*.032+join*(.165-j*.016)+Math.sin(t*Math.PI)*.067);
    const z=.075+Math.sin(t*Math.PI)*.022-t*.017;
    pts.push([x+Math.cos(wave)*.02*join,2.241-j*.019-t*(1.02-j*.04),z+Math.sin(wave)*.019*join]);
   }
   add(curl(pts,j+side*4),j===0?'hairLight':'hair',4,side<0?17:18,(_,y)=>smooth(2.02,1.34,y));
  }
  // Sunglasses: rounded cat-eye frames, real arms, dark inset lenses.
  for(const side of [-1,1]){
   const cx=side*.075,pts=[];
   for(let i=0;i<=28;i++){const a=i/28*TAU;pts.push([cx+Math.cos(a)*.064,2.225+Math.sin(a)*.043,.088-Math.sin(a)*.018]);}
   add(tube(pts,.0065,28,5),'pink',4);
   add(ellipsoid(cx,2.225,.087,.052,.032,.003,14),'iris',4);
   add(tube([[side*.136,2.228,.085],[side*.178,2.217,.04],[side*.174,2.188,-.065]],.006,10,5),'pink',4);
  }
  add(tube([[-.013,2.226,.092],[0,2.234,.1],[.013,2.226,.092]],.006,7,5),'pink',4);
  this.meshes=[];
  for(const [name,v] of this.parts){
   const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(v.p,3));g.setAttribute('normal',new T.Float32BufferAttribute(v.n,3));g.setAttribute('skinIndex',new T.Uint16BufferAttribute(v.si,4));g.setAttribute('skinWeight',new T.Float32BufferAttribute(v.sw,4));
   if(v.blink.some(Boolean)||v.smile.some(Boolean)){g.morphTargetsRelative=true;g.morphAttributes.position=[new T.Float32BufferAttribute(v.blink,3),new T.Float32BufferAttribute(v.smile,3)];g.morphAttributes.position[0].name='clignement';g.morphAttributes.position[1].name='sourire';}
   const mesh=new T.SkinnedMesh(g,this.materials[name]);mesh.name='Mariam.'+name;mesh.frustumCulled=false;mesh.castShadow=true;mesh.receiveShadow=true;this.root.add(mesh);mesh.bind(this.skeleton);this.meshes.push(mesh);
  }
  this.parts.clear();this.phase=0;this.heading=Math.PI;this.speed=0;this.age=0;this.smile=.32;
 }
 animate(dt,state,heading){
  const b=this.bones,v=Math.abs(state.v||0),amount=Math.min(1,v/6),air=!state.grounded;
  this.age+=dt;this.phase+=dt*(.72+v*.25);
  const cycle=Math.sin(this.phase*TAU),lift=Math.cos(this.phase*TAU),land=clamp((state.landing||0)/.4,0,1),impact=Math.sin(land*Math.PI);
  const phase=clamp(state.trickPhase??state.trick??0,0,1),pose=Math.sin(Math.PI*phase),trick=state.trickName||'rotation';
  const turn=smooth(.03,.88,phase),damp=1-Math.exp(-dt*10);
  this.heading+=Math.atan2(Math.sin(heading-this.heading),Math.cos(heading-this.heading))*(1-Math.exp(-dt*8));
  // Spin has a clear wind-up and landing; the other figures are articulated poses.
  const spin=air&&trick==='rotation'?TAU*turn:air&&trick==='rythme'?TAU*turn:0;
  this.root.rotation.y=this.heading+spin;this.root.rotation.z=0;this.root.rotation.x=0;
  const crouch=air?.20:.07+amount*.12;
  b[0].position.y=1.12-crouch*.26-impact*.105;
  b[0].rotation.set(0,0,0);b[1].rotation.set(amount*.10,0,0);b[2].rotation.set(0,0,-(state.vl||0)*.036);
  const targets={};const set=(i,x=0,y=0,z=0)=>targets[i]=[x,y,z];
  for(const [i,j,k,side] of [[5,6,7,-1],[8,9,10,1]]){
   const push=Math.max(0,cycle*side),stride=state.grounded?amount:0;
   set(i,-crouch+push*stride*.24-impact*.14,side*push*stride*.08,side*(.025+push*stride*.20));
   set(j,crouch*1.65+(state.grounded?Math.max(0,-lift*side)*stride*.22:.48)+impact*.24);
   set(k,-crouch*.65,side*push*stride*.11);
  }
  for(const [i,j,k,side] of [[11,12,13,-1],[14,15,16,1]]){
   set(i,-.06+cycle*side*amount*.17-(air?.28:0),0,side*(.05+amount*.10+(air?.22:0)));
   set(j,-.15-amount*.08,0,side*.015);set(k,.03,0,side*.04);
  }
  if(air&&phase>0){
   if(trick==='rotation'){
    set(11,-.48*pose,0,-.18);set(14,-.48*pose,0,.18);set(12,-.8*pose);set(15,-.8*pose);
    set(5,-.30-.2*pose,0,-.03);set(8,-.30-.2*pose,0,.03);set(6,.65+.3*pose);set(9,.65+.3*pose);
   }else if(trick==='etoile'){
    set(11,-.08,0,-1.42*pose);set(14,-.08,0,1.42*pose);set(12,-.04);set(15,-.04);
    set(5,-.15,0,-.54*pose);set(8,-.15,0,.54*pose);set(6,.13);set(9,.13);set(13,0,0,-.3*pose);set(16,0,0,.3*pose);
   }else if(trick==='arabesque'){
    set(5,-.9*pose,0,-.09);set(6,.17);set(8,.68*pose,0,.11);set(9,.27);
    set(11,-.65*pose,0,-1.1*pose);set(14,.52*pose,0,.86*pose);set(12,-.1);set(15,-.12);b[1].rotation.x=-.12*pose;
   }else if(trick==='croise'){
    const tuck=Math.sin(Math.PI*smooth(0,.62,phase));
    set(5,-.7*tuck,0,.21*pose);set(8,-.55*tuck,0,-.18*pose);set(6,.35+1.05*tuck);set(9,.35+1.05*tuck);
    set(11,-.62*pose,0,-.64*pose);set(14,-.6*pose,0,.64*pose);set(12,-.42*pose);set(15,-.42*pose);b[2].rotation.y=.22*Math.sin(phase*TAU);
   }else if(trick==='rythme'){
    const beat=Math.sin(phase*TAU);set(11,-.6*pose,0,-(.6+.55*beat)*pose);set(14,-.6*pose,0,(.6-.55*beat)*pose);
    set(12,-.7*pose);set(15,-.7*pose);set(5,-.45*pose,0,-.16*pose);set(8,-.45*pose,0,.16*pose);set(6,.4+.7*Math.max(0,beat));set(9,.4+.7*Math.max(0,-beat));
   }
  }
  // Different landing recoveries preserve a readable silhouette and both skates on the track.
  if(!air&&impact>0){
   if(trick==='etoile'){targets[11][2]-=impact*.55;targets[14][2]+=impact*.55;}
   if(trick==='arabesque'){targets[11][0]-=impact*.4;targets[14][0]+=impact*.28;}
   if(trick==='croise'){targets[12][0]-=impact*.45;targets[15][0]-=impact*.45;}
  }
  if(state.status==='won'){set(11,-.15,0,-1.9);set(14,-.15,0,1.9);set(12,-.5);set(15,-.5);b[0].position.y+=Math.sin(this.age*3)*.015;}
  for(const [i,r] of Object.entries(targets)){const rotation=b[Number(i)].rotation;rotation.x+=(r[0]-rotation.x)*damp;rotation.y+=(r[1]-rotation.y)*damp;rotation.z+=(r[2]-rotation.z)*damp;}
  b[4].rotation.y=-(state.vl||0)*.04;b[4].rotation.x=-amount*.035;b[4].rotation.z=state.status==='won'?Math.sin(this.age*2)*.06:Math.sin(this.age*.9)*.012;
  for(let i=17;i<20;i++){const x=Math.sin(this.phase*2+i)*.018+amount*.075+(air?.04:0);b[i].rotation.x+=(x-b[i].rotation.x)*(1-Math.exp(-dt*4));b[i].rotation.z+=(-(state.vl||0)*.024+Math.sin(this.phase*3+i)*.016-b[i].rotation.z)*(1-Math.exp(-dt*5));}
  // Two real position morph targets: eyelid closure and a subtle cheek/lip smile.
  const blinkCycle=this.age%4.7,blink=blinkCycle<.16?Math.sin(blinkCycle/.16*Math.PI):0;
  this.smile+=((state.status==='won'?.95:air?.72:.32)-this.smile)*(1-Math.exp(-dt*4));
  for(const m of this.meshes)if(m.morphTargetInfluences){m.morphTargetInfluences[0]=blink;m.morphTargetInfluences[1]=this.smile;}
 }
 get stats(){return{bones:this.bones.length,skinnedMeshes:this.meshes.length,triangles:this.meshes.reduce((n,m)=>n+m.geometry.attributes.position.count/3,0),morphTargets:['clignement','sourire'],figures:['rotation','etoile','arabesque','croise','rythme'],status:this.root.userData.status};}
}
