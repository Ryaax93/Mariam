export const WORLDS = [
 {id:'luna',name:'Luna Park',subtitle:'Du rythme sous les étoiles',accent:'#c9a4ff',sky:0x151432,fog:0x332652,ground:0x6655af,edge:0xb484f5,collect:'notes',singular:'note',theme:'roller',mechanic:'Prends de la vitesse, saute les coupures et esquive les projecteurs.',icon:'roller'},
 {id:'sweet',name:'Cookie Kingdom',subtitle:'Ton péché mignon, en grand',accent:'#ffbf97',sky:0xf5c8bb,fog:0xf4c3b1,ground:0xd6a067,edge:0xffd4b2,collect:'gourmandises',singular:'gourmandise',theme:'sweet',mechanic:'Rebondis sur les guimauves et traverse les îles de Cookie Dough.',icon:'ice'},
 {id:'noel',name:'December Dream',subtitle:'Le plus doux des hivers',accent:'#a4e6dd',sky:0x142c43,fog:0x345267,ground:0xc4e9f0,edge:0x75c4d7,collect:'cadeaux',singular:'cadeau',theme:'winter',mechanic:'Patine sur la glace, évite les boules de neige et rapporte les cadeaux.',icon:'tree'}
];
const P=(x,z,w=5,d=5,y=0,kind='normal',more={})=>({x,z,w,d,y,kind,...more});
const H=(x,z,axis='x',range=1.5,speed=1.8)=>({x,z,axis,range,speed,r:.48});
const layouts=[
 [P(0,0,7,8),P(0,-7,5,4),P(-1.5,-13,5,5),P(1.2,-19.5,5,5),P(0,-26,6,5),P(0,-33,7,7)],
 [P(0,0,7,7),P(-2,-7,4,4),P(1,-13,4.5,4.5,0,'boost'),P(-1.5,-20,4,5,0,'moving',{axis:'x',range:1.1,speed:.7}),P(2,-27,4,4),P(0,-34,6,5),P(0,-41,7,7)],
 [P(0,0,7,7),P(0,-7,4.5,4.5,0,'boost'),P(-2,-14,4,5),P(1,-21,4.5,5,0,'moving',{axis:'x',range:1,speed:1}),P(0,-28,5,4,0,'boost'),P(-1,-35,4.5,4.5),P(1,-42,5,5),P(0,-49,7,7)],
 [P(0,0,7,7),P(-1,-7,5,5,0,'bounce'),P(0,-14,5,5,.8),P(2,-21,5,5,.4),P(-1,-28,5,5,0,'bounce'),P(0,-36,7,7,1)],
 [P(0,0,7,7),P(-2,-7,4.5,5),P(1,-14,5,5,0,'moving',{axis:'x',range:1.4,speed:.7}),P(-1,-21,5,5,0,'conveyor'),P(2,-28,4.5,5,.4,'bounce'),P(0,-36,5.5,5,1),P(0,-43,7,7,.6)],
 [P(0,0,7,7),P(-1,-7,5,5,0,'bounce'),P(1,-15,5,5,1),P(-1,-22,5,5,.5,'moving',{axis:'x',range:1.2,speed:.8}),P(2,-29,5,5,.5,'bounce'),P(0,-37,5,5,1.4),P(-1,-44,5,5,.7,'conveyor'),P(0,-51,7,7,.6)],
 [P(0,0,7,7),P(0,-7,5.5,5,0,'ice'),P(-1.5,-14,5,5,0,'ice'),P(1,-21,5.5,5),P(0,-28,5.5,5,0,'ice'),P(0,-35,7,7)],
 [P(0,0,7,7),P(-1,-7,5,5,0,'ice'),P(1,-14,5,5,0,'moving',{axis:'x',range:1.1,speed:.7}),P(-1,-21,5,5,0,'ice'),P(1,-28,5,5,0,'ice'),P(-1,-35,5,5),P(0,-42,7,7)],
 [P(0,0,7,7),P(1,-7,5,5,0,'ice'),P(-1,-14,5,5,0,'moving',{axis:'x',range:1.2,speed:.8}),P(1,-21,5,5,0,'ice'),P(-1,-28,5,5,.2),P(1,-35,5,5,.2,'moving',{axis:'x',range:1.2,speed:.7}),P(0,-42,5,5,0,'ice'),P(0,-49,7,7)]
];
const names=['Premiers tours de piste','La piste des étoiles','Le grand final de Luna','La vallée Cookie Dough','La rivière Choco Bons','Le château des délices','La tournée des cadeaux','Le lac aux aurores','Minuit, tous les deux'];
const tips=['Le joystick te déplace. Saute au bord des îles. Les trois notes ouvrent le portail.','Les bandes roses accélèrent tes rollers. Attends le bon moment pour rejoindre la plateforme mobile.','Le sprint traverse les grands sauts. Les barrières lumineuses se franchissent en sautant.','Les guimauves roses te propulsent automatiquement. Dirige-toi dans les airs pour atterrir.','Le chocolat, c’est délicieux… sauf quand tu tombes dedans. Attention aux biscuits qui bougent.','Les rubans de caramel te poussent sur le côté. Compense avec le joystick.','Trois cadeaux à récupérer, un traîneau à retrouver. La glace demande des gestes doux.','Les boules de neige traversent la piste. Freine avant les bords et saute au bon moment.','Le dernier portail t’attend. Prends ton temps : les plus beaux voyages se font ensemble.'];
export const LEVELS=layouts.map((platforms,i)=>{
 // Longer second and third stages introduce combinations of each world's mechanics.
 if(i%3>0){const finish=platforms.pop(),base=platforms.at(-1);const count=i%3===1?3:5;for(let k=0;k<count;k++){const world=Math.floor(i/3),kind=world===0?(k%2?'boost':'normal'):world===1?(k%3===1?'conveyor':k%3===2?'bounce':'normal'):(k%2?'ice':'normal');platforms.push(P(Math.sin(k*1.8+i)*1.5,base.z-(k+1)*7,5.5,5.5,0,kind));}finish.z=platforms.at(-1).z-7;finish.y=0;platforms.push(finish);}
 const middle=Math.floor((platforms.length-1)/2),last=platforms.length-1;
 const targets=[1,middle,last-1];
 // Distinct target islands, including shorter introductory courses.
 const unique=[...new Set(targets)];while(unique.length<3)unique.push(unique[unique.length-1]+1);
 return {id:i,world:Math.floor(i/3),number:i%3+1,name:names[i],tip:tips[i],par:65+i%3*15,platforms,
  relics:unique.map((p,k)=>({platform:p,x:k===1?.65:0,z:0})),
  coins:platforms.flatMap((p,j)=>j===0?[]:[-1.2,0,1.2].map((z,k)=>({platform:j,x:(j%2?-.9:.9),z:z+.6}))),
  hazards: i===0?[{platform:4,...H(0,0,'x',1.55,1.4)}]:platforms.slice(1,-1).flatMap((p,j)=>((j+i)%2===0||i%3===2)?[{platform:j+1,...H(0,-.65,'x',Math.max(.8,p.w/2-.8),1.3+(i%3)*.3)}]:[]),
  checkpoint:middle,goal:{platform:last,x:0,z:-1.1},
 };
});
export const MEMORIES=[
 {title:'Un commentaire. Tout un monde.',text:'Pendant mon live TikTok, tu m’as demandé de t’ajouter et de t’envoyer un message. Tu cherchais une conversation. Moi, sans le savoir, je venais de trouver ma personne.'},
 {title:'Ce soir de décembre.',image:'IMG_5794.jpeg',text:'Il faisait froid. On était dans ma voiture, les vitres embuées. Un bisou sur ta joue. Puis tes lèvres sur les miennes. Et le reste du monde pouvait bien attendre.'},
 {title:'Ma plus belle partenaire.',text:'Je n’ai pas besoin de savoir patiner parfaitement. Tant que c’est avec toi, je suis prêt à tomber, à rire… et à recommencer.'},
 {title:'Juste une dernière cuillère.',text:'Un pot de Cookie Dough, des Choco Bons, et toi tout près. Voilà. J’ai décrit une très grande soirée avec de toutes petites choses.'},
 {title:'Ta façon de dire je t’aime.',image:'IMG_5800.jpeg',text:'Une initiale, une attention, un détail que tu aurais pu oublier. Mais non. Tu penses à moi jusque dans les petites choses. Et moi, je les garde toutes.'},
 {title:'La recette préférée.',image:'IMG_5799.jpeg',text:'Ce n’est pas compliqué : un peu de toi, un peu de moi, beaucoup de rires. Même les jours ordinaires ont meilleur goût depuis que tu es là.'},
 {title:'Notre premier Noël.',image:'IMG_5796.jpeg',text:'J’aime les lumières et les cadeaux. Mais ce que je veux garder de notre premier Noël, c’est toi. Ta présence. Nous deux dans le même souvenir.'},
 {title:'Tout ce qui reste.',image:'IMG_5797.jpeg',text:'Les lettres, les cadeaux, les petites attentions… Derrière chacun, je retrouve la même chose : ta manière à toi de rendre ma vie plus douce.'},
 {title:'Et maintenant, nous.',image:'IMG_5798.jpeg',text:'Tu as traversé tous ces mondes. Moi, celui que je préfère, c’est celui où je me réveille en sachant que tu es dans ma vie. Joyeux anniversaire à nous, mon amour.'}
];
