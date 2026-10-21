// Original 108 BPM composition. No copyrighted recordings or third-party audio assets.
export class LunaAudio{
 constructor(){this.ctx=null;this.enabled=true;this.next=0;this.step=0;this.nodes=new Set();this.playing=false;}
 async unlock(){if(!this.enabled)return;try{if(!this.ctx){this.ctx=new (window.AudioContext||window.webkitAudioContext)();this.master=this.ctx.createGain();this.master.gain.value=.25;this.master.connect(this.ctx.destination);}await this.ctx.resume();this.next=this.ctx.currentTime+.05;}catch{this.enabled=false;}}
 tone(freq,time,duration,gain=.1,type='sine'){
  if(!this.ctx||!this.enabled)return;const o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(0,time);g.gain.linearRampToValueAtTime(gain,time+.012);g.gain.exponentialRampToValueAtTime(.001,time+duration);o.connect(g);g.connect(this.master);o.start(time);o.stop(time+duration+.01);this.nodes.add(o);o.onended=()=>{o.disconnect();g.disconnect();this.nodes.delete(o);};
 }
 tick(active,progress,elapsed=0){
  if(!this.ctx||!this.enabled||this.ctx.state!=='running')return;
  if(!active){if(this.playing)this.stop();return;}if(!this.playing){this.step=Math.ceil(elapsed*108/60*2);this.next=this.ctx.currentTime+(this.step*60/108/2-elapsed);}this.playing=true;
  const now=this.ctx.currentTime;if(this.next<now)this.next=now+.025;
  while(this.next<now+.12){
   const beat=this.step%8,chord=[[261.63,329.63,392],[220,261.63,329.63],[174.61,220,261.63],[196,246.94,293.66]][Math.floor(this.step/16)%4];
   if(beat===0)chord.forEach((n,i)=>this.tone(n,this.next+i*.025,1.4,.045,'triangle'));
   this.tone(chord[beat%3]*(beat%2?2:1),this.next,.21,.05);
   if(beat%2===0){this.tone(chord[0]/2,this.next,.24,.12,'triangle');this.tone(65,this.next,.07,.12);}
   if(progress>.55&&beat%2===1)this.tone(chord[(beat+1)%3]*4,this.next,.12,.025);
   this.next+=60/108/2;this.step++;
  }
 }
 effect(kind,data){if(!this.ctx||!this.enabled)return;const t=this.ctx.currentTime;if(kind==='note'){[659.25,783.99].forEach((n,i)=>this.tone(n,t+i*.06,.2,.1));}else if(kind==='land'&&data){const notes=data.name==='rythme'?[523,659,784,1047]:[523,659,784];notes.forEach((n,i)=>this.tone(n,t+i*.055,.22,.07,'triangle'));}else if(kind==='rose'){[784,988,1175].forEach((n,i)=>this.tone(n,t+i*.09,.3,.06));}else if(kind==='jump')this.tone(440,t,.12,.04);else if(kind==='win'){[261.63,329.63,392,523.25,659.25].forEach((n,i)=>this.tone(n,t+i*.1,1,.07));}}
 stop(){for(const n of [...this.nodes])try{n.stop();}catch{}this.nodes.clear();this.playing=false;if(this.ctx)this.next=this.ctx.currentTime+.05;}
 setEnabled(v){this.enabled=v;if(!v)this.stop();else this.unlock();}
 suspend(){this.stop();this.ctx?.suspend();}
}
