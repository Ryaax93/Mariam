import fs from 'node:fs/promises';import {execFileSync} from 'node:child_process';
const sha='3e981a4416291b99adab8a23fc81d7582323d43b';
try{execFileSync('git',['cat-file','-e',sha],{stdio:'ignore'});}catch{execFileSync('git',['fetch','--depth=1','origin',sha],{stdio:'inherit'});}
await fs.mkdir('.luna-v1',{recursive:true});
for(const file of ['world.js','camera.js','track.js','character.js','simulation.js','audio.js','main.js','index.html','style.css'])await fs.writeFile('.luna-v1/'+file,execFileSync('git',['show',sha+':experience/soy-luna/'+file]));
