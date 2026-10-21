export const LENGTH=220, BPM=108, SAVE_KEY='mariam-luna-slice-v1';
export const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
export function center(s){return 7*Math.sin(s/32)-2*Math.sin(s/14);}
export function slope(s){return 7/32*Math.cos(s/32)-2/14*Math.cos(s/14);}
export function width(s){const smooth=x=>{x=clamp(x,0,1);return x*x*(3-2*x);};return 6.6-1.2*smooth((s-24)/16)+.8*smooth((s-172)/16);}
export function floor(s,lane){
 if(Math.abs(lane)>width(s)+1.2)return null;
 if(Math.abs(lane)>width(s))return -.025;
 if(s>116&&s<122&&Math.abs(lane)<2.4)return null;
 if(s>104&&s<=116&&Math.abs(lane)<2.4)return (s-104)/12*1.35;
 return 0;
}
export function worldPoint(s,lane=0,y=0){return{x:center(s)+lane,y,z:-s};}
export const GATES=Array.from({length:12},(_,i)=>({id:i,s:18+i*16,lane:[0,-2.4,2.4,0,2.4,-2.4,0,0,-2.4,2.4,-2.4,0][i]}));
export const CHECKPOINTS=[0,74,144];
export const OBSTACLES=[{s:54,lane:1.8,r:.72},{s:92,lane:-1.8,r:.72},{s:164,lane:0,r:.8}];
export function beatDistance(time){const t=time*BPM/60;return Math.abs(t-Math.round(t));}
