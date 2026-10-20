import test from 'node:test';
import assert from 'node:assert/strict';
import { Session } from '../src/adventure/physics.js';
import { LEVELS } from '../src/adventure/levels.js';
import { snapshot,validateRun,restore,normalizeRecords,parseBackup,mergeRecords } from '../src/adventure/progress.js';

test('Une reprise restitue le checkpoint, les objets, les cœurs et les deux temps',()=>{
 const session=new Session(LEVELS[1]);session.checkpoint=LEVELS[1].checkpoint;session.time=12;session.elapsed=20;session.hp=2;session.falls=1;session.relics.add(0);session.coins.add(2);
 const data=validateRun(JSON.parse(JSON.stringify(snapshot(session))),LEVELS);assert.ok(data);
 const next=restore(new Session(LEVELS[1]),data);assert.deepEqual(snapshot(next),snapshot(session));assert.equal(next.player.ground,session.checkpoint);assert.equal(next.player.vx,0);assert.equal(next.player.x,next.platforms[session.checkpoint].x);assert.equal(next.invulnerable,2.5);
});
test('Une sauvegarde corrompue ne permet pas de sortir des niveaux ou des objets',()=>{
 const data=snapshot(new Session(LEVELS[0]));
 for(const bad of [{...data,version:3},{...data,level:9},{...data,checkpoint:99},{...data,hp:0},{...data,relics:[0,0]},{...data,coins:[999]},{...data,time:Infinity},{...data,falls:.5}])assert.equal(validateRun(bad,LEVELS),null);
 const lost=new Session(LEVELS[0]);lost.status='lost';assert.equal(snapshot(lost),null);
});
test('Les anciens records restent compatibles et une importation conserve les meilleurs',()=>{
 const old=normalizeRecords({0:{stars:3,time:15,coins:20},9:{stars:3},1:{stars:'2'}});assert.deepEqual(old,{0:{stars:3,time:15,coins:20}});
 const incoming={0:{stars:1,time:30,coins:2,realTime:40},2:{stars:2,time:25,coins:10}};
 const merged=mergeRecords(old,incoming);assert.equal(merged[0].stars,3);assert.equal(merged[0].time,15);assert.equal(merged[0].coins,20);assert.equal(merged[0].realTime,40);assert.equal(merged[2].stars,2);assert.equal(old[0].realTime,undefined);
});
test('Le fichier exporté peut être importé et les formats étrangers sont refusés',()=>{
 const payload={format:'mariam-backup',version:1,adventure:{records:{0:{stars:2,time:12,coins:5}}},checkpoint:snapshot(new Session(LEVELS[0]))};
 assert.equal(parseBackup(JSON.stringify(payload),LEVELS).run.level,0);
 for(const bad of [{...payload,format:'other'},{...payload,checkpoint:{version:99}},{...payload,adventure:{records:[]}},{...payload,adventure:{records:{9:{stars:3}}}}])assert.throws(()=>parseBackup(JSON.stringify(bad),LEVELS));
});
