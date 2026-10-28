export const FIGURES={rotation:{label:'Tour de lune',points:100},etoile:{label:'Étoile ouverte',points:125},arabesque:{label:'Arabesque',points:125},croise:{label:'Croisé aérien',points:150},rythme:{label:'Éclat du rythme',points:200}};
export function chooseFigure(input,speed,onBeat){if(input.boost&&speed>8&&onBeat)return 'rythme';if(input.boost&&speed>6)return 'croise';if(input.steer<-.3)return 'arabesque';if(input.steer>.3)return 'etoile';return 'rotation';}
export const ROSES=[{id:0,s:46,lane:-3.9},{id:1,s:128,lane:3.8},{id:2,s:194,lane:-3.8}];
export const SWEEPERS=[{id:0,s:86,amplitude:2.8,speed:.85,phase:1.2},{id:1,s:174,amplitude:2.8,speed:.7,phase:.3}];
export const sweeperLane=(h,time)=>Math.sin(time*h.speed+h.phase)*h.amplitude;
