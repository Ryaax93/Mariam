// A contact owns exactly one control. Touch.identifier is never confused with pointerId.
export class ControlState {
 constructor(){this.contacts=new Map();this.keys=new Set();this.x=0;this.y=0;this.stick=null;}
 begin(id,action){if(this.contacts.has(id)||(action==='stick'&&this.stick!==null))return false;this.contacts.set(id,action);if(action==='stick')this.stick=id;return true;}
 move(id,x,y){if(id!==this.stick)return;const n=Math.max(1,Math.hypot(x,y));this.x=x/n;this.y=y/n;}
 end(id){if(id===this.stick){this.stick=null;this.x=this.y=0;}this.contacts.delete(id);}
 reset(){this.contacts.clear();this.keys.clear();this.stick=null;this.x=this.y=0;}
 read(){const has=k=>this.keys.has(k),a=[...this.contacts.values()],clip=v=>Math.max(-1,Math.min(1,v));return {forward:clip(-this.y+(has('ArrowUp')||has('KeyW')||has('KeyZ')?1:0)-(has('ArrowDown')||has('KeyS')?1:0)),steer:clip(this.x+(has('ArrowRight')||has('KeyD')?1:0)-(has('ArrowLeft')||has('KeyA')||has('KeyQ')?1:0)),jump:a.includes('jump')||has('Space'),boost:a.includes('boost')||has('ShiftLeft')||has('ShiftRight')};}
}
export function bindControls(elements,active){
 const state=new ControlState(),owners=new Map(),types=new Map();
 const paint=()=>{const r=elements.stick.getBoundingClientRect();elements.stick.firstElementChild.style.transform=`translate(${state.x*r.width*.29}px,${state.y*r.height*.29}px)`;for(const name of ['jump','boost'])elements[name].classList.toggle('pressed',[...state.contacts.values()].includes(name));};
 const end=id=>{const el=owners.get(id);owners.delete(id);types.delete(id);state.end(id);try{if(el?.hasPointerCapture(id))el.releasePointerCapture(id);}catch{}paint();};
 const clear=()=>{const ids=[...owners.keys()];state.reset();for(const id of ids)end(id);paint();};
 const move=e=>{if(!owners.has(e.pointerId))return;if(!active()||e.buttons===0){end(e.pointerId);return;}if(e.pointerId===state.stick){const r=elements.stick.getBoundingClientRect();state.move(e.pointerId,(e.clientX-r.left-r.width/2)/(r.width*.38),(e.clientY-r.top-r.height/2)/(r.height*.38));paint();}};
 for(const [action,el] of Object.entries(elements)){
  el.addEventListener('pointerdown',e=>{if(!active()||e.button!==0||!state.begin(e.pointerId,action))return;e.preventDefault();owners.set(e.pointerId,el);types.set(e.pointerId,e.pointerType);try{el.setPointerCapture(e.pointerId);}catch{}move(e);paint();});el.addEventListener('contextmenu',e=>e.preventDefault());
 }
 window.addEventListener('pointermove',move,{capture:true});
 for(const name of ['pointerup','pointercancel','lostpointercapture'])window.addEventListener(name,e=>end(e.pointerId),{capture:true});
 const reconcile=e=>{for(const [id,el] of [...owners])if(types.get(id)==='touch'&&![...e.touches].some(t=>el===t.target||el.contains(t.target)))end(id);};
 for(const name of ['touchend','touchcancel'])window.addEventListener(name,reconcile,{capture:true,passive:true});
 window.addEventListener('blur',clear);window.addEventListener('pagehide',clear);window.addEventListener('orientationchange',clear);screen.orientation?.addEventListener('change',clear);document.addEventListener('visibilitychange',()=>{if(document.hidden)clear();});
 document.addEventListener('keydown',e=>{if(active()&&/^(Arrow(Up|Down|Left|Right)|Space|Shift(Left|Right)|Key[WASDZQ])$/.test(e.code)){e.preventDefault();state.keys.add(e.code);}});document.addEventListener('keyup',e=>state.keys.delete(e.code));
 return {state,read:()=>state.read(),clear,diagnostics:()=>({contacts:state.contacts.size,stick:state.stick,captures:owners.size})};
}
